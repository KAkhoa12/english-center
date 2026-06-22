from datetime import date, time, timedelta
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.attendance import AttendanceStatus
from app.models.class_model import ClassStatus, CourseClass
from app.models.class_session import ClassSchedule, ClassSession, SessionMode, SessionStatus
from app.models.course import Lesson
from app.models.room import Room, RoomStatus
from app.models.teacher import Teacher
from app.models.rbac.user import User
from app.repositories.attendance import AttendanceRepository
from app.repositories.class_schedule import ClassScheduleRepository
from app.repositories.class_session import ClassSessionRepository
from app.repositories.class_student import ClassStudentRepository
from app.repositories.lesson import LessonRepository
from app.repositories.room import RoomRepository
from app.repositories.teacher import TeacherRepository
from app.repositories.user import UserRepository
from app.schemas.class_session import ClassSessionBulkCreate, ClassSessionCreate, ClassSessionUpdate
from app.schemas.common import PaginationParams
from app.services.class_service import AcademicAccessMixin, ClassService, _enum, _enum_required
from app.services.course_service import CourseService


SCHEDULE_WEEKDAY_MAP = {
    "T2": 0,
    "T3": 1,
    "T4": 2,
    "T5": 3,
    "T6": 4,
    "T7": 5,
    "CN": 6,
}


class ClassSessionService(AcademicAccessMixin):
    def __init__(self, db: Session) -> None:
        super().__init__(db)
        self.session_repo = ClassSessionRepository(db)
        self.schedule_repo = ClassScheduleRepository(db)
        self.class_student_repo = ClassStudentRepository(db)
        self.attendance_repo = AttendanceRepository(db)
        self.room_repo = RoomRepository(db)
        self.teacher_repo = TeacherRepository(db)
        self.lesson_repo = LessonRepository(db)
        self.user_repo = UserRepository(db)

    def _get_room(self, room_id: str | None) -> Room | None:
        if not room_id:
            return None
        room = self.room_repo.get_active_by_id(room_id)
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        return room

    def _get_teacher(self, teacher_id: str | None) -> Teacher | None:
        if not teacher_id:
            return None
        teacher = self.teacher_repo.get_active_by_id(teacher_id)
        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")
        return teacher

    def _get_lesson(self, lesson_id: str | None) -> Lesson | None:
        if not lesson_id:
            return None
        lesson = self.lesson_repo.get_active_by_id(lesson_id)
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")
        return lesson

    def _get_schedule(self, schedule_id: str, class_id: str | None = None) -> ClassSchedule:
        schedule = self.schedule_repo.get_active_by_id(schedule_id)
        if not schedule:
            raise HTTPException(status_code=404, detail="Class schedule not found")
        if class_id and str(schedule.class_id) != str(class_id):
            raise HTTPException(status_code=400, detail="Class schedule does not belong to this class")
        return schedule

    def _resolved_times(self, schedule: ClassSchedule, override_start_time: time | None, override_end_time: time | None) -> tuple[time, time]:
        start_time = override_start_time or schedule.start_time
        end_time = override_end_time or schedule.end_time
        if end_time <= start_time:
            raise HTTPException(status_code=400, detail="end_time must be greater than start_time")
        return start_time, end_time

    def _schedule_dict(self, schedule: ClassSchedule) -> dict[str, Any]:
        return {
            "id": str(schedule.id),
            "class_id": str(schedule.class_id),
            "schedule_name": schedule.schedule_name.value,
            "start_time": schedule.start_time,
            "end_time": schedule.end_time,
        }

    def _teacher_scope_id(self, user: User | None) -> str | None:
        if not user:
            return None
        roles = self.rbac_service.get_user_roles(str(user.id))
        if "teacher" not in roles or "admin" in roles or "staff" in roles:
            return None
        teacher = self.get_teacher_profile_by_user(str(user.id))
        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher profile not found")
        return str(teacher.id)

    def _assert_session_access(self, session: ClassSession, user: User | None) -> None:
        teacher_id = self._teacher_scope_id(user)
        if not teacher_id:
            return
        class_obj = ClassService(self.db).get_class_by_id(str(session.class_id))
        if (session.teacher_id and str(session.teacher_id) == teacher_id) or (
            class_obj.teacher_id and str(class_obj.teacher_id) == teacher_id
        ):
            return
        raise HTTPException(status_code=403, detail="Permission denied")

    def _validate_payload(
        self,
        class_obj: CourseClass,
        mode: SessionMode,
        room: Room | None,
        teacher: Teacher | None,
        lesson: Lesson | None,
        session_date: date,
        start_time: time,
        end_time: time,
        exclude_session_id: str | None = None,
        meeting_url: str | None = None,
    ) -> Teacher | None:
        if class_obj.status in {ClassStatus.cancelled, ClassStatus.completed, ClassStatus.archived}:
            raise HTTPException(status_code=400, detail="Cannot create or update session for this class")
        if end_time <= start_time:
            raise HTTPException(status_code=400, detail="end_time must be greater than start_time")
        if mode == SessionMode.offline and not room:
            raise HTTPException(status_code=400, detail="room_id is required for offline sessions")
        if room and room.status != RoomStatus.active:
            raise HTTPException(status_code=400, detail="Room is not available")
        if lesson and str(lesson.course_id) != str(class_obj.course_id):
            raise HTTPException(status_code=400, detail="Lesson does not belong to class course")
        teacher = teacher or (self._get_teacher(str(class_obj.teacher_id)) if class_obj.teacher_id else None)
        self.check_class_conflict(str(class_obj.id), session_date, start_time, end_time, exclude_session_id)
        return teacher

    def _session_summary(self, session: ClassSession) -> dict[str, int]:
        total_students = self.class_student_repo.count_active_students(str(session.class_id))
        counts = {status.value: 0 for status in AttendanceStatus}
        rows = self.attendance_repo.count_group_by_status(str(session.id))
        marked_records = 0
        for status, count in rows:
            counts[status.value] = int(count)
            marked_records += int(count)
        counts[AttendanceStatus.not_marked.value] = max(total_students - marked_records, counts[AttendanceStatus.not_marked.value])
        return counts

    def session_list_dict(self, session: ClassSession) -> dict[str, Any]:
        return {
            "id": str(session.id),
            "class_id": str(session.class_id),
            "teacher_id": str(session.teacher_id) if session.teacher_id else None,
            "lesson_id": str(session.lesson_id) if session.lesson_id else None,
            "room_id": str(session.room_id) if session.room_id else None,
            "title": session.title,
            "description": session.description,
            "session_date": session.session_date,
            "class_schedule_id": str(session.class_schedule_id),
            "schedule": self._schedule_dict(schedule) if (schedule := self._get_schedule(str(session.class_schedule_id))) else None,
            "start_time": (session.override_start_time or schedule.start_time),
            "end_time": (session.override_end_time or schedule.end_time),
            "override_start_time": session.override_start_time,
            "override_end_time": session.override_end_time,
            "mode": session.mode.value,
            "meeting_url": session.meeting_url,
            "status": session.status.value,
            "note": session.note,
        }

    def session_detail_dict(self, session: ClassSession) -> dict[str, Any]:
        class_obj = ClassService(self.db).get_class_by_id(str(session.class_id))
        course = CourseService(self.db).get_course_by_id(str(class_obj.course_id))
        teacher = self._get_teacher(str(session.teacher_id)) if session.teacher_id else None
        teacher_user = self.user_repo.get(str(teacher.user_id)) if teacher else None
        room = self._get_room(str(session.room_id)) if session.room_id else None
        lesson = self._get_lesson(str(session.lesson_id)) if session.lesson_id else None
        data = self.session_list_dict(session)
        data.update(
            {
                "class": {"id": str(class_obj.id), "name": class_obj.name},
                "course": {"id": str(course.id), "name": course.name},
                "teacher": (
                    {"id": str(teacher.id), "full_name": teacher_user.full_name, "email": teacher_user.email}
                    if teacher and teacher_user
                    else None
                ),
                "room": {"id": str(room.id), "name": room.name} if room else None,
                "lesson": {"id": str(lesson.id), "title": lesson.title} if lesson else None,
                "attendance_summary": self._session_summary(session),
            }
        )
        return data

    def create_session(self, class_id: str, payload: ClassSessionCreate) -> ClassSession:
        class_obj = ClassService(self.db).get_class_by_id(class_id)
        schedule = self._get_schedule(payload.class_schedule_id, class_id=str(class_obj.id))
        mode = _enum_required(SessionMode, payload.mode, "session mode")
        room = self._get_room(payload.room_id or (str(class_obj.room_id) if class_obj.room_id and mode == SessionMode.offline else None))
        teacher = self._get_teacher(payload.teacher_id)
        lesson = self._get_lesson(payload.lesson_id)
        start_time, end_time = self._resolved_times(schedule, payload.override_start_time, payload.override_end_time)
        teacher = self._validate_payload(
            class_obj,
            mode,
            room,
            teacher,
            lesson,
            payload.session_date,
            start_time,
            end_time,
            meeting_url=payload.meeting_url,
        )
        session = ClassSession(
            class_id=str(class_obj.id),
            class_schedule_id=str(schedule.id),
            teacher_id=str(teacher.id) if teacher else None,
            lesson_id=str(lesson.id) if lesson else None,
            room_id=str(room.id) if room else None,
            title=payload.title.strip(),
            description=payload.description,
            session_date=payload.session_date,
            override_start_time=payload.override_start_time,
            override_end_time=payload.override_end_time,
            mode=mode,
            meeting_url=payload.meeting_url if mode == SessionMode.online else None,
            status=SessionStatus.scheduled,
            note=payload.note,
        )
        created = self.session_repo.create(session)
        self.db.commit()
        return created

    def create_sessions_bulk(self, class_id: str, payload: ClassSessionBulkCreate) -> list[ClassSession]:
        class_obj = ClassService(self.db).get_class_by_id(class_id)
        CourseService(self.db).get_course_by_id(str(class_obj.course_id))
        schedules = [self._get_schedule(schedule_id, class_id=str(class_obj.id)) for schedule_id in payload.class_schedule_ids]
        mode = _enum_required(SessionMode, payload.mode, "session mode")
        room = self._get_room(payload.room_id or (str(class_obj.room_id) if class_obj.room_id and mode == SessionMode.offline else None))
        teacher = self._get_teacher(payload.teacher_id)
        lesson = self._get_lesson(payload.lesson_id)
        total_days = payload.weeks * 7
        dates = [payload.start_date + timedelta(days=offset) for offset in range(total_days)]
        schedule_dates = [
            (schedule, item)
            for schedule in schedules
            for item in dates
            if item.weekday() == SCHEDULE_WEEKDAY_MAP[schedule.schedule_name.value]
        ]
        schedule_dates.sort(key=lambda item: (item[1], item[0].start_time))
        if not schedule_dates:
            raise HTTPException(status_code=400, detail="No session dates generated")

        created: list[ClassSession] = []
        try:
            for index, (schedule, session_date) in enumerate(schedule_dates, start=1):
                resolved_teacher = self._validate_payload(
                    class_obj,
                    mode,
                    room,
                    teacher,
                    lesson,
                    session_date,
                    schedule.start_time,
                    schedule.end_time,
                    meeting_url=payload.meeting_url,
                )
                session = ClassSession(
                    class_id=str(class_obj.id),
                    class_schedule_id=str(schedule.id),
                    teacher_id=str(resolved_teacher.id) if resolved_teacher else None,
                    lesson_id=str(lesson.id) if lesson else None,
                    room_id=str(room.id) if room else None,
                    title=f"{payload.title_prefix.strip() or 'Buổi'} {index}",
                    description=payload.description,
                    session_date=session_date,
                    override_start_time=None,
                    override_end_time=None,
                    mode=mode,
                    meeting_url=payload.meeting_url if mode == SessionMode.online else None,
                    status=SessionStatus.scheduled,
                    note=payload.note,
                )
                created.append(self.session_repo.create(session))
            self.db.commit()
            return created
        except Exception:
            self.db.rollback()
            raise

    def get_sessions_by_class(
        self,
        class_id: str,
        query: PaginationParams,
        status: str | None = None,
        mode: str | None = None,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> tuple[list[ClassSession], int]:
        ClassService(self.db).get_class_by_id(class_id)
        return self.session_repo.list_filtered_by_class(
            class_id=class_id,
            query=query,
            status=_enum(SessionStatus, status, "session status") if status else None,
            mode=_enum(SessionMode, mode, "session mode") if mode else None,
            from_date=from_date,
            to_date=to_date,
        )

    def get_sessions(
        self,
        query: PaginationParams,
        class_id: str | None = None,
        course_id: str | None = None,
        class_ids: list[str] | None = None,
        course_ids: list[str] | None = None,
        teacher_id: str | None = None,
        room_id: str | None = None,
        status: str | None = None,
        mode: str | None = None,
        from_date: date | None = None,
        to_date: date | None = None,
        current_user: User | None = None,
    ) -> tuple[list[ClassSession], int]:
        return self.session_repo.list_filtered(
            query=query,
            class_id=class_id,
            course_id=course_id,
            class_ids=class_ids,
            course_ids=course_ids,
            teacher_id=teacher_id,
            accessible_teacher_id=self._teacher_scope_id(current_user),
            room_id=room_id,
            status=_enum(SessionStatus, status, "session status") if status else None,
            mode=_enum(SessionMode, mode, "session mode") if mode else None,
            from_date=from_date,
            to_date=to_date,
        )

    def get_session_by_id(self, session_id: str) -> ClassSession:
        session = self.session_repo.get_active_by_id(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Class session not found")
        return session

    def get_session_for_user(self, session_id: str, current_user: User | None = None) -> ClassSession:
        session = self.get_session_by_id(session_id)
        self._assert_session_access(session, current_user)
        return session

    def update_session(self, session_id: str, payload: ClassSessionUpdate) -> ClassSession:
        session = self.get_session_by_id(session_id)
        class_obj = ClassService(self.db).get_class_by_id(str(session.class_id))
        fields_set = payload.model_fields_set
        if session.status == SessionStatus.completed and any(
            getattr(payload, field) is not None
            for field in ["class_schedule_id", "teacher_id", "lesson_id", "room_id", "session_date", "override_start_time", "override_end_time", "mode"]
        ):
            raise HTTPException(status_code=400, detail="Completed session cannot be rescheduled")
        schedule = self._get_schedule(payload.class_schedule_id, class_id=str(class_obj.id)) if payload.class_schedule_id is not None else self._get_schedule(str(session.class_schedule_id), class_id=str(class_obj.id))
        teacher = self._get_teacher(payload.teacher_id) if "teacher_id" in fields_set else (self._get_teacher(str(session.teacher_id)) if session.teacher_id else None)
        lesson = self._get_lesson(payload.lesson_id) if "lesson_id" in fields_set else (self._get_lesson(str(session.lesson_id)) if session.lesson_id else None)
        room = self._get_room(payload.room_id) if "room_id" in fields_set else (self._get_room(str(session.room_id)) if session.room_id else None)
        mode = _enum_required(SessionMode, payload.mode, "session mode") if "mode" in fields_set and payload.mode is not None else session.mode
        session_date = payload.session_date or session.session_date
        override_start_time = payload.override_start_time if "override_start_time" in fields_set else session.override_start_time
        override_end_time = payload.override_end_time if "override_end_time" in fields_set else session.override_end_time
        start_time, end_time = self._resolved_times(schedule, override_start_time, override_end_time)
        meeting_url = payload.meeting_url if "meeting_url" in fields_set else session.meeting_url
        teacher = self._validate_payload(
            class_obj,
            mode,
            room,
            teacher,
            lesson,
            session_date,
            start_time,
            end_time,
            exclude_session_id=session_id,
            meeting_url=meeting_url,
        )
        if "title" in fields_set and payload.title is not None:
            session.title = payload.title.strip()
        for field in ["description", "meeting_url", "note"]:
            if field in fields_set:
                setattr(session, field, getattr(payload, field))
        session.teacher_id = str(teacher.id) if teacher else None
        session.class_schedule_id = str(schedule.id)
        session.lesson_id = str(lesson.id) if lesson else None
        session.room_id = str(room.id) if room else None
        session.mode = mode
        if mode == SessionMode.offline:
            session.meeting_url = None
        session.session_date = session_date
        session.override_start_time = override_start_time
        session.override_end_time = override_end_time
        if payload.status is not None:
            session.status = _enum_required(SessionStatus, payload.status, "session status")
        updated = self.session_repo.update(session)
        self.db.commit()
        return updated

    def cancel_session(self, session_id: str) -> None:
        session = self.get_session_by_id(session_id)
        session.status = SessionStatus.cancelled
        self.session_repo.soft_delete(session)
        self.db.commit()

    def check_room_conflict(
        self,
        room_id: str,
        session_date: date,
        start_time: time,
        end_time: time,
        exclude_session_id: str | None = None,
    ) -> None:
        conflict = self.session_repo.find_room_conflict(room_id, session_date, start_time, end_time, exclude_session_id)
        if conflict:
            raise HTTPException(status_code=400, detail="Room schedule conflict detected")

    def check_class_conflict(
        self,
        class_id: str,
        session_date: date,
        start_time: time,
        end_time: time,
        exclude_session_id: str | None = None,
    ) -> None:
        conflict = self.session_repo.find_class_conflict(class_id, session_date, start_time, end_time, exclude_session_id)
        if conflict:
            raise HTTPException(status_code=400, detail="Class schedule conflict detected")

    def check_teacher_conflict(
        self,
        teacher_id: str,
        session_date: date,
        start_time: time,
        end_time: time,
        exclude_session_id: str | None = None,
    ) -> None:
        conflict = self.session_repo.find_teacher_conflict(teacher_id, session_date, start_time, end_time, exclude_session_id)
        if conflict:
            raise HTTPException(status_code=400, detail="Teacher schedule conflict detected")

    def get_my_sessions(
        self,
        user: User,
        query: PaginationParams,
        status: str | None = None,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> tuple[list[ClassSession], int]:
        student = self.get_student_profile_by_user(str(user.id))
        if not student:
            raise HTTPException(status_code=404, detail="Student profile not found")
        return self.session_repo.list_my_sessions(
            student_id=str(student.id),
            query=query,
            status=_enum(SessionStatus, status, "session status") if status else None,
            from_date=from_date,
            to_date=to_date,
        )

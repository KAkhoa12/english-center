from datetime import date, datetime, time, timezone
from typing import Any

from fastapi import HTTPException
from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import Session

from app.models.attendance import Attendance, AttendanceStatus
from app.models.class_model import ClassStatus, CourseClass
from app.models.class_session import ClassSession, SessionMode, SessionStatus
from app.models.class_student import ClassEnrollmentStatus, ClassStudent
from app.models.course import Lesson
from app.models.room import Room, RoomStatus
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.user import User
from app.schemas.class_session import ClassSessionCreate, ClassSessionUpdate
from app.schemas.common import PaginationParams
from app.services.class_service import AcademicAccessMixin, ClassService, _enum
from app.services.course_service import CourseService


def _now() -> datetime:
    return datetime.now(timezone.utc)


class ClassSessionService(AcademicAccessMixin):
    def _get_room(self, room_id: str | None) -> Room | None:
        if not room_id:
            return None
        room = self.db.execute(select(Room).where(Room.id == room_id, Room.deleted_at.is_(None))).scalar_one_or_none()
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        return room

    def _get_teacher(self, teacher_id: str | None) -> Teacher | None:
        if not teacher_id:
            return None
        teacher = self.db.execute(select(Teacher).where(Teacher.id == teacher_id, Teacher.deleted_at.is_(None))).scalar_one_or_none()
        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")
        return teacher

    def _get_lesson(self, lesson_id: str | None) -> Lesson | None:
        if not lesson_id:
            return None
        lesson = self.db.execute(select(Lesson).where(Lesson.id == lesson_id, Lesson.deleted_at.is_(None))).scalar_one_or_none()
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")
        return lesson

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
        if mode == SessionMode.online and not meeting_url:
            raise HTTPException(status_code=400, detail="meeting_url is required for online sessions")
        if mode == SessionMode.offline and not room:
            raise HTTPException(status_code=400, detail="room_id is required for offline sessions")
        if room and room.status != RoomStatus.active:
            raise HTTPException(status_code=400, detail="Room is not available")
        if lesson and str(lesson.course_id) != str(class_obj.course_id):
            raise HTTPException(status_code=400, detail="Lesson does not belong to class course")
        teacher = teacher or (self._get_teacher(str(class_obj.teacher_id)) if class_obj.teacher_id else None)
        if room:
            self.check_room_conflict(str(room.id), session_date, start_time, end_time, exclude_session_id)
        if teacher:
            self.check_teacher_conflict(str(teacher.id), session_date, start_time, end_time, exclude_session_id)
        return teacher

    def _session_summary(self, session: ClassSession) -> dict[str, int]:
        total_students = int(
            self.db.execute(
                select(func.count())
                .select_from(ClassStudent)
                .where(
                    ClassStudent.class_id == session.class_id,
                    ClassStudent.deleted_at.is_(None),
                    ClassStudent.enrollment_status.notin_([ClassEnrollmentStatus.cancelled, ClassEnrollmentStatus.dropped]),
                )
            ).scalar_one()
        )
        counts = {status.value: 0 for status in AttendanceStatus}
        rows = self.db.execute(
            select(Attendance.status, func.count())
            .where(Attendance.session_id == session.id, Attendance.deleted_at.is_(None))
            .group_by(Attendance.status)
        ).all()
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
            "start_time": session.start_time,
            "end_time": session.end_time,
            "mode": session.mode.value,
            "meeting_url": session.meeting_url,
            "status": session.status.value,
            "note": session.note,
        }

    def session_detail_dict(self, session: ClassSession) -> dict[str, Any]:
        class_obj = ClassService(self.db).get_class_by_id(str(session.class_id))
        course = CourseService(self.db).get_course_by_id(str(class_obj.course_id))
        teacher = self._get_teacher(str(session.teacher_id)) if session.teacher_id else None
        teacher_user = self.db.execute(select(User).where(User.id == teacher.user_id, User.deleted_at.is_(None))).scalar_one_or_none() if teacher else None
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
        mode = _enum(SessionMode, payload.mode, "session mode")
        room = self._get_room(payload.room_id)
        teacher = self._get_teacher(payload.teacher_id)
        lesson = self._get_lesson(payload.lesson_id)
        teacher = self._validate_payload(
            class_obj,
            mode,
            room,
            teacher,
            lesson,
            payload.session_date,
            payload.start_time,
            payload.end_time,
            meeting_url=payload.meeting_url,
        )
        session = ClassSession(
            class_id=class_obj.id,
            teacher_id=teacher.id if teacher else None,
            lesson_id=lesson.id if lesson else None,
            room_id=room.id if room else None,
            title=payload.title.strip(),
            description=payload.description,
            session_date=payload.session_date,
            start_time=payload.start_time,
            end_time=payload.end_time,
            mode=mode,
            meeting_url=payload.meeting_url,
            status=SessionStatus.scheduled,
            note=payload.note,
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

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
        stmt = select(ClassSession).where(ClassSession.class_id == class_id, ClassSession.deleted_at.is_(None))
        if status:
            stmt = stmt.where(ClassSession.status == _enum(SessionStatus, status, "session status"))
        if mode:
            stmt = stmt.where(ClassSession.mode == _enum(SessionMode, mode, "session mode"))
        if from_date:
            stmt = stmt.where(ClassSession.session_date >= from_date)
        if to_date:
            stmt = stmt.where(ClassSession.session_date <= to_date)
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(ClassSession.session_date.asc(), ClassSession.start_time.asc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def get_session_by_id(self, session_id: str) -> ClassSession:
        session = self.db.execute(select(ClassSession).where(ClassSession.id == session_id, ClassSession.deleted_at.is_(None))).scalar_one_or_none()
        if not session:
            raise HTTPException(status_code=404, detail="Class session not found")
        return session

    def update_session(self, session_id: str, payload: ClassSessionUpdate) -> ClassSession:
        session = self.get_session_by_id(session_id)
        class_obj = ClassService(self.db).get_class_by_id(str(session.class_id))
        if session.status == SessionStatus.completed and any(
            getattr(payload, field) is not None
            for field in ["teacher_id", "lesson_id", "room_id", "session_date", "start_time", "end_time", "mode"]
        ):
            raise HTTPException(status_code=400, detail="Completed session cannot be rescheduled")
        teacher = self._get_teacher(payload.teacher_id) if payload.teacher_id is not None else (self._get_teacher(str(session.teacher_id)) if session.teacher_id else None)
        lesson = self._get_lesson(payload.lesson_id) if payload.lesson_id is not None else (self._get_lesson(str(session.lesson_id)) if session.lesson_id else None)
        room = self._get_room(payload.room_id) if payload.room_id is not None else (self._get_room(str(session.room_id)) if session.room_id else None)
        mode = _enum(SessionMode, payload.mode, "session mode") if payload.mode is not None else session.mode
        session_date = payload.session_date or session.session_date
        start_time = payload.start_time or session.start_time
        end_time = payload.end_time or session.end_time
        meeting_url = payload.meeting_url if payload.meeting_url is not None else session.meeting_url
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
        for field in ["title", "description", "meeting_url", "note"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(session, field, value.strip() if field == "title" else value)
        session.teacher_id = teacher.id if teacher else None
        session.lesson_id = lesson.id if lesson else None
        session.room_id = room.id if room else None
        session.mode = mode
        session.session_date = session_date
        session.start_time = start_time
        session.end_time = end_time
        if payload.status is not None:
            session.status = _enum(SessionStatus, payload.status, "session status")
        self.db.commit()
        self.db.refresh(session)
        return session

    def cancel_session(self, session_id: str) -> None:
        session = self.get_session_by_id(session_id)
        session.status = SessionStatus.cancelled
        session.deleted_at = _now()
        self.db.commit()

    def check_room_conflict(
        self,
        room_id: str,
        session_date: date,
        start_time: time,
        end_time: time,
        exclude_session_id: str | None = None,
    ) -> None:
        stmt = select(ClassSession).where(
            ClassSession.room_id == room_id,
            ClassSession.session_date == session_date,
            ClassSession.deleted_at.is_(None),
            ClassSession.status != SessionStatus.cancelled,
            ClassSession.start_time < end_time,
            ClassSession.end_time > start_time,
        )
        if exclude_session_id:
            stmt = stmt.where(ClassSession.id != exclude_session_id)
        conflict = self.db.execute(stmt).scalar_one_or_none()
        if conflict:
            raise HTTPException(status_code=400, detail="Room schedule conflict detected")

    def check_teacher_conflict(
        self,
        teacher_id: str,
        session_date: date,
        start_time: time,
        end_time: time,
        exclude_session_id: str | None = None,
    ) -> None:
        stmt = select(ClassSession).where(
            ClassSession.teacher_id == teacher_id,
            ClassSession.session_date == session_date,
            ClassSession.deleted_at.is_(None),
            ClassSession.status != SessionStatus.cancelled,
            ClassSession.start_time < end_time,
            ClassSession.end_time > start_time,
        )
        if exclude_session_id:
            stmt = stmt.where(ClassSession.id != exclude_session_id)
        conflict = self.db.execute(stmt).scalar_one_or_none()
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
        stmt = (
            select(ClassSession)
            .join(ClassStudent, ClassStudent.class_id == ClassSession.class_id)
            .where(
                ClassStudent.student_id == student.id,
                ClassStudent.deleted_at.is_(None),
                ClassSession.deleted_at.is_(None),
            )
        )
        if status:
            stmt = stmt.where(ClassSession.status == _enum(SessionStatus, status, "session status"))
        if from_date:
            stmt = stmt.where(ClassSession.session_date >= from_date)
        if to_date:
            stmt = stmt.where(ClassSession.session_date <= to_date)
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(ClassSession.session_date.asc(), ClassSession.start_time.asc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

from datetime import date, datetime, timezone
from typing import Any

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.attendance import Attendance, AttendanceStatus
from app.models.class_model import CourseClass
from app.models.class_session import ClassSession, SessionStatus
from app.models.class_student import ClassEnrollmentStatus, ClassStudent
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.user import User
from app.schemas.attendance import AttendanceBulkItem, AttendanceUpdateRequest
from app.schemas.common import PaginationParams
from app.services.class_service import AcademicAccessMixin, ClassService, _enum
from app.services.class_session_service import ClassSessionService
from app.services.course_service import CourseService
from app.utils.serializers import user_to_dict


def _now() -> datetime:
    return datetime.now(timezone.utc)


class AttendanceService(AcademicAccessMixin):
    def _teacher_can_view_student(self, student_id: str, user: User) -> bool:
        teacher = self.get_teacher_profile_by_user(str(user.id))
        if not teacher:
            return False
        mapping = self.db.execute(
            select(ClassStudent)
            .join(CourseClass, CourseClass.id == ClassStudent.class_id)
            .where(
                ClassStudent.student_id == student_id,
                ClassStudent.deleted_at.is_(None),
                CourseClass.teacher_id == teacher.id,
                CourseClass.deleted_at.is_(None),
            )
        ).scalar_one_or_none()
        return mapping is not None

    def _get_attendance(self, attendance_id: str) -> Attendance:
        item = self.db.execute(select(Attendance).where(Attendance.id == attendance_id, Attendance.deleted_at.is_(None))).scalar_one_or_none()
        if not item:
            raise HTTPException(status_code=404, detail="Attendance not found")
        return item

    def _get_class_student_ids(self, class_id: str) -> set[str]:
        items = self.db.execute(
            select(ClassStudent.student_id).where(
                ClassStudent.class_id == class_id,
                ClassStudent.deleted_at.is_(None),
                ClassStudent.enrollment_status.notin_([ClassEnrollmentStatus.cancelled, ClassEnrollmentStatus.dropped]),
            )
        ).scalars().all()
        return {str(item) for item in items}

    def _assert_teacher_can_record(self, session: ClassSession, user: User) -> None:
        if self.has_any_permission(user, "admin.all", "attendance.all"):
            return
        teacher = self.get_teacher_profile_by_user(str(user.id))
        if not teacher:
            raise HTTPException(status_code=403, detail="Permission denied")
        class_obj = ClassService(self.db).get_class_by_id(str(session.class_id))
        if (session.teacher_id and str(session.teacher_id) == str(teacher.id)) or (
            class_obj.teacher_id and str(class_obj.teacher_id) == str(teacher.id)
        ):
            return
        raise HTTPException(status_code=403, detail="Permission denied")

    def attendance_dict(self, attendance: Attendance, student: Student | None = None, user: User | None = None) -> dict[str, Any]:
        student = student or self.db.execute(select(Student).where(Student.id == attendance.student_id, Student.deleted_at.is_(None))).scalar_one()
        user = user or self.db.execute(select(User).where(User.id == student.user_id, User.deleted_at.is_(None))).scalar_one()
        recorder = None
        if attendance.recorded_by:
            recorder = self.db.execute(select(User).where(User.id == attendance.recorded_by, User.deleted_at.is_(None))).scalar_one_or_none()
        return {
            "id": str(attendance.id),
            "session_id": str(attendance.session_id),
            "class_id": str(attendance.class_id),
            "student_id": str(attendance.student_id),
            "student": user_to_dict(user, include_meta=False),
            "status": attendance.status.value,
            "check_in_time": attendance.check_in_time,
            "note": attendance.note,
            "recorded_by": user_to_dict(recorder, include_meta=False) if recorder else None,
            "recorded_at": attendance.recorded_at,
        }

    def _attendance_with_default(self, session: ClassSession, student: Student, user: User, attendance: Attendance | None) -> dict[str, Any]:
        if attendance:
            return self.attendance_dict(attendance, student=student, user=user)
        return {
            "id": None,
            "session_id": str(session.id),
            "class_id": str(session.class_id),
            "student_id": str(student.id),
            "student": user_to_dict(user, include_meta=False),
            "status": AttendanceStatus.not_marked.value,
            "check_in_time": None,
            "note": None,
            "recorded_by": None,
            "recorded_at": None,
        }

    def mark_attendance_bulk(self, session_id: str, payload: list[AttendanceBulkItem], current_user: User) -> list[Attendance]:
        session = ClassSessionService(self.db).get_session_by_id(session_id)
        if session.status == SessionStatus.cancelled:
            raise HTTPException(status_code=400, detail="Cannot mark attendance for cancelled session")
        self._assert_teacher_can_record(session, current_user)
        class_student_ids = self._get_class_student_ids(str(session.class_id))
        results: list[Attendance] = []
        try:
            for item in payload:
                if item.student_id not in class_student_ids:
                    raise HTTPException(status_code=400, detail="Student does not belong to class")
                status = _enum(AttendanceStatus, item.status, "attendance status")
                attendance = self.db.execute(
                    select(Attendance).where(Attendance.session_id == session.id, Attendance.student_id == item.student_id)
                ).scalar_one_or_none()
                if attendance:
                    attendance.deleted_at = None
                else:
                    attendance = Attendance(session_id=session.id, class_id=session.class_id, student_id=item.student_id)
                    self.db.add(attendance)
                attendance.status = status
                attendance.check_in_time = item.check_in_time
                attendance.note = item.note
                attendance.recorded_by = current_user.id
                attendance.recorded_at = _now()
                results.append(attendance)
            self.db.flush()
            active_student_count = len(class_student_ids)
            marked_count = int(
                self.db.execute(
                    select(func.count())
                    .select_from(Attendance)
                    .where(
                        Attendance.session_id == session.id,
                        Attendance.deleted_at.is_(None),
                        Attendance.status != AttendanceStatus.not_marked,
                    )
                ).scalar_one()
            )
            if active_student_count > 0 and marked_count >= active_student_count:
                session.status = SessionStatus.completed
            self.db.commit()
            for item in results:
                self.db.refresh(item)
            return results
        except Exception:
            self.db.rollback()
            raise

    def get_attendance_by_session(
        self,
        session_id: str,
        query: PaginationParams,
        status: str | None = None,
    ) -> tuple[list[dict[str, Any]], int]:
        session = ClassSessionService(self.db).get_session_by_id(session_id)
        rows = self.db.execute(
            select(ClassStudent, Student, User)
            .join(Student, Student.id == ClassStudent.student_id)
            .join(User, User.id == Student.user_id)
            .where(
                ClassStudent.class_id == session.class_id,
                ClassStudent.deleted_at.is_(None),
                Student.deleted_at.is_(None),
                User.deleted_at.is_(None),
            )
        ).all()
        attendance_rows = self.db.execute(
            select(Attendance).where(Attendance.session_id == session.id, Attendance.deleted_at.is_(None))
        ).scalars().all()
        attendance_map = {str(item.student_id): item for item in attendance_rows}
        items: list[dict[str, Any]] = []
        for _, student, user in rows:
            data = self._attendance_with_default(session, student, user, attendance_map.get(str(student.id)))
            if query.search:
                term = query.search.lower()
                if term not in (user.full_name or "").lower() and term not in (user.email or "").lower() and term not in (user.phone or "").lower():
                    continue
            if status and data["status"] != status:
                continue
            items.append(data)
        total = len(items)
        start = (query.page - 1) * query.page_size
        end = start + query.page_size
        return items[start:end], total

    def update_attendance(self, attendance_id: str, payload: AttendanceUpdateRequest, current_user: User) -> Attendance:
        attendance = self._get_attendance(attendance_id)
        session = ClassSessionService(self.db).get_session_by_id(str(attendance.session_id))
        self._assert_teacher_can_record(session, current_user)
        if payload.status is not None:
            attendance.status = _enum(AttendanceStatus, payload.status, "attendance status")
        if payload.check_in_time is not None:
            attendance.check_in_time = payload.check_in_time
        if payload.note is not None:
            attendance.note = payload.note
        attendance.recorded_by = current_user.id
        attendance.recorded_at = _now()
        self.db.commit()
        self.db.refresh(attendance)
        return attendance

    def soft_delete_attendance(self, attendance_id: str, current_user: User) -> None:
        attendance = self._get_attendance(attendance_id)
        session = ClassSessionService(self.db).get_session_by_id(str(attendance.session_id))
        self._assert_teacher_can_record(session, current_user)
        attendance.deleted_at = _now()
        self.db.commit()

    def get_attendance_by_class(
        self,
        class_id: str,
        query: PaginationParams,
        session_id: str | None = None,
        student_id: str | None = None,
        status: str | None = None,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> tuple[list[Attendance], int]:
        ClassService(self.db).get_class_by_id(class_id)
        stmt = select(Attendance).join(ClassSession, ClassSession.id == Attendance.session_id).where(
            Attendance.class_id == class_id,
            Attendance.deleted_at.is_(None),
            ClassSession.deleted_at.is_(None),
        )
        if session_id:
            stmt = stmt.where(Attendance.session_id == session_id)
        if student_id:
            stmt = stmt.where(Attendance.student_id == student_id)
        if status:
            stmt = stmt.where(Attendance.status == _enum(AttendanceStatus, status, "attendance status"))
        if from_date:
            stmt = stmt.where(ClassSession.session_date >= from_date)
        if to_date:
            stmt = stmt.where(ClassSession.session_date <= to_date)
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(ClassSession.session_date.desc(), Attendance.created_at.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def get_attendance_by_student(
        self,
        student_id: str,
        query: PaginationParams,
        current_user: User,
        class_id: str | None = None,
    ) -> tuple[list[Attendance], int]:
        try:
            self.assert_student_self_or_privileged(student_id, current_user, "attendance.all", "attendance_report.all", "class_student.all")
        except HTTPException:
            if not self._teacher_can_view_student(student_id, current_user):
                raise
        stmt = select(Attendance).where(Attendance.student_id == student_id, Attendance.deleted_at.is_(None))
        if class_id:
            stmt = stmt.where(Attendance.class_id == class_id)
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(Attendance.recorded_at.desc().nullslast(), Attendance.created_at.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def get_my_attendance(self, query: PaginationParams, current_user: User) -> tuple[list[Attendance], int]:
        student = self.get_student_profile_by_user(str(current_user.id))
        if not student:
            raise HTTPException(status_code=404, detail="Student profile not found")
        return self.get_attendance_by_student(str(student.id), query, current_user)


class AttendanceReportService(AcademicAccessMixin):
    # Attendance rate excludes excused sessions from the denominator.
    def _attendance_rate(self, present: int, absent: int, late: int) -> float:
        denominator = present + absent + late
        if denominator <= 0:
            return 0.0
        return round(((present + late) / denominator) * 100, 2)

    def get_class_attendance_summary(self, class_id: str) -> dict[str, Any]:
        class_obj = ClassService(self.db).get_class_by_id(class_id)
        course = CourseService(self.db).get_course_by_id(str(class_obj.course_id))
        total_sessions = int(
            self.db.execute(
                select(func.count()).select_from(ClassSession).where(
                    ClassSession.class_id == class_obj.id,
                    ClassSession.deleted_at.is_(None),
                    ClassSession.status != SessionStatus.cancelled,
                )
            ).scalar_one()
        )
        total_students = ClassService(self.db).count_students(class_id)
        rows = self.db.execute(
            select(Attendance.status, func.count())
            .where(Attendance.class_id == class_obj.id, Attendance.deleted_at.is_(None))
            .group_by(Attendance.status)
        ).all()
        summary = {status.value: 0 for status in AttendanceStatus}
        counted = 0
        for status, count in rows:
            summary[status.value] = int(count)
            counted += int(count)
        total_slots = total_sessions * total_students
        summary[AttendanceStatus.not_marked.value] = max(total_slots - counted, summary[AttendanceStatus.not_marked.value])
        return {
            "class_id": str(class_obj.id),
            "class_name": class_obj.name,
            "course": {"id": str(course.id), "name": course.name},
            "total_sessions": total_sessions,
            "total_students": total_students,
            "summary": summary,
            "attendance_rate": self._attendance_rate(
                summary[AttendanceStatus.present.value],
                summary[AttendanceStatus.absent.value],
                summary[AttendanceStatus.late.value],
            ),
        }

    def get_class_students_attendance_summary(
        self,
        class_id: str,
        query: PaginationParams,
    ) -> tuple[list[dict[str, Any]], int]:
        ClassService(self.db).get_class_by_id(class_id)
        total_sessions = int(
            self.db.execute(
                select(func.count()).select_from(ClassSession).where(
                    ClassSession.class_id == class_id,
                    ClassSession.deleted_at.is_(None),
                    ClassSession.status != SessionStatus.cancelled,
                )
            ).scalar_one()
        )
        rows = self.db.execute(
            select(ClassStudent, Student, User)
            .join(Student, Student.id == ClassStudent.student_id)
            .join(User, User.id == Student.user_id)
            .where(
                ClassStudent.class_id == class_id,
                ClassStudent.deleted_at.is_(None),
                Student.deleted_at.is_(None),
                User.deleted_at.is_(None),
            )
            .order_by(User.full_name.asc())
        ).all()
        items: list[dict[str, Any]] = []
        for _, student, user in rows:
            counts = {status.value: 0 for status in AttendanceStatus}
            attendance_rows = self.db.execute(
                select(Attendance.status, func.count())
                .where(
                    Attendance.class_id == class_id,
                    Attendance.student_id == student.id,
                    Attendance.deleted_at.is_(None),
                )
                .group_by(Attendance.status)
            ).all()
            counted = 0
            for status, count in attendance_rows:
                counts[status.value] = int(count)
                counted += int(count)
            counts[AttendanceStatus.not_marked.value] = max(total_sessions - counted, counts[AttendanceStatus.not_marked.value])
            items.append(
                {
                    "student_id": str(student.id),
                    "student_name": user.full_name,
                    "total_sessions": total_sessions,
                    "present_count": counts[AttendanceStatus.present.value],
                    "absent_count": counts[AttendanceStatus.absent.value],
                    "late_count": counts[AttendanceStatus.late.value],
                    "excused_count": counts[AttendanceStatus.excused.value],
                    "not_marked_count": counts[AttendanceStatus.not_marked.value],
                    "attendance_rate": self._attendance_rate(
                        counts[AttendanceStatus.present.value],
                        counts[AttendanceStatus.absent.value],
                        counts[AttendanceStatus.late.value],
                    ),
                }
            )
        if query.search:
            term = query.search.lower()
            items = [item for item in items if term in item["student_name"].lower()]
        total = len(items)
        start = (query.page - 1) * query.page_size
        end = start + query.page_size
        return items[start:end], total

    def get_student_attendance_summary(self, student_id: str, current_user: User) -> dict[str, Any]:
        try:
            self.assert_student_self_or_privileged(student_id, current_user, "attendance_report.all", "attendance.all")
        except HTTPException:
            if not AttendanceService(self.db)._teacher_can_view_student(student_id, current_user):
                raise
        student = self.db.execute(select(Student).where(Student.id == student_id, Student.deleted_at.is_(None))).scalar_one_or_none()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        user = self.db.execute(select(User).where(User.id == student.user_id, User.deleted_at.is_(None))).scalar_one()
        class_ids = self.db.execute(
            select(ClassStudent.class_id).where(ClassStudent.student_id == student.id, ClassStudent.deleted_at.is_(None))
        ).scalars().all()
        total_sessions = 0
        if class_ids:
            total_sessions = int(
                self.db.execute(
                    select(func.count()).select_from(ClassSession).where(
                        ClassSession.class_id.in_(class_ids),
                        ClassSession.deleted_at.is_(None),
                        ClassSession.status != SessionStatus.cancelled,
                    )
                ).scalar_one()
            )
        counts = {status.value: 0 for status in AttendanceStatus}
        rows = self.db.execute(
            select(Attendance.status, func.count())
            .where(Attendance.student_id == student.id, Attendance.deleted_at.is_(None))
            .group_by(Attendance.status)
        ).all()
        counted = 0
        for status, count in rows:
            counts[status.value] = int(count)
            counted += int(count)
        counts[AttendanceStatus.not_marked.value] = max(total_sessions - counted, counts[AttendanceStatus.not_marked.value])
        return {
            "student_id": str(student.id),
            "student_name": user.full_name,
            "total_sessions": total_sessions,
            "present_count": counts[AttendanceStatus.present.value],
            "absent_count": counts[AttendanceStatus.absent.value],
            "late_count": counts[AttendanceStatus.late.value],
            "excused_count": counts[AttendanceStatus.excused.value],
            "not_marked_count": counts[AttendanceStatus.not_marked.value],
            "attendance_rate": self._attendance_rate(
                counts[AttendanceStatus.present.value],
                counts[AttendanceStatus.absent.value],
                counts[AttendanceStatus.late.value],
            ),
        }

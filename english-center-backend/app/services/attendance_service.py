from datetime import date, datetime, timezone
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.attendance import Attendance, AttendanceStatus
from app.models.class_session import ClassSession, SessionStatus
from app.models.student import Student
from app.models.rbac.user import User
from app.repositories.attendance import AttendanceRepository
from app.repositories.class_session import ClassSessionRepository
from app.repositories.class_student import ClassStudentRepository
from app.repositories.student import StudentRepository
from app.repositories.user import UserRepository
from app.schemas.attendance import AttendanceBulkItem, AttendanceUpdateRequest
from app.schemas.common import PaginationParams
from app.services.class_service import AcademicAccessMixin, ClassService, _enum
from app.services.class_session_service import ClassSessionService
from app.services.course_service import CourseService


def _now() -> datetime:
    return datetime.now(timezone.utc)


class AttendanceService(AcademicAccessMixin):
    def __init__(self, db: Session) -> None:
        super().__init__(db)
        self.attendance_repo = AttendanceRepository(db)
        self.class_student_repo = ClassStudentRepository(db)
        self.class_session_repo = ClassSessionRepository(db)
        self.student_repo = StudentRepository(db)
        self.user_repo = UserRepository(db)

    def _teacher_can_view_student(self, student_id: str, user: User) -> bool:
        teacher = self.get_teacher_profile_by_user(str(user.id))
        if not teacher:
            return False
        return self.class_student_repo.exists_student_in_teacher_classes(student_id, str(teacher.id))

    def _get_attendance(self, attendance_id: str) -> Attendance:
        item = self.attendance_repo.get(attendance_id)
        if not item:
            raise HTTPException(status_code=404, detail="Attendance not found")
        return item

    def _get_class_student_ids(self, class_id: str) -> set[str]:
        items = self.class_student_repo.list_active_student_ids_by_class_id(class_id)
        return set(items)

    def _assert_teacher_can_record(self, session: ClassSession, user: User) -> None:
        if self.has_any_permission(user, "admin.all", "attendance.all"):
            return
        teacher = self.get_teacher_profile_by_user(str(user.id))
        if not teacher:
            raise HTTPException(status_code=403, detail="Permission denied")
        class_obj = ClassService(self.db).get_class_by_id(str(session.class_id))
        session_svc = ClassSessionService(self.db)
        if (str(user.id) in session_svc._session_teacher_user_ids(str(session.id))) or (
            class_obj.teacher_id and str(class_obj.teacher_id) == str(teacher.id)
        ):
            return
        raise HTTPException(status_code=403, detail="Permission denied")

    def attendance_dict(self, attendance: Attendance, student: Student | None = None, user: User | None = None) -> dict[str, Any]:
        student = student or self.student_repo.get(str(attendance.student_id))
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        user = user or self.user_repo.get_active_by_id(str(student.user_id))
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        recorder = None
        if attendance.recorded_by:
            recorder = self.user_repo.get_active_by_id(str(attendance.recorded_by))
        return {
            "id": str(attendance.id),
            "session_id": str(attendance.session_id),
            "class_id": str(attendance.class_id),
            "student_id": str(attendance.student_id),
            "student": {
                "id": str(user.id),
                "full_name": user.full_name,
                "email": user.email,
                "avatar_url": getattr(student, "avatar_url", None),
                "status": user.status.value if getattr(student, "status", None) else None,
                "is_verified": getattr(student, "is_verified", None),
            },
            "status": attendance.status.value,
            "check_in_time": attendance.check_in_time,
            "note": attendance.note,
            "recorded_by": {
                "id": str(recorder.id),
                "full_name": recorder.full_name,
                "email": recorder.email,
                "avatar_url": getattr(recorder, "avatar_url", None),
                "status": recorder.status.value if getattr(recorder, "status", None) else None,
                "is_verified": getattr(recorder, "is_verified", None),
            } if recorder else None,
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
            "student": {
                "id": str(user.id),
                "full_name": user.full_name,
                "email": user.email,
                "avatar_url": getattr(student, "avatar_url", None),
                "status": user.status.value if getattr(user, "status", None) else None,
                "is_verified": getattr(user, "is_verified", None),
            },
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
                attendance = self.attendance_repo.get_by_session_and_student(str(session.id), item.student_id)
                if attendance:
                    attendance.deleted_at = None
                else:
                    attendance = Attendance(session_id=session.id, class_id=session.class_id, student_id=item.student_id)
                    self.attendance_repo.create(attendance)
                attendance.status = status
                attendance.check_in_time = item.check_in_time
                attendance.note = item.note
                attendance.recorded_by = current_user.id
                attendance.recorded_at = _now()
                results.append(attendance)
            self.db.flush()
            active_student_count = len(class_student_ids)
            marked_count = self.attendance_repo.count_marked_by_session(str(session.id), AttendanceStatus.not_marked)
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
        rows = self.class_student_repo.list_with_student_user_by_class_id(str(session.class_id))
        attendance_rows = self.attendance_repo.list_by_session_id(str(session.id))
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
        items = self.attendance_repo.list_filtered_by_class(
            class_id=class_id,
            session_id=session_id,
            student_id=student_id,
            status=_enum(AttendanceStatus, status, "attendance status") if status else None,
            from_date=from_date,
            to_date=to_date,
        )
        total = len(items)
        start = (query.page - 1) * query.page_size
        end = start + query.page_size
        return items[start:end], total

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
        items = self.attendance_repo.list_filtered_by_student(student_id, class_id)
        total = len(items)
        start = (query.page - 1) * query.page_size
        end = start + query.page_size
        return items[start:end], total

    def get_my_attendance(self, query: PaginationParams, current_user: User) -> tuple[list[Attendance], int]:
        student = self.get_student_profile_by_user(str(current_user.id))
        if not student:
            raise HTTPException(status_code=404, detail="Student profile not found")
        return self.get_attendance_by_student(str(student.id), query, current_user)


class AttendanceReportService(AcademicAccessMixin):
    def __init__(self, db: Session) -> None:
        super().__init__(db)
        self.attendance_repo = AttendanceRepository(db)
        self.class_session_repo = ClassSessionRepository(db)
        self.class_student_repo = ClassStudentRepository(db)
        self.student_repo = StudentRepository(db)
        self.user_repo = UserRepository(db)

    # Attendance rate excludes excused sessions from the denominator.
    def _attendance_rate(self, present: int, absent: int, late: int) -> float:
        denominator = present + absent + late
        if denominator <= 0:
            return 0.0
        return round(((present + late) / denominator) * 100, 2)

    def get_class_attendance_summary(self, class_id: str) -> dict[str, Any]:
        class_obj = ClassService(self.db).get_class_by_id(class_id)
        course = CourseService(self.db).get_course_by_id(str(class_obj.course_id))
        total_sessions = self.class_session_repo.count_non_cancelled_by_class_id(str(class_obj.id))
        total_students = ClassService(self.db).count_students(class_id)
        rows = self.attendance_repo.count_group_by_status_for_class(str(class_obj.id))
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
        total_sessions = self.class_session_repo.count_non_cancelled_by_class_id(class_id)
        rows = self.class_student_repo.list_with_student_user_by_class_id(class_id)
        items: list[dict[str, Any]] = []
        for _, student, user in rows:
            counts = {status.value: 0 for status in AttendanceStatus}
            attendance_rows = self.attendance_repo.count_group_by_status_for_student_in_class(class_id, str(student.id))
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
        student_with_user = self.student_repo.get_active_with_user_by_id(student_id)
        if not student_with_user:
            raise HTTPException(status_code=404, detail="Student not found")
        student, user = student_with_user
        class_ids = self.class_student_repo.list_class_ids_by_student_id(str(student.id))
        total_sessions = self.class_session_repo.count_non_cancelled_by_class_ids(class_ids)
        counts = {status.value: 0 for status in AttendanceStatus}
        rows = self.attendance_repo.count_group_by_status_for_student(str(student.id))
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

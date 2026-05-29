from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.class_model import ClassStatus, CourseClass
from app.models.class_student import ClassEnrollmentStatus, ClassStudent
from app.models.commerce import CourseEnrollment
from app.models.student import Student
from app.models import User
from app.repositories.class_student import ClassStudentRepository
from app.repositories.course_class import CourseClassRepository
from app.repositories.course_enrollment import CourseEnrollmentRepository
from app.repositories.student import StudentRepository
from app.repositories.user import UserRepository
from app.schemas.class_student import AddStudentToClassRequest, UpdateClassStudentRequest
from app.schemas.common import PaginationParams
from app.services.class_service import AcademicAccessMixin, _enum
from app.utils.serializers import user_to_dict


def _now() -> datetime:
    return datetime.now(timezone.utc)


class ClassStudentService(AcademicAccessMixin):
    def __init__(self, db: Session) -> None:
        super().__init__(db)
        self.class_repo = CourseClassRepository(db)
        self.class_student_repo = ClassStudentRepository(db)
        self.enrollment_repo = CourseEnrollmentRepository(db)
        self.student_repo = StudentRepository(db)
        self.user_repo = UserRepository(db)

    def _get_class(self, class_id: str) -> CourseClass:
        class_obj = self.class_repo.get_active_by_id(class_id)
        if not class_obj:
            raise HTTPException(status_code=404, detail="Class not found")
        return class_obj

    def _get_class_student(self, class_id: str, student_id: str) -> ClassStudent:
        item = self.class_student_repo.get_by_class_and_student(class_id, student_id)
        if not item:
            raise HTTPException(status_code=404, detail="Class student not found")
        return item

    def _get_student(self, student_id: str) -> Student:
        student = self.student_repo.get_active_by_id(student_id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student

    def _validate_enrollment(self, enrollment_id: str | None, class_obj: CourseClass, student: Student) -> CourseEnrollment | None:
        if not enrollment_id:
            return None
        enrollment = self.enrollment_repo.get_active_by_id(enrollment_id)
        if not enrollment:
            raise HTTPException(status_code=404, detail="Enrollment not found")
        if str(enrollment.user_id) != str(student.user_id):
            raise HTTPException(status_code=400, detail="Enrollment does not belong to student")
        if str(enrollment.course_id) != str(class_obj.course_id):
            raise HTTPException(status_code=400, detail="Enrollment does not match class course")
        return enrollment

    def student_in_class_dict(self, item: ClassStudent, student: Student | None = None, user: User | None = None) -> dict[str, Any]:
        student = student or self._get_student(str(item.student_id))
        user = user or self.user_repo.get_active_by_id(str(student.user_id))
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "class_id": str(item.class_id),
            "student_id": str(item.student_id),
            "student": user_to_dict(user, include_meta=True),
            "enrollment_id": str(item.enrollment_id) if item.enrollment_id else None,
            "enrollment_status": item.enrollment_status.value,
            "enrolled_at": item.enrolled_at,
            "final_score": float(item.final_score) if item.final_score is not None else None,
            "note": item.note,
        }

    def add_student_to_class(self, class_id: str, payload: AddStudentToClassRequest) -> ClassStudent:
        try:
            class_obj = self._get_class(class_id)
            if class_obj.status in {ClassStatus.cancelled, ClassStatus.completed, ClassStatus.archived}:
                raise HTTPException(status_code=400, detail="Cannot add students to this class")
            student = self._get_student(payload.student_id)
            enrollment = self._validate_enrollment(payload.enrollment_id, class_obj, student)
            if self.class_student_repo.count_active_students(class_id) >= class_obj.max_students:
                raise HTTPException(status_code=400, detail="Class is full")

            existing = self.class_student_repo.get_by_class_and_student_including_deleted(class_id, str(student.id))
            enrollment_id = str(enrollment.id) if enrollment else payload.enrollment_id
            if existing and existing.deleted_at is None:
                raise HTTPException(status_code=400, detail="Student already exists in class")
            if existing:
                existing.enrollment_id = enrollment_id
                existing.enrollment_status = ClassEnrollmentStatus.enrolled
                existing.enrolled_at = _now()
                existing.note = payload.note
                obj = self.class_student_repo.restore(existing)
            else:
                obj = self.class_student_repo.create(
                    ClassStudent(
                        class_id=str(class_obj.id),
                        student_id=str(student.id),
                        enrollment_id=enrollment_id,
                        enrollment_status=ClassEnrollmentStatus.enrolled,
                        enrolled_at=_now(),
                        note=payload.note,
                    )
                )
            self.db.commit()
            return obj
        except Exception:
            self.db.rollback()
            raise

    def get_students_by_class(
        self,
        class_id: str,
        query: PaginationParams,
        enrollment_status: str | None = None,
    ) -> tuple[list[tuple[ClassStudent, Student, User]], int]:
        self._get_class(class_id)
        return self.class_student_repo.list_with_student_user_by_class(
            class_id=class_id,
            query=query,
            enrollment_status=_enum(ClassEnrollmentStatus, enrollment_status, "class enrollment status") if enrollment_status else None,
        )

    def update_class_student(self, class_id: str, student_id: str, payload: UpdateClassStudentRequest) -> ClassStudent:
        try:
            item = self._get_class_student(class_id, student_id)
            if payload.enrollment_status is not None:
                item.enrollment_status = _enum(ClassEnrollmentStatus, payload.enrollment_status, "class enrollment status")
            if payload.final_score is not None:
                item.final_score = payload.final_score
            if payload.note is not None:
                item.note = payload.note
            updated = self.class_student_repo.update(item)
            self.db.commit()
            return updated
        except Exception:
            self.db.rollback()
            raise

    def remove_student_from_class(self, class_id: str, student_id: str) -> None:
        try:
            item = self._get_class_student(class_id, student_id)
            item.enrollment_status = ClassEnrollmentStatus.cancelled
            self.class_student_repo.soft_delete(item)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

    def get_classes_by_student(self, student_id: str, query: PaginationParams, current_user: User) -> tuple[list[CourseClass], int]:
        self.assert_student_self_or_privileged(student_id, current_user, "class_student.all", "class.all")
        self._get_student(student_id)
        return self.class_student_repo.list_classes_by_student(student_id, query)

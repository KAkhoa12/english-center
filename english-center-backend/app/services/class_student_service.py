from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.class_model import ClassStatus, CourseClass
from app.models.class_student import ClassEnrollmentStatus, ClassStudent
from app.models.commerce import CourseEnrollment
from app.models.course import Course
from app.models.student import Student
from app.models.user import User
from app.schemas.class_student import AddStudentToClassRequest, UpdateClassStudentRequest
from app.schemas.common import PaginationParams
from app.services.class_service import AcademicAccessMixin, ClassService, _enum
from app.utils.serializers import user_to_dict


def _now() -> datetime:
    return datetime.now(timezone.utc)


class ClassStudentService(AcademicAccessMixin):
    def _get_class_student(self, class_id: str, student_id: str) -> ClassStudent:
        item = self.db.execute(
            select(ClassStudent).where(
                ClassStudent.class_id == class_id,
                ClassStudent.student_id == student_id,
                ClassStudent.deleted_at.is_(None),
            )
        ).scalar_one_or_none()
        if not item:
            raise HTTPException(status_code=404, detail="Class student not found")
        return item

    def _get_student(self, student_id: str) -> Student:
        student = self.db.execute(select(Student).where(Student.id == student_id, Student.deleted_at.is_(None))).scalar_one_or_none()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student

    def _validate_enrollment(self, enrollment_id: str | None, class_obj: CourseClass, student: Student) -> CourseEnrollment | None:
        if not enrollment_id:
            return None
        enrollment = self.db.execute(
            select(CourseEnrollment).where(CourseEnrollment.id == enrollment_id, CourseEnrollment.deleted_at.is_(None))
        ).scalar_one_or_none()
        if not enrollment:
            raise HTTPException(status_code=404, detail="Enrollment not found")
        if str(enrollment.user_id) != str(student.user_id):
            raise HTTPException(status_code=400, detail="Enrollment does not belong to student")
        course = self.db.execute(select(Course).where(Course.id == enrollment.course_id, Course.deleted_at.is_(None))).scalar_one_or_none()
        if not course or str(course.id) != str(class_obj.course_id):
            raise HTTPException(status_code=400, detail="Enrollment does not match class course")
        return enrollment

    def student_in_class_dict(self, item: ClassStudent, student: Student | None = None, user: User | None = None) -> dict[str, Any]:
        student = student or self._get_student(str(item.student_id))
        user = user or self.db.execute(select(User).where(User.id == student.user_id, User.deleted_at.is_(None))).scalar_one()
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
        class_obj = ClassService(self.db).get_class_by_id(class_id)
        if class_obj.status in {ClassStatus.cancelled, ClassStatus.completed, ClassStatus.archived}:
            raise HTTPException(status_code=400, detail="Cannot add students to this class")
        student = self._get_student(payload.student_id)
        enrollment = self._validate_enrollment(payload.enrollment_id, class_obj, student)
        if ClassService(self.db).count_students(class_id) >= class_obj.max_students:
            raise HTTPException(status_code=400, detail="Class is full")
        existing = self.db.execute(
            select(ClassStudent).where(ClassStudent.class_id == class_id, ClassStudent.student_id == student.id)
        ).scalar_one_or_none()
        if existing and existing.deleted_at is None:
            raise HTTPException(status_code=400, detail="Student already exists in class")
        if existing:
            existing.deleted_at = None
            existing.enrollment_id = enrollment.id if enrollment else payload.enrollment_id
            existing.enrollment_status = ClassEnrollmentStatus.enrolled
            existing.enrolled_at = _now()
            existing.note = payload.note
            obj = existing
        else:
            obj = ClassStudent(
                class_id=class_obj.id,
                student_id=student.id,
                enrollment_id=enrollment.id if enrollment else payload.enrollment_id,
                enrollment_status=ClassEnrollmentStatus.enrolled,
                enrolled_at=_now(),
                note=payload.note,
            )
            self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def get_students_by_class(
        self,
        class_id: str,
        query: PaginationParams,
        enrollment_status: str | None = None,
    ) -> tuple[list[tuple[ClassStudent, Student, User]], int]:
        ClassService(self.db).get_class_by_id(class_id)
        stmt = (
            select(ClassStudent, Student, User)
            .join(Student, Student.id == ClassStudent.student_id)
            .join(User, User.id == Student.user_id)
            .where(
                ClassStudent.class_id == class_id,
                ClassStudent.deleted_at.is_(None),
                Student.deleted_at.is_(None),
                User.deleted_at.is_(None),
            )
        )
        if enrollment_status:
            stmt = stmt.where(
                ClassStudent.enrollment_status == _enum(ClassEnrollmentStatus, enrollment_status, "class enrollment status")
            )
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(or_(User.full_name.ilike(term), User.email.ilike(term), User.phone.ilike(term)))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(User.full_name.asc()).offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).all()), int(total)

    def update_class_student(self, class_id: str, student_id: str, payload: UpdateClassStudentRequest) -> ClassStudent:
        item = self._get_class_student(class_id, student_id)
        if payload.enrollment_status is not None:
            item.enrollment_status = _enum(ClassEnrollmentStatus, payload.enrollment_status, "class enrollment status")
        if payload.final_score is not None:
            item.final_score = payload.final_score
        if payload.note is not None:
            item.note = payload.note
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove_student_from_class(self, class_id: str, student_id: str) -> None:
        item = self._get_class_student(class_id, student_id)
        item.enrollment_status = ClassEnrollmentStatus.cancelled
        item.deleted_at = _now()
        self.db.commit()

    def get_classes_by_student(self, student_id: str, query: PaginationParams, current_user: User) -> tuple[list[CourseClass], int]:
        self.assert_student_self_or_privileged(student_id, current_user, "class_student.all", "class.all")
        self._get_student(student_id)
        stmt = (
            select(CourseClass)
            .join(ClassStudent, ClassStudent.class_id == CourseClass.id)
            .where(
                ClassStudent.student_id == student_id,
                ClassStudent.deleted_at.is_(None),
                CourseClass.deleted_at.is_(None),
            )
        )
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(CourseClass.created_at.desc()).offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

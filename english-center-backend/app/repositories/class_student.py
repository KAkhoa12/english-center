from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models import User
from app.models.class_model import CourseClass
from app.models.class_student import ClassEnrollmentStatus, ClassStudent
from app.models.student import Student
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class ClassStudentRepository(BaseRepository[ClassStudent]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, ClassStudent)

    def get_by_class_and_student(self, class_id: str, student_id: str) -> ClassStudent | None:
        return self.db.execute(
            select(ClassStudent).where(
                ClassStudent.class_id == class_id,
                ClassStudent.student_id == student_id,
                ClassStudent.deleted_at.is_(None),
            )
        ).scalar_one_or_none()

    def get_by_class_and_student_including_deleted(self, class_id: str, student_id: str) -> ClassStudent | None:
        return self.db.execute(
            select(ClassStudent).where(
                ClassStudent.class_id == class_id,
                ClassStudent.student_id == student_id,
            )
        ).scalar_one_or_none()

    def list_by_class_id(self, class_id: str) -> list[ClassStudent]:
        return list(
            self.db.execute(
                select(ClassStudent).where(
                    ClassStudent.class_id == class_id,
                    ClassStudent.deleted_at.is_(None),
                )
            ).scalars().all()
        )

    def list_by_student_id(self, student_id: str) -> list[ClassStudent]:
        return list(
            self.db.execute(
                select(ClassStudent).where(
                    ClassStudent.student_id == student_id,
                    ClassStudent.deleted_at.is_(None),
                )
            ).scalars().all()
        )

    def count_active_students(self, class_id: str) -> int:
        return int(
            self.db.execute(
                select(func.count())
                .select_from(ClassStudent)
                .where(
                    ClassStudent.class_id == class_id,
                    ClassStudent.deleted_at.is_(None),
                    ClassStudent.enrollment_status.notin_([ClassEnrollmentStatus.cancelled, ClassEnrollmentStatus.dropped]),
                )
            ).scalar_one()
        )

    def list_with_student_user_by_class(
        self,
        class_id: str,
        query: PaginationParams,
        enrollment_status=None,
    ) -> tuple[list[tuple[ClassStudent, Student, User]], int]:
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
            stmt = stmt.where(ClassStudent.enrollment_status == enrollment_status)
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(or_(User.full_name.ilike(term), User.email.ilike(term), User.phone.ilike(term)))

        total = int(self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one())
        stmt = stmt.order_by(User.full_name.asc()).offset((query.page - 1) * query.page_size).limit(query.page_size)
        rows = self.db.execute(stmt).all()
        return [(row[0], row[1], row[2]) for row in rows], total

    def list_classes_by_student(self, student_id: str, query: PaginationParams) -> tuple[list[CourseClass], int]:
        stmt = (
            select(CourseClass)
            .join(ClassStudent, ClassStudent.class_id == CourseClass.id)
            .where(
                ClassStudent.student_id == student_id,
                ClassStudent.deleted_at.is_(None),
                CourseClass.deleted_at.is_(None),
            )
        )
        total = int(self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one())
        stmt = stmt.order_by(CourseClass.created_at.desc()).offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), total

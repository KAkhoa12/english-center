from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.assignment import Assignment, AssignmentGrade
from app.models.class_model import CourseClass
from app.models.class_student import ClassStudent
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class AssignmentGradeRepository(BaseRepository[AssignmentGrade]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, AssignmentGrade)

    def get_by_submission_id(self, submission_id: str) -> AssignmentGrade | None:
        return self.db.execute(
            select(AssignmentGrade).where(
                AssignmentGrade.submission_id == submission_id,
                AssignmentGrade.deleted_at.is_(None),
            )
        ).scalar_one_or_none()

    def list_by_assignment_id(self, assignment_id: str) -> list[AssignmentGrade]:
        return list(
            self.db.execute(
                select(AssignmentGrade)
                .where(AssignmentGrade.assignment_id == assignment_id, AssignmentGrade.deleted_at.is_(None))
                .order_by(AssignmentGrade.created_at.desc())
            ).scalars().all()
        )

    def list_by_student_id(self, student_id: str) -> list[AssignmentGrade]:
        return list(
            self.db.execute(
                select(AssignmentGrade)
                .where(AssignmentGrade.student_id == student_id, AssignmentGrade.deleted_at.is_(None))
                .order_by(AssignmentGrade.created_at.desc())
            ).scalars().all()
        )

    def get_active_by_id(self, grade_id: str) -> AssignmentGrade | None:
        return self.get(grade_id)

    def list_student_grades(
        self,
        student_id: str,
        query: PaginationParams,
        class_id: str | None = None,
        assignment_type_id: str | None = None,
    ) -> tuple[list[AssignmentGrade], int]:
        stmt = select(AssignmentGrade).join(Assignment, Assignment.id == AssignmentGrade.assignment_id).where(
            AssignmentGrade.student_id == student_id,
            AssignmentGrade.deleted_at.is_(None),
            Assignment.deleted_at.is_(None),
        )
        if class_id:
            stmt = stmt.where(Assignment.class_id == class_id)
        if assignment_type_id:
            stmt = stmt.where(Assignment.assignment_type_id == assignment_type_id)
        total = int(self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one())
        stmt = stmt.order_by(AssignmentGrade.graded_at.desc().nullslast(), AssignmentGrade.created_at.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), total

    def teacher_owns_student(self, teacher_id: str, student_id: str) -> bool:
        owns = self.db.execute(
            select(ClassStudent)
            .join(CourseClass, CourseClass.id == ClassStudent.class_id)
            .where(
                ClassStudent.student_id == student_id,
                CourseClass.teacher_id == teacher_id,
                ClassStudent.deleted_at.is_(None),
                CourseClass.deleted_at.is_(None),
            )
        ).scalar_one_or_none()
        return owns is not None

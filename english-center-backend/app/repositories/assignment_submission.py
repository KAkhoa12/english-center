from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models import User
from app.models.assignment import Assignment, AssignmentSubmission, AssignmentSubmissionStatus
from app.models.student import Student
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class AssignmentSubmissionRepository(BaseRepository[AssignmentSubmission]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, AssignmentSubmission)

    def list_by_assignment_id(self, assignment_id: str) -> list[AssignmentSubmission]:
        return list(
            self.db.execute(
                select(AssignmentSubmission)
                .where(AssignmentSubmission.assignment_id == assignment_id, AssignmentSubmission.deleted_at.is_(None))
                .order_by(AssignmentSubmission.created_at.desc())
            ).scalars().all()
        )

    def list_by_student_id(self, student_id: str) -> list[AssignmentSubmission]:
        return list(
            self.db.execute(
                select(AssignmentSubmission)
                .where(AssignmentSubmission.student_id == student_id, AssignmentSubmission.deleted_at.is_(None))
                .order_by(AssignmentSubmission.created_at.desc())
            ).scalars().all()
        )

    def get_latest_attempt(self, assignment_id: str, student_id: str) -> AssignmentSubmission | None:
        return self.db.execute(
            select(AssignmentSubmission)
            .where(
                AssignmentSubmission.assignment_id == assignment_id,
                AssignmentSubmission.student_id == student_id,
                AssignmentSubmission.deleted_at.is_(None),
            )
            .order_by(AssignmentSubmission.attempt_number.desc())
            .limit(1)
        ).scalar_one_or_none()

    def get_active_by_id(self, submission_id: str) -> AssignmentSubmission | None:
        return self.get(submission_id)

    def count_by_assignment_id(self, assignment_id: str) -> int:
        return self.count(filters=[AssignmentSubmission.assignment_id == assignment_id])

    def count_graded_by_assignment_id(self, assignment_id: str) -> int:
        return self.count(
            filters=[
                AssignmentSubmission.assignment_id == assignment_id,
                AssignmentSubmission.status == AssignmentSubmissionStatus.graded,
            ]
        )

    def list_filtered_by_assignment(
        self,
        assignment_id: str,
        query: PaginationParams,
        status: AssignmentSubmissionStatus | None = None,
        is_late: bool | None = None,
        graded: bool | None = None,
    ) -> tuple[list[AssignmentSubmission], int]:
        stmt = (
            select(AssignmentSubmission)
            .join(Student, Student.id == AssignmentSubmission.student_id)
            .join(User, User.id == Student.user_id)
            .where(AssignmentSubmission.assignment_id == assignment_id, AssignmentSubmission.deleted_at.is_(None))
        )
        if status:
            stmt = stmt.where(AssignmentSubmission.status == status)
        if is_late is not None:
            stmt = stmt.where(AssignmentSubmission.is_late == is_late)
        if graded is not None:
            stmt = stmt.where(
                AssignmentSubmission.status == AssignmentSubmissionStatus.graded
                if graded
                else AssignmentSubmission.status != AssignmentSubmissionStatus.graded
            )
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(or_(User.full_name.ilike(term), User.email.ilike(term)))
        total = int(self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one())
        stmt = stmt.order_by(AssignmentSubmission.created_at.desc()).offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), total

    def list_my_submissions(
        self,
        student_id: str,
        query: PaginationParams,
        class_id: str | None = None,
        assignment_id: str | None = None,
        status: AssignmentSubmissionStatus | None = None,
        graded: bool | None = None,
    ) -> tuple[list[AssignmentSubmission], int]:
        stmt = select(AssignmentSubmission).join(Assignment, Assignment.id == AssignmentSubmission.assignment_id).where(
            AssignmentSubmission.student_id == student_id,
            AssignmentSubmission.deleted_at.is_(None),
            Assignment.deleted_at.is_(None),
        )
        if class_id:
            stmt = stmt.where(Assignment.class_id == class_id)
        if assignment_id:
            stmt = stmt.where(AssignmentSubmission.assignment_id == assignment_id)
        if status:
            stmt = stmt.where(AssignmentSubmission.status == status)
        if graded is not None:
            stmt = stmt.where(
                AssignmentSubmission.status == AssignmentSubmissionStatus.graded
                if graded
                else AssignmentSubmission.status != AssignmentSubmissionStatus.graded
            )
        total = int(self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one())
        stmt = stmt.order_by(AssignmentSubmission.created_at.desc()).offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), total

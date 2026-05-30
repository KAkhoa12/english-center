from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.assignment_question import AssignmentQuestion, AssignmentQuestionOption
from app.repositories.base import BaseRepository


class AssignmentQuestionRepository(BaseRepository[AssignmentQuestion]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, AssignmentQuestion)

    def list_by_assignment_id(self, assignment_id: str) -> list[AssignmentQuestion]:
        return list(
            self.db.execute(
                select(AssignmentQuestion)
                .where(AssignmentQuestion.assignment_id == assignment_id, AssignmentQuestion.deleted_at.is_(None))
                .order_by(AssignmentQuestion.order_index.asc(), AssignmentQuestion.created_at.asc())
            ).scalars().all()
        )


class AssignmentQuestionOptionRepository(BaseRepository[AssignmentQuestionOption]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, AssignmentQuestionOption)

    def list_by_question_id(self, question_id: str) -> list[AssignmentQuestionOption]:
        return list(
            self.db.execute(
                select(AssignmentQuestionOption)
                .where(AssignmentQuestionOption.question_id == question_id, AssignmentQuestionOption.deleted_at.is_(None))
                .order_by(AssignmentQuestionOption.order_index.asc(), AssignmentQuestionOption.created_at.asc())
            ).scalars().all()
        )

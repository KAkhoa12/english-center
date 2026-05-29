from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.assignment import AssignmentAttachment
from app.repositories.base import BaseRepository


class AssignmentAttachmentRepository(BaseRepository[AssignmentAttachment]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, AssignmentAttachment)

    def list_by_assignment_id(self, assignment_id: str) -> list[AssignmentAttachment]:
        return list(
            self.db.execute(
                select(AssignmentAttachment)
                .where(AssignmentAttachment.assignment_id == assignment_id, AssignmentAttachment.deleted_at.is_(None))
                .order_by(AssignmentAttachment.order_index.asc(), AssignmentAttachment.created_at.asc())
            ).scalars().all()
        )

    def get_active_by_id(self, attachment_id: str) -> AssignmentAttachment | None:
        return self.get(attachment_id)

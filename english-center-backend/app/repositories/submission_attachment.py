from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.assignment import SubmissionAttachment
from app.repositories.base import BaseRepository


class SubmissionAttachmentRepository(BaseRepository[SubmissionAttachment]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, SubmissionAttachment)

    def list_by_submission_id(self, submission_id: str) -> list[SubmissionAttachment]:
        return list(
            self.db.execute(
                select(SubmissionAttachment)
                .where(SubmissionAttachment.submission_id == submission_id, SubmissionAttachment.deleted_at.is_(None))
                .order_by(SubmissionAttachment.created_at.asc())
            ).scalars().all()
        )

    def get_active_by_id(self, attachment_id: str) -> SubmissionAttachment | None:
        return self.get(attachment_id)

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import Media
from app.models.submission_answer import SubmissionAnswer, SubmissionAnswerMedia
from app.repositories.base import BaseRepository


class SubmissionAnswerRepository(BaseRepository[SubmissionAnswer]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, SubmissionAnswer)

    def list_by_submission_id(self, submission_id: str) -> list[SubmissionAnswer]:
        return list(
            self.db.execute(
                select(SubmissionAnswer).where(SubmissionAnswer.submission_id == submission_id, SubmissionAnswer.deleted_at.is_(None))
            ).scalars().all()
        )


class SubmissionAnswerMediaRepository(BaseRepository[SubmissionAnswerMedia]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, SubmissionAnswerMedia)

    def list_by_submission_answer_id(self, submission_answer_id: str) -> list[SubmissionAnswerMedia]:
        return list(
            self.db.execute(
                select(SubmissionAnswerMedia).where(
                    SubmissionAnswerMedia.submission_answer_id == submission_answer_id,
                    SubmissionAnswerMedia.deleted_at.is_(None),
                )
            ).scalars().all()
        )

    def list_with_media_by_submission_answer_id(self, submission_answer_id: str) -> list[tuple[SubmissionAnswerMedia, Media]]:
        return list(
            self.db.execute(
                select(SubmissionAnswerMedia, Media)
                .join(Media, Media.id == SubmissionAnswerMedia.media_id)
                .where(
                    SubmissionAnswerMedia.submission_answer_id == submission_answer_id,
                    SubmissionAnswerMedia.deleted_at.is_(None),
                    Media.deleted_at.is_(None),
                )
            ).all()
        )

from decimal import Decimal

from sqlalchemy import Boolean, ForeignKey, Numeric, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class SubmissionAnswer(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "submission_answers"
    __table_args__ = (UniqueConstraint("submission_id", "question_id", name="uq_submission_answers_submission_question"),)

    submission_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("assignment_submissions.id"), nullable=False, index=True)
    question_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("assignment_questions.id"), nullable=False, index=True)
    answer_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    selected_option_ids: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    is_correct: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    score: Mapped[Decimal | None] = mapped_column(Numeric(5, 2), nullable=True)


class SubmissionAnswerMedia(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "submission_answer_media"
    __table_args__ = (UniqueConstraint("submission_answer_id", "media_id", name="uq_submission_answer_media"),)

    submission_answer_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("submission_answers.id"), nullable=False, index=True)
    media_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("media.id"), nullable=False, index=True)

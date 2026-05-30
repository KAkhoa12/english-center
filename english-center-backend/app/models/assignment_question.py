import enum
from decimal import Decimal

from sqlalchemy import Boolean, Enum, ForeignKey, Integer, Numeric, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class AssignmentQuestionType(str, enum.Enum):
    single_choice = "single_choice"
    multiple_choice = "multiple_choice"
    text_answer = "text_answer"
    file_upload = "file_upload"


class AssignmentQuestion(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "assignment_questions"

    assignment_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("assignments.id"), nullable=False, index=True)
    question_type: Mapped[AssignmentQuestionType] = mapped_column(
        Enum(AssignmentQuestionType, name="assignment_question_type"),
        nullable=False,
        index=True,
    )
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    score: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False, default=0)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_required: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class AssignmentQuestionOption(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "assignment_question_options"

    question_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("assignment_questions.id"), nullable=False, index=True)
    option_text: Mapped[str] = mapped_column(Text, nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

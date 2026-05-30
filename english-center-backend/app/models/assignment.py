from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


import enum


class AssignmentStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    closed = "closed"
    archived = "archived"


class AssignmentAttachmentType(str, enum.Enum):
    file = "file"
    link = "link"


class AssignmentSubmissionStatus(str, enum.Enum):
    draft = "draft"
    submitted = "submitted"
    late = "late"
    graded = "graded"
    returned = "returned"
    cancelled = "cancelled"


class AssignmentGradingMethod(str, enum.Enum):
    teacher = "teacher"
    ai = "ai"
    mixed = "mixed"


class Assignment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "assignments"

    class_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False, index=True)
    session_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("class_sessions.id"), nullable=True, index=True)
    lesson_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("lessons.id"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    instruction: Mapped[str | None] = mapped_column(Text, nullable=True)
    assignment_type_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("assignment_types.id"), nullable=False, index=True)
    status: Mapped[AssignmentStatus] = mapped_column(
        Enum(AssignmentStatus, name="assignment_status"),
        nullable=False,
        default=AssignmentStatus.draft,
        index=True,
    )
    max_score: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False, default=10)
    due_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
    allow_late_submission: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_by: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)


class AssignmentAttachment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "assignment_attachments"

    assignment_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("assignments.id"), nullable=False, index=True)
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    file_bucket: Mapped[str | None] = mapped_column(String(100), nullable=True)
    file_object_name: Mapped[str | None] = mapped_column(String(500), nullable=True)
    external_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    content_type: Mapped[str | None] = mapped_column(String(255), nullable=True)
    file_size: Mapped[int | None] = mapped_column(Integer, nullable=True)
    attachment_type: Mapped[AssignmentAttachmentType] = mapped_column(
        Enum(AssignmentAttachmentType, name="assignment_attachment_type"),
        nullable=False,
        default=AssignmentAttachmentType.file,
    )
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    uploaded_by: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)


class AssignmentSubmission(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "assignment_submissions"
    __table_args__ = (UniqueConstraint("assignment_id", "student_id", "attempt_number", name="uq_assignment_submission_attempt"),)

    assignment_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("assignments.id"), nullable=False, index=True)
    student_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[AssignmentSubmissionStatus] = mapped_column(
        Enum(AssignmentSubmissionStatus, name="assignment_submission_status"),
        nullable=False,
        default=AssignmentSubmissionStatus.draft,
        index=True,
    )
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_late: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    attempt_number: Mapped[int] = mapped_column(Integer, nullable=False, default=1)


class SubmissionAttachment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "submission_attachments"

    submission_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("assignment_submissions.id"), nullable=False, index=True)
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    file_bucket: Mapped[str] = mapped_column(String(100), nullable=False)
    file_object_name: Mapped[str] = mapped_column(String(500), nullable=False)
    original_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    content_type: Mapped[str | None] = mapped_column(String(255), nullable=True)
    file_size: Mapped[int | None] = mapped_column(Integer, nullable=True)
    uploaded_by: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)


class AssignmentGrade(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "assignment_grades"

    submission_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("assignment_submissions.id"), unique=True, nullable=False, index=True)
    assignment_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("assignments.id"), nullable=False, index=True)
    student_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False, index=True)
    score: Mapped[Decimal | None] = mapped_column(Numeric(5, 2), nullable=True)
    max_score: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False, default=10)
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    rubric: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    graded_by: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    graded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    grading_method: Mapped[AssignmentGradingMethod] = mapped_column(
        Enum(AssignmentGradingMethod, name="assignment_grading_method"),
        nullable=False,
        default=AssignmentGradingMethod.teacher,
    )
    ai_grading_result_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), nullable=True)

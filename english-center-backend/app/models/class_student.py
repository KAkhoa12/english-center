import enum
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ClassEnrollmentStatus(str, enum.Enum):
    enrolled = "enrolled"
    completed = "completed"
    dropped = "dropped"
    cancelled = "cancelled"


class ClassStudent(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "class_students"
    __table_args__ = (UniqueConstraint("class_id", "student_id", name="uq_class_students_class_student"),)

    class_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False, index=True)
    student_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False, index=True)
    enrollment_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("course_enrollments.id"), nullable=True)
    enrollment_status: Mapped[ClassEnrollmentStatus] = mapped_column(
        Enum(ClassEnrollmentStatus, name="class_enrollment_status"),
        nullable=False,
        default=ClassEnrollmentStatus.enrolled,
        index=True,
    )
    enrolled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    final_score: Mapped[Decimal | None] = mapped_column(Numeric(5, 2), nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)

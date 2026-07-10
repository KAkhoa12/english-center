import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ConsultationStatus(str, enum.Enum):
    new = "new"
    contacted = "contacted"
    consulting = "consulting"
    qualified = "qualified"
    converted = "converted"
    rejected = "rejected"
    cancelled = "cancelled"


class ConsultationSource(str, enum.Enum):
    ai_chat = "ai_chat"
    website = "website"
    staff = "staff"
    other = "other"


class Consultation(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "consultations"

    conversation_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=True, unique=True, index=True)
    user_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    student_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=True, index=True)
    customer_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    customer_phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    customer_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    interested_course_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=True, index=True)
    interested_class_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=True, index=True)
    assigned_staff_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    status: Mapped[ConsultationStatus] = mapped_column(
        Enum(ConsultationStatus, name="consultation_status"),
        nullable=False,
        default=ConsultationStatus.new,
        index=True,
    )
    source: Mapped[ConsultationSource] = mapped_column(
        Enum(ConsultationSource, name="consultation_source"),
        nullable=False,
        default=ConsultationSource.other,
        index=True,
    )
    learning_goal: Mapped[str | None] = mapped_column(Text, nullable=True)
    current_level: Mapped[str | None] = mapped_column(String(100), nullable=True)
    preferred_schedule: Mapped[str | None] = mapped_column(String(255), nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)

    @property
    def content(self) -> str | None:
        return self.note

    @content.setter
    def content(self, value: str | None) -> None:
        self.note = value

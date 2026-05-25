import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class AttendanceStatus(str, enum.Enum):
    present = "present"
    absent = "absent"
    late = "late"
    excused = "excused"
    not_marked = "not_marked"


class Attendance(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "attendances"
    __table_args__ = (UniqueConstraint("session_id", "student_id", name="uq_attendances_session_student"),)

    session_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("class_sessions.id"), nullable=False, index=True)
    class_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False, index=True)
    student_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False, index=True)
    status: Mapped[AttendanceStatus] = mapped_column(
        Enum(AttendanceStatus, name="attendance_status"),
        nullable=False,
        default=AttendanceStatus.not_marked,
        index=True,
    )
    check_in_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    recorded_by: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    recorded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

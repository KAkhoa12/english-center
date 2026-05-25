import enum
from datetime import date, time

from sqlalchemy import Date, Enum, ForeignKey, String, Text, Time
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class SessionMode(str, enum.Enum):
    online = "online"
    offline = "offline"


class SessionStatus(str, enum.Enum):
    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"


class ClassSession(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "class_sessions"

    class_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False, index=True)
    teacher_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=True, index=True)
    lesson_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("lessons.id"), nullable=True)
    room_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("rooms.id"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    session_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    mode: Mapped[SessionMode] = mapped_column(
        Enum(SessionMode, name="session_mode"),
        nullable=False,
        default=SessionMode.offline,
    )
    meeting_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    status: Mapped[SessionStatus] = mapped_column(
        Enum(SessionStatus, name="session_status"),
        nullable=False,
        default=SessionStatus.scheduled,
        index=True,
    )
    note: Mapped[str | None] = mapped_column(Text, nullable=True)

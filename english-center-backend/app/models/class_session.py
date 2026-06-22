import enum
from datetime import date, time

from sqlalchemy import Date, Enum, ForeignKey, Integer, String, Text, Time, UniqueConstraint
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


class ClassScheduleName(str, enum.Enum):
    t2 = "T2"
    t3 = "T3"
    t4 = "T4"
    t5 = "T5"
    t6 = "T6"
    t7 = "T7"
    cn = "CN"


class ClassSchedule(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "class_schedules"
    __table_args__ = (
        UniqueConstraint("class_id", "schedule_name", "start_time", "end_time", name="uq_class_schedule_time"),
    )

    class_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False, index=True)
    schedule_name: Mapped[ClassScheduleName] = mapped_column(
        Enum(ClassScheduleName, name="class_schedule_name", values_callable=lambda enum_cls: [item.value for item in enum_cls]),
        nullable=False,
        index=True,
    )
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)


class ClassSession(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "class_sessions"

    class_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False, index=True)
    class_schedule_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("class_schedules.id"), nullable=False, index=True)
    teacher_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=True, index=True)
    lesson_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("lessons.id"), nullable=True)
    room_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("rooms.id"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    session_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    override_start_time: Mapped[time | None] = mapped_column(Time, nullable=True)
    override_end_time: Mapped[time | None] = mapped_column(Time, nullable=True)
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


class ClassSessionMedia(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "class_sessions_media"

    class_session_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("class_sessions.id"), nullable=False, index=True)
    media_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("media.id"), nullable=False, index=True)
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

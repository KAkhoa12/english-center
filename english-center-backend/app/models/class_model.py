import enum
from datetime import date

from sqlalchemy import Date, Enum, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ClassType(str, enum.Enum):
    online = "online"
    offline = "offline"
    hybrid = "hybrid"


class ClassStatus(str, enum.Enum):
    planned = "planned"
    ongoing = "ongoing"
    completed = "completed"
    cancelled = "cancelled"
    archived = "archived"


class CourseClass(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "classes"

    course_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False, index=True)
    teacher_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str | None] = mapped_column(String(100), unique=True, nullable=True, index=True)
    class_type: Mapped[ClassType] = mapped_column(
        Enum(ClassType, name="class_type"),
        nullable=False,
        default=ClassType.offline,
        index=True,
    )
    max_students: Mapped[int] = mapped_column(Integer, nullable=False)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[ClassStatus] = mapped_column(
        Enum(ClassStatus, name="class_status"),
        nullable=False,
        default=ClassStatus.planned,
        index=True,
    )

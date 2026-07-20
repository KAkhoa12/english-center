import enum
from decimal import Decimal

from sqlalchemy import Boolean, Enum, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class CourseStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    archived = "archived"


class CourseTargetLevel(str, enum.Enum):
    a0 = "A0"
    a1 = "A1"
    a2 = "A2"
    b1 = "B1"
    b2 = "B2"
    c1 = "C1"
    c2 = "C2"


class CourseCategory(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "course_categories"

    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    slug: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active", index=True)


class Course(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "courses"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    slug: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    category_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("course_categories.id"), nullable=False, index=True)
    target_level: Mapped[CourseTargetLevel | None] = mapped_column(
        Enum(
            CourseTargetLevel,
            name="course_target_level",
            values_callable=lambda enum_cls: [item.value for item in enum_cls],
        ),
        nullable=True,
        index=True,
    )
    output_goal: Mapped[str | None] = mapped_column(Text, nullable=True)
    requirements: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    outcomes: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    total_sessions: Mapped[int | None] = mapped_column(Integer, nullable=True)
    total_duration_time: Mapped[int | None] = mapped_column(Integer, nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    discount_price: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    status: Mapped[CourseStatus] = mapped_column(
        Enum(CourseStatus, name="course_status"),
        default=CourseStatus.active,
        nullable=False,
        index=True,
    )


class Media(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "media"

    bucket: Mapped[str] = mapped_column(String(100), nullable=False)
    folder: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    object_name: Mapped[str] = mapped_column(String(500), nullable=False, unique=True, index=True)
    original_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    content_type: Mapped[str | None] = mapped_column(String(255), nullable=True)
    size: Mapped[int | None] = mapped_column(Integer, nullable=True)
    uploaded_by: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)


class CourseMedia(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "course_media"
    __table_args__ = (UniqueConstraint("course_id", "media_id", name="uq_course_media_course_media"),)

    course_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False, index=True)
    media_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("media.id"), nullable=False, index=True)
    media_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

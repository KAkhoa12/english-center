import enum
from decimal import Decimal

from sqlalchemy import Boolean, Enum, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class CategoryStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class CourseStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    archived = "archived"


class CourseTargetLevel(str, enum.Enum):
    beginner = "beginner"
    elementary = "elementary"
    intermediate = "intermediate"
    upper_intermediate = "upper_intermediate"
    advanced = "advanced"


class CourseModuleStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class LessonStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    archived = "archived"


class MaterialType(str, enum.Enum):
    pdf = "pdf"
    document = "document"
    slide = "slide"
    image = "image"
    audio = "audio"
    video = "video"
    link = "link"
    other = "other"


class CourseCategory(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "course_categories"

    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    slug: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[CategoryStatus] = mapped_column(
        Enum(CategoryStatus, name="course_category_status"),
        default=CategoryStatus.active,
        nullable=False,
        index=True,
    )


class CourseTag(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "course_tags"

    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    slug: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True, index=True)


class Course(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "courses"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    slug: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    thumbnail_bucket: Mapped[str | None] = mapped_column(String(100), nullable=True)
    thumbnail_object_name: Mapped[str | None] = mapped_column(String(500), nullable=True)
    target_level: Mapped[CourseTargetLevel | None] = mapped_column(
        Enum(CourseTargetLevel, name="course_target_level"),
        nullable=True,
        index=True,
    )
    output_goal: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration_weeks: Mapped[int | None] = mapped_column(Integer, nullable=True)
    total_sessions: Mapped[int | None] = mapped_column(Integer, nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    status: Mapped[CourseStatus] = mapped_column(
        Enum(CourseStatus, name="course_status"),
        default=CourseStatus.active,
        nullable=False,
        index=True,
    )


class CourseCategoryMapping(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "course_category_mappings"
    __table_args__ = (UniqueConstraint("course_id", "category_id", name="uq_course_category_mapping"),)

    course_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    category_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("course_categories.id"), nullable=False)


class CourseTagMapping(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "course_tag_mappings"
    __table_args__ = (UniqueConstraint("course_id", "tag_id", name="uq_course_tag_mapping"),)

    course_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    tag_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("course_tags.id"), nullable=False)


class CourseRequirement(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "course_requirements"

    course_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    requirement_text: Mapped[str] = mapped_column(Text, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class CourseOutcome(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "course_outcomes"

    course_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    outcome_text: Mapped[str] = mapped_column(Text, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class CourseModule(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "course_modules"

    course_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[CourseModuleStatus] = mapped_column(
        Enum(CourseModuleStatus, name="course_module_status"),
        default=CourseModuleStatus.active,
        nullable=False,
    )


class Lesson(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "lessons"

    course_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False, index=True)
    module_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("course_modules.id"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    estimated_duration_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[LessonStatus] = mapped_column(
        Enum(LessonStatus, name="lesson_status"),
        default=LessonStatus.draft,
        nullable=False,
    )
    created_by: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)


class LessonMaterial(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "lesson_materials"

    lesson_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("lessons.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    material_type: Mapped[MaterialType] = mapped_column(Enum(MaterialType, name="material_type"), nullable=False)
    file_bucket: Mapped[str | None] = mapped_column(String(100), nullable=True)
    file_object_name: Mapped[str | None] = mapped_column(String(500), nullable=True)
    external_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_downloadable: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_by: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

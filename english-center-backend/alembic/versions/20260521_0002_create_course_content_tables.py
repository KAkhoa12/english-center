"""create course content tables

Revision ID: 20260521_0002
Revises: 20260520_0001
Create Date: 2026-05-21
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260521_0002"
down_revision = "20260520_0001"
branch_labels = None
depends_on = None


def timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    ]


def upgrade() -> None:
    category_status = sa.Enum("active", "inactive", name="course_category_status")
    course_status = sa.Enum("active", "inactive", "archived", name="course_status")
    target_level = sa.Enum("beginner", "elementary", "intermediate", "upper_intermediate", "advanced", name="course_target_level")
    module_status = sa.Enum("active", "inactive", name="course_module_status")
    lesson_status = sa.Enum("draft", "published", "archived", name="lesson_status")
    material_type = sa.Enum("pdf", "document", "slide", "image", "audio", "video", "link", "other", name="material_type")

    op.create_table(
        "course_categories",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False, unique=True),
        sa.Column("slug", sa.String(255), nullable=True, unique=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("status", category_status, nullable=False, server_default="active"),
        *timestamps(),
    )
    op.create_index("ix_course_categories_name", "course_categories", ["name"])
    op.create_index("ix_course_categories_slug", "course_categories", ["slug"])

    op.create_table(
        "course_tags",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False, unique=True),
        sa.Column("slug", sa.String(255), nullable=True, unique=True),
        *timestamps(),
    )
    op.create_index("ix_course_tags_name", "course_tags", ["name"])
    op.create_index("ix_course_tags_slug", "course_tags", ["slug"])

    op.create_table(
        "courses",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("code", sa.String(100), nullable=False, unique=True),
        sa.Column("slug", sa.String(255), nullable=True, unique=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("thumbnail_bucket", sa.String(100), nullable=True),
        sa.Column("thumbnail_object_name", sa.String(500), nullable=True),
        sa.Column("target_level", target_level, nullable=True),
        sa.Column("output_goal", sa.Text(), nullable=True),
        sa.Column("duration_weeks", sa.Integer(), nullable=True),
        sa.Column("total_sessions", sa.Integer(), nullable=True),
        sa.Column("price", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("status", course_status, nullable=False, server_default="active"),
        *timestamps(),
    )
    op.create_index("ix_courses_name", "courses", ["name"])
    op.create_index("ix_courses_code", "courses", ["code"], unique=True)
    op.create_index("ix_courses_slug", "courses", ["slug"], unique=True)
    op.create_index("ix_courses_status", "courses", ["status"])
    op.create_index("ix_courses_target_level", "courses", ["target_level"])

    op.create_table(
        "course_category_mappings",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("category_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("course_categories.id"), nullable=False),
        *timestamps(),
        sa.UniqueConstraint("course_id", "category_id", name="uq_course_category_mapping"),
    )

    op.create_table(
        "course_tag_mappings",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("tag_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("course_tags.id"), nullable=False),
        *timestamps(),
        sa.UniqueConstraint("course_id", "tag_id", name="uq_course_tag_mapping"),
    )

    op.create_table(
        "course_requirements",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("requirement_text", sa.Text(), nullable=False),
        sa.Column("order_index", sa.Integer(), nullable=False, server_default="0"),
        *timestamps(),
    )

    op.create_table(
        "course_outcomes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("outcome_text", sa.Text(), nullable=False),
        sa.Column("order_index", sa.Integer(), nullable=False, server_default="0"),
        *timestamps(),
    )

    op.create_table(
        "course_modules",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("order_index", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("status", module_status, nullable=False, server_default="active"),
        *timestamps(),
    )

    op.create_table(
        "lessons",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("module_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("course_modules.id"), nullable=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("order_index", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("estimated_duration_minutes", sa.Integer(), nullable=True),
        sa.Column("status", lesson_status, nullable=False, server_default="draft"),
        sa.Column("created_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        *timestamps(),
    )
    op.create_index("ix_lessons_course_id", "lessons", ["course_id"])
    op.create_index("ix_lessons_module_id", "lessons", ["module_id"])

    op.create_table(
        "lesson_materials",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("lesson_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("lessons.id"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("material_type", material_type, nullable=False),
        sa.Column("file_bucket", sa.String(100), nullable=True),
        sa.Column("file_object_name", sa.String(500), nullable=True),
        sa.Column("external_url", sa.String(1000), nullable=True),
        sa.Column("order_index", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_downloadable", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        *timestamps(),
    )
    op.create_index("ix_lesson_materials_lesson_id", "lesson_materials", ["lesson_id"])


def downgrade() -> None:
    op.drop_index("ix_lesson_materials_lesson_id", table_name="lesson_materials")
    op.drop_table("lesson_materials")
    op.drop_index("ix_lessons_module_id", table_name="lessons")
    op.drop_index("ix_lessons_course_id", table_name="lessons")
    op.drop_table("lessons")
    op.drop_table("course_modules")
    op.drop_table("course_outcomes")
    op.drop_table("course_requirements")
    op.drop_table("course_tag_mappings")
    op.drop_table("course_category_mappings")
    op.drop_index("ix_courses_target_level", table_name="courses")
    op.drop_index("ix_courses_status", table_name="courses")
    op.drop_index("ix_courses_slug", table_name="courses")
    op.drop_index("ix_courses_code", table_name="courses")
    op.drop_index("ix_courses_name", table_name="courses")
    op.drop_table("courses")
    op.drop_index("ix_course_tags_slug", table_name="course_tags")
    op.drop_index("ix_course_tags_name", table_name="course_tags")
    op.drop_table("course_tags")
    op.drop_index("ix_course_categories_slug", table_name="course_categories")
    op.drop_index("ix_course_categories_name", table_name="course_categories")
    op.drop_table("course_categories")
    for name in [
        "material_type",
        "lesson_status",
        "course_module_status",
        "course_target_level",
        "course_status",
        "course_category_status",
    ]:
        sa.Enum(name=name).drop(op.get_bind(), checkfirst=True)

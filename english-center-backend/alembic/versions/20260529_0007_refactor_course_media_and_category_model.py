"""refactor course media and category model

Revision ID: 20260529_0007
Revises: 20260529_0006
Create Date: 2026-05-29
"""

import uuid

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260529_0007"
down_revision = "20260529_0006"
branch_labels = None
depends_on = None


def timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    ]


def upgrade() -> None:
    bind = op.get_bind()

    course_mode = sa.Enum("template", "center", name="course_mode")
    course_mode.create(bind, checkfirst=True)

    op.create_table(
        "media",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("bucket", sa.String(length=100), nullable=False),
        sa.Column("object_name", sa.String(length=500), nullable=False, unique=True),
        sa.Column("original_filename", sa.String(length=255), nullable=True),
        sa.Column("content_type", sa.String(length=255), nullable=True),
        sa.Column("size", sa.Integer(), nullable=True),
        sa.Column("uploaded_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        *timestamps(),
    )
    op.create_index("ix_media_object_name", "media", ["object_name"], unique=True)

    op.create_table(
        "course_media",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("media_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("media.id"), nullable=False),
        sa.Column("media_type", sa.String(length=50), nullable=True),
        sa.Column("order_index", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_primary", sa.Boolean(), nullable=False, server_default=sa.false()),
        *timestamps(),
        sa.UniqueConstraint("course_id", "media_id", name="uq_course_media_course_media"),
    )
    op.create_index("ix_course_media_course_id", "course_media", ["course_id"], unique=False)
    op.create_index("ix_course_media_media_id", "course_media", ["media_id"], unique=False)

    op.add_column("courses", sa.Column("category_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.add_column("courses", sa.Column("mode", course_mode, nullable=False, server_default="center"))
    op.create_index("ix_courses_category_id", "courses", ["category_id"], unique=False)
    op.create_index("ix_courses_mode", "courses", ["mode"], unique=False)
    op.create_foreign_key("fk_courses_category_id", "courses", "course_categories", ["category_id"], ["id"])

    op.add_column("course_modules", sa.Column("media_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index("ix_course_modules_media_id", "course_modules", ["media_id"], unique=False)
    op.create_foreign_key("fk_course_modules_media_id", "course_modules", "media", ["media_id"], ["id"])

    op.execute(
        sa.text(
            """
            WITH ranked AS (
                SELECT
                    course_id,
                    category_id,
                    ROW_NUMBER() OVER (PARTITION BY course_id ORDER BY created_at ASC, id ASC) AS rn
                FROM course_category_mappings
                WHERE deleted_at IS NULL
            )
            UPDATE courses c
            SET category_id = ranked.category_id
            FROM ranked
            WHERE c.id = ranked.course_id AND ranked.rn = 1
            """
        )
    )
    op.execute(
        sa.text(
            """
            UPDATE courses c
            SET category_id = (
                SELECT cc.id
                FROM course_categories cc
                WHERE cc.deleted_at IS NULL
                ORDER BY cc.created_at ASC, cc.id ASC
                LIMIT 1
            )
            WHERE c.category_id IS NULL
            """
        )
    )
    op.alter_column("courses", "category_id", nullable=False)

    op.execute(
        sa.text(
            """
            ALTER TABLE courses
            ALTER COLUMN target_level
            TYPE text
            USING target_level::text
            """
        )
    )
    old_enum = sa.Enum(name="course_target_level")
    old_enum.drop(bind, checkfirst=False)
    new_enum = sa.Enum("A0", "A1", "A2", "B1", "B2", "C1", "C2", name="course_target_level")
    new_enum.create(bind, checkfirst=False)
    op.execute(
        sa.text(
            """
            ALTER TABLE courses
            ALTER COLUMN target_level
            TYPE course_target_level
            USING (
                CASE target_level
                    WHEN 'beginner' THEN 'A0'
                    WHEN 'elementary' THEN 'A2'
                    WHEN 'intermediate' THEN 'B1'
                    WHEN 'upper_intermediate' THEN 'B2'
                    WHEN 'advanced' THEN 'C1'
                    ELSE NULL
                END
            )::course_target_level
            """
        )
    )

    courses = bind.execute(
        sa.text(
            """
            SELECT id, thumbnail_bucket, thumbnail_object_name, created_at, updated_at
            FROM courses
            WHERE thumbnail_bucket IS NOT NULL AND thumbnail_object_name IS NOT NULL
            """
        )
    ).fetchall()

    for course in courses:
        media_id = uuid.uuid4()
        course_media_id = uuid.uuid4()
        bind.execute(
            sa.text(
                """
                INSERT INTO media (
                    id, bucket, object_name, original_filename, content_type, size, uploaded_by, created_at, updated_at, deleted_at
                ) VALUES (
                    :id, :bucket, :object_name, NULL, NULL, NULL, NULL, :created_at, :updated_at, NULL
                )
                ON CONFLICT (object_name) DO NOTHING
                """
            ),
            {
                "id": media_id,
                "bucket": course.thumbnail_bucket,
                "object_name": course.thumbnail_object_name,
                "created_at": course.created_at,
                "updated_at": course.updated_at,
            },
        )
        saved_media = bind.execute(
            sa.text("SELECT id FROM media WHERE object_name = :object_name LIMIT 1"),
            {"object_name": course.thumbnail_object_name},
        ).scalar_one()
        bind.execute(
            sa.text(
                """
                INSERT INTO course_media (
                    id, course_id, media_id, media_type, order_index, is_primary, created_at, updated_at, deleted_at
                ) VALUES (
                    :id, :course_id, :media_id, 'thumbnail', 0, true, :created_at, :updated_at, NULL
                )
                ON CONFLICT (course_id, media_id) DO NOTHING
                """
            ),
            {
                "id": course_media_id,
                "course_id": course.id,
                "media_id": saved_media,
                "created_at": course.created_at,
                "updated_at": course.updated_at,
            },
        )

    op.drop_column("courses", "thumbnail_bucket")
    op.drop_column("courses", "thumbnail_object_name")
    op.drop_table("course_category_mappings")


def downgrade() -> None:
    bind = op.get_bind()

    op.create_table(
        "course_category_mappings",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("category_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("course_categories.id"), nullable=False),
        *timestamps(),
        sa.UniqueConstraint("course_id", "category_id", name="uq_course_category_mapping"),
    )

    op.add_column("courses", sa.Column("thumbnail_bucket", sa.String(length=100), nullable=True))
    op.add_column("courses", sa.Column("thumbnail_object_name", sa.String(length=500), nullable=True))

    op.execute(
        sa.text(
            """
            UPDATE courses c
            SET thumbnail_bucket = m.bucket,
                thumbnail_object_name = m.object_name
            FROM course_media cm
            JOIN media m ON m.id = cm.media_id
            WHERE cm.course_id = c.id
              AND cm.is_primary = true
              AND cm.deleted_at IS NULL
            """
        )
    )

    courses_with_category = bind.execute(
        sa.text(
            """
            SELECT id, category_id, created_at, updated_at
            FROM courses
            WHERE category_id IS NOT NULL
            """
        )
    ).fetchall()
    for row in courses_with_category:
        bind.execute(
            sa.text(
                """
                INSERT INTO course_category_mappings (id, course_id, category_id, created_at, updated_at, deleted_at)
                VALUES (:id, :course_id, :category_id, :created_at, :updated_at, NULL)
                ON CONFLICT (course_id, category_id) DO NOTHING
                """
            ),
            {
                "id": uuid.uuid4(),
                "course_id": row.id,
                "category_id": row.category_id,
                "created_at": row.created_at,
                "updated_at": row.updated_at,
            },
        )

    op.execute(
        sa.text(
            """
            ALTER TABLE courses
            ALTER COLUMN target_level
            TYPE text
            USING target_level::text
            """
        )
    )
    sa.Enum(name="course_target_level").drop(bind, checkfirst=False)
    old_enum = sa.Enum("beginner", "elementary", "intermediate", "upper_intermediate", "advanced", name="course_target_level")
    old_enum.create(bind, checkfirst=False)
    op.execute(
        sa.text(
            """
            ALTER TABLE courses
            ALTER COLUMN target_level
            TYPE course_target_level
            USING (
                CASE target_level
                    WHEN 'A0' THEN 'beginner'
                    WHEN 'A1' THEN 'beginner'
                    WHEN 'A2' THEN 'elementary'
                    WHEN 'B1' THEN 'intermediate'
                    WHEN 'B2' THEN 'upper_intermediate'
                    WHEN 'C1' THEN 'advanced'
                    WHEN 'C2' THEN 'advanced'
                    ELSE NULL
                END
            )::course_target_level
            """
        )
    )

    op.drop_constraint("fk_course_modules_media_id", "course_modules", type_="foreignkey")
    op.drop_index("ix_course_modules_media_id", table_name="course_modules")
    op.drop_column("course_modules", "media_id")

    op.drop_constraint("fk_courses_category_id", "courses", type_="foreignkey")
    op.drop_index("ix_courses_mode", table_name="courses")
    op.drop_index("ix_courses_category_id", table_name="courses")
    op.drop_column("courses", "mode")
    op.drop_column("courses", "category_id")

    op.drop_index("ix_course_media_media_id", table_name="course_media")
    op.drop_index("ix_course_media_course_id", table_name="course_media")
    op.drop_table("course_media")
    op.drop_index("ix_media_object_name", table_name="media")
    op.drop_table("media")

    sa.Enum(name="course_mode").drop(bind, checkfirst=True)

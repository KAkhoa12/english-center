"""refactor lesson media relations

Revision ID: 20260529_0008
Revises: 20260529_0007
Create Date: 2026-05-29
"""

import uuid

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260529_0008"
down_revision = "20260529_0007"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()

    op.add_column("lessons", sa.Column("media_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index("ix_lessons_media_id", "lessons", ["media_id"], unique=False)
    op.create_foreign_key("fk_lessons_media_id", "lessons", "media", ["media_id"], ["id"])

    op.add_column("lesson_materials", sa.Column("media_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index("ix_lesson_materials_media_id", "lesson_materials", ["media_id"], unique=False)
    op.create_foreign_key("fk_lesson_materials_media_id", "lesson_materials", "media", ["media_id"], ["id"])

    rows = bind.execute(
        sa.text(
            """
            SELECT id, file_bucket, file_object_name, created_at, updated_at
            FROM lesson_materials
            WHERE file_bucket IS NOT NULL AND file_object_name IS NOT NULL
            """
        )
    ).fetchall()
    for row in rows:
        media_id = uuid.uuid4()
        bind.execute(
            sa.text(
                """
                INSERT INTO media (id, bucket, object_name, original_filename, content_type, size, uploaded_by, created_at, updated_at, deleted_at)
                VALUES (:id, :bucket, :object_name, NULL, NULL, NULL, NULL, :created_at, :updated_at, NULL)
                ON CONFLICT (object_name) DO NOTHING
                """
            ),
            {
                "id": media_id,
                "bucket": row.file_bucket,
                "object_name": row.file_object_name,
                "created_at": row.created_at,
                "updated_at": row.updated_at,
            },
        )
        saved_media = bind.execute(
            sa.text("SELECT id FROM media WHERE object_name = :object_name LIMIT 1"),
            {"object_name": row.file_object_name},
        ).scalar_one()
        bind.execute(
            sa.text("UPDATE lesson_materials SET media_id = :media_id WHERE id = :id"),
            {"media_id": saved_media, "id": row.id},
        )

    op.drop_column("lesson_materials", "material_type")
    op.drop_column("lesson_materials", "file_bucket")
    op.drop_column("lesson_materials", "file_object_name")
    sa.Enum(name="material_type").drop(bind, checkfirst=True)


def downgrade() -> None:
    bind = op.get_bind()
    material_type = sa.Enum("pdf", "document", "slide", "image", "audio", "video", "link", "other", name="material_type")
    material_type.create(bind, checkfirst=True)
    op.add_column("lesson_materials", sa.Column("material_type", material_type, nullable=False, server_default="other"))
    op.add_column("lesson_materials", sa.Column("file_bucket", sa.String(length=100), nullable=True))
    op.add_column("lesson_materials", sa.Column("file_object_name", sa.String(length=500), nullable=True))

    op.execute(
        sa.text(
            """
            UPDATE lesson_materials lm
            SET file_bucket = m.bucket,
                file_object_name = m.object_name
            FROM media m
            WHERE lm.media_id = m.id
            """
        )
    )
    op.execute(
        sa.text(
            """
            UPDATE lesson_materials
            SET material_type = CASE WHEN external_url IS NOT NULL THEN 'link' ELSE 'other' END
            """
        )
    )

    op.drop_constraint("fk_lesson_materials_media_id", "lesson_materials", type_="foreignkey")
    op.drop_index("ix_lesson_materials_media_id", table_name="lesson_materials")
    op.drop_column("lesson_materials", "media_id")

    op.drop_constraint("fk_lessons_media_id", "lessons", type_="foreignkey")
    op.drop_index("ix_lessons_media_id", table_name="lessons")
    op.drop_column("lessons", "media_id")

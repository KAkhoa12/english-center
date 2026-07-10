"""add folder to media

Revision ID: 20260710_0019
Revises: 20260630_0018
Create Date: 2026-07-10
"""

from alembic import op
import sqlalchemy as sa

revision = "20260710_0019"
down_revision = "20260630_0018"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("media", sa.Column("folder", sa.String(length=255), nullable=True))
    op.create_index("ix_media_folder", "media", ["folder"], unique=False)
    op.execute(
        sa.text(
            """
            UPDATE media
            SET folder = substring(object_name from '^(.*)/[^/]+$')
            WHERE object_name LIKE '%/%'
            """
        )
    )


def downgrade() -> None:
    op.drop_index("ix_media_folder", table_name="media")
    op.drop_column("media", "folder")

"""create class sessions media table

Revision ID: 20260606_0012
Revises: 20260605_0011
Create Date: 2026-06-06
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260606_0012"
down_revision = "20260605_0011"
branch_labels = None
depends_on = None


def timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    ]


def upgrade() -> None:
    op.create_table(
        "class_sessions_media",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("class_session_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("class_sessions.id"), nullable=False),
        sa.Column("media_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("media.id"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("order_index", sa.Integer(), nullable=False, server_default="0"),
        *timestamps(),
    )
    op.create_index("ix_class_sessions_media_class_session_id", "class_sessions_media", ["class_session_id"], unique=False)
    op.create_index("ix_class_sessions_media_media_id", "class_sessions_media", ["media_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_class_sessions_media_media_id", table_name="class_sessions_media")
    op.drop_index("ix_class_sessions_media_class_session_id", table_name="class_sessions_media")
    op.drop_table("class_sessions_media")

"""fix class_sessions_teachers timestamps

Revision ID: 20260712_0022
Revises: 20260712_0021
Create Date: 2026-07-12
"""

from alembic import op
import sqlalchemy as sa


revision = "20260712_0022"
down_revision = "20260712_0021"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        sa.text(
            """
            UPDATE class_sessions_teachers
            SET created_at = COALESCE(created_at, now()),
                updated_at = COALESCE(updated_at, now())
            """
        )
    )
    op.alter_column(
        "class_sessions_teachers",
        "created_at",
        existing_type=sa.DateTime(timezone=True),
        nullable=False,
        server_default=sa.text("now()"),
    )
    op.alter_column(
        "class_sessions_teachers",
        "updated_at",
        existing_type=sa.DateTime(timezone=True),
        nullable=False,
        server_default=sa.text("now()"),
    )


def downgrade() -> None:
    op.alter_column(
        "class_sessions_teachers",
        "updated_at",
        existing_type=sa.DateTime(timezone=True),
        nullable=False,
        server_default=None,
    )
    op.alter_column(
        "class_sessions_teachers",
        "created_at",
        existing_type=sa.DateTime(timezone=True),
        nullable=False,
        server_default=None,
    )

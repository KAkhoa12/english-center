"""add guardian_id to users

Revision ID: 20260712_0023
Revises: 20260712_0022
Create Date: 2026-07-12
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260712_0023"
down_revision = "20260712_0022"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("guardian_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
    )
    op.create_index(op.f("ix_users_guardian_id"), "users", ["guardian_id"])


def downgrade() -> None:
    op.drop_index(op.f("ix_users_guardian_id"), table_name="users")
    op.drop_column("users", "guardian_id")

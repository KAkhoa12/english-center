"""allow template lesson assignments

Revision ID: 20260605_0011
Revises: 20260529_0010
Create Date: 2026-06-05
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260605_0011"
down_revision = "20260529_0010"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        "assignments",
        "class_id",
        existing_type=postgresql.UUID(as_uuid=True),
        nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "assignments",
        "class_id",
        existing_type=postgresql.UUID(as_uuid=True),
        nullable=False,
    )

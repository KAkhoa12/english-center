"""add room_id to classes

Revision ID: 20260610_0013
Revises: 20260606_0012
Create Date: 2026-06-10
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260610_0013"
down_revision = "20260606_0012"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("classes", sa.Column("room_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index(op.f("ix_classes_room_id"), "classes", ["room_id"], unique=False)
    op.create_foreign_key("fk_classes_room_id_rooms", "classes", "rooms", ["room_id"], ["id"])


def downgrade() -> None:
    op.drop_constraint("fk_classes_room_id_rooms", "classes", type_="foreignkey")
    op.drop_index(op.f("ix_classes_room_id"), table_name="classes")
    op.drop_column("classes", "room_id")

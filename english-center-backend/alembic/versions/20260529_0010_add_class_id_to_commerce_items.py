"""add class_id to cart/order/invoice items

Revision ID: 20260529_0010
Revises: 20260529_0009
Create Date: 2026-05-29
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260529_0010"
down_revision = "20260529_0009"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("cart_items", sa.Column("class_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index("ix_cart_items_class_id", "cart_items", ["class_id"], unique=False)
    op.create_foreign_key(
        "fk_cart_items_class_id",
        "cart_items",
        "classes",
        ["class_id"],
        ["id"],
    )

    op.add_column("order_items", sa.Column("class_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index("ix_order_items_class_id", "order_items", ["class_id"], unique=False)
    op.create_foreign_key(
        "fk_order_items_class_id",
        "order_items",
        "classes",
        ["class_id"],
        ["id"],
    )

    op.add_column("invoice_items", sa.Column("class_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index("ix_invoice_items_class_id", "invoice_items", ["class_id"], unique=False)
    op.create_foreign_key(
        "fk_invoice_items_class_id",
        "invoice_items",
        "classes",
        ["class_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint("fk_invoice_items_class_id", "invoice_items", type_="foreignkey")
    op.drop_index("ix_invoice_items_class_id", table_name="invoice_items")
    op.drop_column("invoice_items", "class_id")

    op.drop_constraint("fk_order_items_class_id", "order_items", type_="foreignkey")
    op.drop_index("ix_order_items_class_id", table_name="order_items")
    op.drop_column("order_items", "class_id")

    op.drop_constraint("fk_cart_items_class_id", "cart_items", type_="foreignkey")
    op.drop_index("ix_cart_items_class_id", table_name="cart_items")
    op.drop_column("cart_items", "class_id")

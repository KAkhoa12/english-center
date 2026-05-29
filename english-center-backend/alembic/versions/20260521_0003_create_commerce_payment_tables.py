"""create commerce payment tables

Revision ID: 20260521_0003
Revises: 20260521_0002
Create Date: 2026-05-21
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260521_0003"
down_revision = "20260521_0002"
branch_labels = None
depends_on = None


def timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    ]


def upgrade() -> None:
    cart_status = sa.Enum("active", "checked_out", "abandoned", name="cart_status")
    order_status = sa.Enum("pending", "awaiting_payment", "paid", "failed", "cancelled", "expired", "refunded", name="order_status")
    order_payment_method = sa.Enum("sepay_bank_transfer", "sepay_card", "sepay_napas_bank_transfer", "manual_cash", "manual_bank_transfer", name="order_payment_method")
    invoice_status = sa.Enum("draft", "issued", "paid", "cancelled", name="invoice_status")
    payment_provider = sa.Enum("sepay", "manual", name="payment_provider")
    payment_method = sa.Enum("BANK_TRANSFER", "CARD", "NAPAS_BANK_TRANSFER", "MANUAL_CASH", "MANUAL_BANK_TRANSFER", name="payment_method")
    payment_status = sa.Enum("pending", "processing", "approved", "failed", "cancelled", "refunded", name="payment_status")
    enrollment_status = sa.Enum("active", "completed", "cancelled", name="enrollment_status")

    op.create_table(
        "carts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", cart_status, nullable=False, server_default="active"),
        *timestamps(),
    )
    op.create_index("ix_carts_user_id", "carts", ["user_id"])

    op.create_table(
        "cart_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("cart_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("carts.id"), nullable=False),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("course_name", sa.String(255), nullable=False),
        sa.Column("course_code", sa.String(100), nullable=True),
        sa.Column("unit_price", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("quantity", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("total_price", sa.Numeric(12, 2), nullable=False, server_default="0"),
        *timestamps(),
        sa.UniqueConstraint("cart_id", "course_id", name="uq_cart_items_cart_course"),
    )
    op.create_index("ix_cart_items_cart_id", "cart_items", ["cart_id"])
    op.create_index("ix_cart_items_course_id", "cart_items", ["course_id"])

    op.create_table(
        "course_wishlists",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        *timestamps(),
        sa.UniqueConstraint("user_id", "course_id", name="uq_course_wishlists_user_course"),
    )
    op.create_index("ix_course_wishlists_user_id", "course_wishlists", ["user_id"])
    op.create_index("ix_course_wishlists_course_id", "course_wishlists", ["course_id"])

    op.create_table(
        "orders",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("student_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("students.id"), nullable=True),
        sa.Column("cart_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("carts.id"), nullable=True),
        sa.Column("order_code", sa.String(50), nullable=False, unique=True),
        sa.Column("invoice_number", sa.String(50), nullable=False, unique=True),
        sa.Column("status", order_status, nullable=False, server_default="pending"),
        sa.Column("currency", sa.String(10), nullable=False, server_default="VND"),
        sa.Column("subtotal_amount", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("discount_amount", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("total_amount", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("payment_method", order_payment_method, nullable=True),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("cancelled_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("expired_at", sa.DateTime(timezone=True), nullable=True),
        *timestamps(),
    )
    op.create_index("ix_orders_user_id", "orders", ["user_id"])
    op.create_index("ix_orders_order_code", "orders", ["order_code"], unique=True)
    op.create_index("ix_orders_invoice_number", "orders", ["invoice_number"], unique=True)
    op.create_index("ix_orders_status", "orders", ["status"])

    op.create_table(
        "order_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("orders.id"), nullable=False),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("course_name", sa.String(255), nullable=False),
        sa.Column("course_code", sa.String(100), nullable=True),
        sa.Column("unit_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("total_price", sa.Numeric(12, 2), nullable=False),
        *timestamps(),
    )

    op.create_table(
        "invoices",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("orders.id"), nullable=False, unique=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("invoice_number", sa.String(50), nullable=False, unique=True),
        sa.Column("invoice_status", invoice_status, nullable=False, server_default="draft"),
        sa.Column("issued_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("buyer_name", sa.String(255), nullable=True),
        sa.Column("buyer_email", sa.String(255), nullable=True),
        sa.Column("buyer_phone", sa.String(30), nullable=True),
        sa.Column("billing_address", sa.Text(), nullable=True),
        sa.Column("currency", sa.String(10), nullable=False, server_default="VND"),
        sa.Column("subtotal_amount", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("discount_amount", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("total_amount", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("invoice_metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        *timestamps(),
    )
    op.create_index("ix_invoices_order_id", "invoices", ["order_id"], unique=True)
    op.create_index("ix_invoices_invoice_number", "invoices", ["invoice_number"], unique=True)

    op.create_table(
        "invoice_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("invoice_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("invoices.id"), nullable=False),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=True),
        sa.Column("item_name", sa.String(255), nullable=False),
        sa.Column("item_code", sa.String(100), nullable=True),
        sa.Column("unit_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("total_price", sa.Numeric(12, 2), nullable=False),
        *timestamps(),
    )

    op.create_table(
        "payments",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("orders.id"), nullable=False),
        sa.Column("invoice_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("invoices.id"), nullable=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("provider", payment_provider, nullable=False),
        sa.Column("payment_method", payment_method, nullable=False),
        sa.Column("status", payment_status, nullable=False, server_default="pending"),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("currency", sa.String(10), nullable=False, server_default="VND"),
        sa.Column("provider_payment_id", sa.String(255), nullable=True),
        sa.Column("provider_transaction_id", sa.String(255), nullable=True),
        sa.Column("checkout_url", sa.Text(), nullable=True),
        sa.Column("raw_request", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("raw_response", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        *timestamps(),
    )
    op.create_index("ix_payments_order_id", "payments", ["order_id"])
    op.create_index("ix_payments_status", "payments", ["status"])
    op.create_index("ix_payments_provider_transaction_id", "payments", ["provider_transaction_id"])

    op.create_table(
        "sepay_ipn_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("orders.id"), nullable=True),
        sa.Column("payment_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("payments.id"), nullable=True),
        sa.Column("invoice_number", sa.String(50), nullable=True),
        sa.Column("notification_type", sa.String(100), nullable=True),
        sa.Column("sepay_order_id", sa.String(255), nullable=True),
        sa.Column("sepay_transaction_id", sa.String(255), nullable=True),
        sa.Column("transaction_status", sa.String(100), nullable=True),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("headers", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("is_valid", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("processed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        *timestamps(),
    )
    op.create_index("ix_sepay_ipn_logs_invoice_number", "sepay_ipn_logs", ["invoice_number"])
    op.create_index("ix_sepay_ipn_logs_sepay_transaction_id", "sepay_ipn_logs", ["sepay_transaction_id"])

    op.create_table(
        "course_enrollments",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("student_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("students.id"), nullable=True),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("order_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("orders.id"), nullable=True),
        sa.Column("order_item_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("order_items.id"), nullable=True),
        sa.Column("enrollment_status", enrollment_status, nullable=False, server_default="active"),
        sa.Column("enrolled_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        *timestamps(),
        sa.UniqueConstraint("user_id", "course_id", name="uq_course_enrollments_user_course"),
    )
    op.create_index("ix_course_enrollments_user_id", "course_enrollments", ["user_id"])
    op.create_index("ix_course_enrollments_course_id", "course_enrollments", ["course_id"])


def downgrade() -> None:
    for table in [
        "course_enrollments",
        "sepay_ipn_logs",
        "payments",
        "invoice_items",
        "invoices",
        "order_items",
        "orders",
        "course_wishlists",
        "cart_items",
        "carts",
    ]:
        op.drop_table(table)
    for name in [
        "enrollment_status",
        "payment_status",
        "payment_method",
        "payment_provider",
        "invoice_status",
        "order_payment_method",
        "order_status",
        "cart_status",
    ]:
        sa.Enum(name=name).drop(op.get_bind(), checkfirst=True)

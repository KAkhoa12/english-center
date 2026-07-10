"""chat and payment webhook refactor

Revision ID: 20260712_0021
Revises: 20260711_0020
Create Date: 2026-07-12
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260712_0021"
down_revision = "20260711_0020"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()

    # =========================================================
    # CHAT
    # =========================================================
    op.execute(sa.text("ALTER TYPE conversation_type RENAME VALUE 'direct' TO 'direct_learning'"))
    op.execute(sa.text("ALTER TYPE conversation_type ADD VALUE IF NOT EXISTS 'direct_consultation'"))
    op.execute(sa.text("ALTER TYPE conversation_type ADD VALUE IF NOT EXISTS 'class_group'"))
    op.alter_column("conversations", "type", new_column_name="conversation_type", existing_type=sa.String())
    op.add_column("conversations", sa.Column("consultation_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("consultations.id"), nullable=True))
    op.create_index("ix_conversations_consultation_id", "conversations", ["consultation_id"])

    participant_role = sa.Enum("consultant", "customer", "teacher", "student", name="conversation_participant_role")
    participant_role.create(conn, checkfirst=True)
    op.add_column("conversation_participants", sa.Column("participant_role", participant_role, nullable=True))
    op.add_column("conversation_participants", sa.Column("joined_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("conversation_participants", sa.Column("left_at", sa.DateTime(timezone=True), nullable=True))

    op.execute(
        sa.text(
            """
            UPDATE conversation_participants cp
            SET
                participant_role = (
                    CASE
                        WHEN EXISTS (
                            SELECT 1
                            FROM user_roles ur
                            JOIN roles r ON r.id = ur.role_id
                            WHERE ur.user_id = cp.user_id
                              AND ur.deleted_at IS NULL
                              AND r.deleted_at IS NULL
                              AND r.name = 'teacher'
                        ) THEN 'teacher'

                        WHEN EXISTS (
                            SELECT 1
                            FROM user_roles ur
                            JOIN roles r ON r.id = ur.role_id
                            WHERE ur.user_id = cp.user_id
                              AND ur.deleted_at IS NULL
                              AND r.deleted_at IS NULL
                              AND r.name = 'student'
                        ) THEN 'student'

                        WHEN EXISTS (
                            SELECT 1
                            FROM user_roles ur
                            JOIN roles r ON r.id = ur.role_id
                            WHERE ur.user_id = cp.user_id
                              AND ur.deleted_at IS NULL
                              AND r.deleted_at IS NULL
                              AND r.name IN ('admin', 'staff', 'manager')
                        ) THEN 'consultant'

                        ELSE 'customer'
                    END
                )::conversation_participant_role,

                joined_at = COALESCE(joined_at, created_at),
                left_at = NULL

            WHERE participant_role IS NULL
            """
        )
    )
    op.alter_column("conversation_participants", "participant_role", nullable=False)
    op.alter_column("conversation_participants", "joined_at", nullable=False)

    op.add_column("chat_messages", sa.Column("reply_to_message_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("chat_messages.id"), nullable=True))
    op.add_column("chat_messages", sa.Column("is_read", sa.Boolean(), nullable=False, server_default=sa.text("false")))
    op.add_column("chat_messages", sa.Column("read_at", sa.DateTime(timezone=True), nullable=True))
    op.create_index("ix_chat_messages_reply_to_message_id", "chat_messages", ["reply_to_message_id"])
    op.create_index("ix_chat_messages_is_read", "chat_messages", ["is_read"])

    op.add_column("consultations", sa.Column("conversation_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("conversations.id"), nullable=True))
    op.create_index("ix_consultations_conversation_id", "consultations", ["conversation_id"], unique=True)

    # =========================================================
    # PAYMENTS
    # =========================================================
    op.execute(sa.text("ALTER TYPE payment_provider RENAME VALUE 'manual' TO 'cash'"))
    op.execute(sa.text("ALTER TYPE payment_provider ADD VALUE IF NOT EXISTS 'momo'"))
    op.execute(sa.text("ALTER TYPE payment_provider ADD VALUE IF NOT EXISTS 'vnpay'"))
    op.execute(sa.text("ALTER TYPE payment_provider ADD VALUE IF NOT EXISTS 'other'"))
    op.execute(sa.text("ALTER TYPE payment_status RENAME VALUE 'approved' TO 'success'"))
    payment_method_new = sa.Enum("bank_transfer", "cash", "payment_gateway", name="payment_method_new")
    payment_method_new.create(conn, checkfirst=True)
    op.execute(
        sa.text(
            """
            ALTER TABLE payments
            ALTER COLUMN payment_method TYPE payment_method_new
            USING CASE payment_method::text
                WHEN 'BANK_TRANSFER' THEN 'bank_transfer'
                WHEN 'CARD' THEN 'payment_gateway'
                WHEN 'NAPAS_BANK_TRANSFER' THEN 'payment_gateway'
                WHEN 'MANUAL_CASH' THEN 'cash'
                WHEN 'MANUAL_BANK_TRANSFER' THEN 'bank_transfer'
                ELSE payment_method::text
            END::payment_method_new
            """
        )
    )
    op.execute(sa.text("DROP TYPE payment_method"))
    op.execute(sa.text("ALTER TYPE payment_method_new RENAME TO payment_method"))

    op.add_column("payments", sa.Column("external_order_id", sa.String(length=255), nullable=True))
    op.add_column("payments", sa.Column("external_transaction_id", sa.String(length=255), nullable=True))
    op.execute(sa.text("UPDATE payments SET external_order_id = COALESCE(external_order_id, provider_payment_id)"))
    op.execute(sa.text("UPDATE payments SET external_transaction_id = COALESCE(external_transaction_id, provider_transaction_id)"))
    op.create_index("ix_payments_external_order_id", "payments", ["external_order_id"])
    op.create_index("ix_payments_external_transaction_id", "payments", ["external_transaction_id"], unique=True)

    op.rename_table("sepay_ipn_logs", "payment_webhook_logs")
    op.alter_column("payment_webhook_logs", "notification_type", new_column_name="event_type", existing_type=sa.String(length=100))
    op.alter_column("payment_webhook_logs", "sepay_order_id", new_column_name="external_order_id", existing_type=sa.String(length=255))
    op.alter_column("payment_webhook_logs", "sepay_transaction_id", new_column_name="external_transaction_id", existing_type=sa.String(length=255))
    op.add_column(
        "payment_webhook_logs",
        sa.Column("provider", sa.Enum("sepay", "momo", "vnpay", "cash", "other", name="payment_provider"), nullable=False, server_default="sepay"),
    )
    op.create_index("ix_payment_webhook_logs_provider_external_transaction_event", "payment_webhook_logs", ["provider", "external_transaction_id", "event_type"], unique=True)

    # =========================================================
    # DATA LINKING
    # =========================================================
    op.execute(
        sa.text(
            """
            UPDATE consultations c
            SET conversation_id = conv.id
            FROM conversations conv
            WHERE conv.consultation_id = c.id
              AND c.conversation_id IS NULL
            """
        )
    )


def downgrade() -> None:
    conn = op.get_bind()

    # =========================================================
    # PAYMENTS
    # =========================================================
    op.drop_index("ix_payment_webhook_logs_provider_external_transaction_event", table_name="payment_webhook_logs")
    op.drop_column("payment_webhook_logs", "provider")
    op.alter_column("payment_webhook_logs", "external_transaction_id", new_column_name="sepay_transaction_id", existing_type=sa.String(length=255))
    op.alter_column("payment_webhook_logs", "external_order_id", new_column_name="sepay_order_id", existing_type=sa.String(length=255))
    op.alter_column("payment_webhook_logs", "event_type", new_column_name="notification_type", existing_type=sa.String(length=100))
    op.rename_table("payment_webhook_logs", "sepay_ipn_logs")

    op.drop_index("ix_payments_external_transaction_id", table_name="payments")
    op.drop_index("ix_payments_external_order_id", table_name="payments")
    op.drop_column("payments", "external_transaction_id")
    op.drop_column("payments", "external_order_id")

    payment_method_old = sa.Enum("BANK_TRANSFER", "CARD", "NAPAS_BANK_TRANSFER", "MANUAL_CASH", "MANUAL_BANK_TRANSFER", name="payment_method_old")
    payment_method_old.create(conn, checkfirst=True)
    op.execute(
        sa.text(
            """
            ALTER TABLE payments
            ALTER COLUMN payment_method TYPE payment_method_old
            USING CASE payment_method::text
                WHEN 'bank_transfer' THEN 'BANK_TRANSFER'
                WHEN 'cash' THEN 'MANUAL_CASH'
                WHEN 'payment_gateway' THEN 'CARD'
                ELSE payment_method::text
            END::payment_method_old
            """
        )
    )
    op.execute(sa.text("DROP TYPE payment_method"))
    op.execute(sa.text("ALTER TYPE payment_method_old RENAME TO payment_method"))
    op.execute(sa.text("ALTER TYPE payment_provider RENAME VALUE 'cash' TO 'manual'"))

    # =========================================================
    # CHAT
    # =========================================================
    op.drop_index("ix_consultations_conversation_id", table_name="consultations")
    op.drop_column("consultations", "conversation_id")

    op.drop_index("ix_chat_messages_is_read", table_name="chat_messages")
    op.drop_index("ix_chat_messages_reply_to_message_id", table_name="chat_messages")
    op.drop_column("chat_messages", "read_at")
    op.drop_column("chat_messages", "is_read")
    op.drop_column("chat_messages", "reply_to_message_id")

    op.drop_column("conversation_participants", "left_at")
    op.drop_column("conversation_participants", "joined_at")
    op.drop_column("conversation_participants", "participant_role")
    op.execute(sa.text("DROP TYPE conversation_participant_role"))

    op.drop_index("ix_conversations_consultation_id", table_name="conversations")
    op.drop_column("conversations", "consultation_id")
    op.alter_column("conversations", "conversation_type", new_column_name="type", existing_type=sa.String())
    op.execute(sa.text("ALTER TYPE conversation_type RENAME VALUE 'direct_learning' TO 'direct'"))

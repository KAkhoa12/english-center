"""drop chat, stale columns, dead code tables

Revision ID: 20260720_0025
Revises: 20260720_0024
Create Date: 2026-07-20
"""

from alembic import op
import sqlalchemy as sa


revision = "20260720_0025"
down_revision = "20260720_0024"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_column("consultations", "conversation_id")
    op.drop_column("orders", "order_type")
    op.drop_column("course_enrollments", "enrollment_type")

    op.execute("DROP TABLE IF EXISTS chat_message_attachments CASCADE")
    op.execute("DROP TABLE IF EXISTS chat_messages CASCADE")
    op.execute("DROP TABLE IF EXISTS conversation_participants CASCADE")
    op.execute("DROP TABLE IF EXISTS conversations CASCADE")

    op.execute("DROP TYPE IF EXISTS chat_message_type CASCADE")
    op.execute("DROP TYPE IF EXISTS conversation_type CASCADE")


def downgrade() -> None:
    op.execute("CREATE TYPE chat_message_type AS ENUM ('text', 'file', 'image', 'mixed')")
    op.execute("CREATE TYPE conversation_type AS ENUM ('direct_consultation', 'direct_learning', 'class_group', 'direct')")

    op.create_table("conversations",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("conversation_type", sa.String(50), nullable=False),
        sa.Column("title", sa.String(255), nullable=True),
        sa.Column("consultation_id", sa.String(36), nullable=True),
        sa.Column("class_id", sa.String(36), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.execute("""
        CREATE TABLE conversation_participants (
            id VARCHAR(36) PRIMARY KEY,
            conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id),
            user_id VARCHAR(36) NOT NULL REFERENCES users(id),
            participant_role VARCHAR(50),
            joined_at TIMESTAMPTZ,
            left_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ,
            updated_at TIMESTAMPTZ,
            deleted_at TIMESTAMPTZ
        )""")
    op.execute("""
        CREATE TABLE chat_messages (
            id VARCHAR(36) PRIMARY KEY,
            conversation_id VARCHAR(36) NOT NULL REFERENCES conversations(id),
            sender_id VARCHAR(36) NOT NULL REFERENCES users(id),
            reply_to_message_id VARCHAR(36),
            content TEXT,
            message_type VARCHAR(20),
            is_read BOOLEAN DEFAULT FALSE,
            read_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ,
            updated_at TIMESTAMPTZ,
            deleted_at TIMESTAMPTZ
        )""")
    op.execute("""
        CREATE TABLE chat_message_attachments (
            id VARCHAR(36) PRIMARY KEY,
            message_id VARCHAR(36) NOT NULL REFERENCES chat_messages(id),
            bucket VARCHAR(100),
            object_name VARCHAR(500),
            original_filename VARCHAR(255),
            content_type VARCHAR(255),
            size INTEGER,
            url TEXT,
            created_at TIMESTAMPTZ,
            updated_at TIMESTAMPTZ
        )""")
    op.add_column("consultations", sa.Column("conversation_id", sa.String(36), nullable=True, unique=True))
    op.add_column("orders", sa.Column("order_type", sa.String(20), nullable=False, server_default="center"))
    op.add_column("course_enrollments", sa.Column("enrollment_type", sa.String(20), nullable=False, server_default="center"))

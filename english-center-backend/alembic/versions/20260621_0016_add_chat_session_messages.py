"""add chat session messages

Revision ID: 20260621_0016
Revises: 20260621_0015
Create Date: 2026-06-21
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260621_0016"
down_revision = "20260621_0015"
branch_labels = None
depends_on = None


agent_message_role = postgresql.ENUM("human", "ai", name="agent_message_role", create_type=False)


def timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    ]


def upgrade() -> None:
    bind = op.get_bind()
    agent_message_role.create(bind, checkfirst=True)

    op.create_table(
        "chat_session_messages",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("agent_state_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("agent_states.id"), nullable=False),
        sa.Column("role", agent_message_role, nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("client_message_id", sa.String(length=255), nullable=True),
        sa.Column("metadata_json", postgresql.JSONB(), nullable=True),
        *timestamps(),
        sa.UniqueConstraint("agent_state_id", "role", "client_message_id", name="uq_chat_session_messages_client_role"),
    )
    op.create_index("ix_chat_session_messages_agent_state_id", "chat_session_messages", ["agent_state_id"])
    op.create_index("ix_chat_session_messages_role", "chat_session_messages", ["role"])
    op.create_index("ix_chat_session_messages_client_message_id", "chat_session_messages", ["client_message_id"])
    op.create_index(
        "ix_chat_session_messages_agent_state_created_at",
        "chat_session_messages",
        ["agent_state_id", "created_at"],
    )


def downgrade() -> None:
    op.drop_index("ix_chat_session_messages_agent_state_created_at", table_name="chat_session_messages")
    op.drop_index("ix_chat_session_messages_client_message_id", table_name="chat_session_messages")
    op.drop_index("ix_chat_session_messages_role", table_name="chat_session_messages")
    op.drop_index("ix_chat_session_messages_agent_state_id", table_name="chat_session_messages")
    op.drop_table("chat_session_messages")
    agent_message_role.drop(op.get_bind(), checkfirst=True)

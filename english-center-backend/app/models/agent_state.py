import enum

from sqlalchemy import Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class AgentMessageRole(str, enum.Enum):
    human = "human"
    ai = "ai"


class AgentState(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "agent_states"

    session_id: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    messages: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    metadata_state: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)


class ChatSessionMessage(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "chat_session_messages"

    agent_state_id: Mapped[str] = mapped_column(ForeignKey("agent_states.id"), nullable=False, index=True)
    role: Mapped[AgentMessageRole] = mapped_column(
        Enum(AgentMessageRole, name="agent_message_role"),
        nullable=False,
        index=True,
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    client_message_id: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    metadata_json: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

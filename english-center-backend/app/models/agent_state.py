from sqlalchemy import String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class AgentState(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "agent_states"

    session_id: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    messages: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    metadata_state: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

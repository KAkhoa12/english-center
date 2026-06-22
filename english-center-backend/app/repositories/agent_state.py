from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.agent_state import AgentMessageRole, AgentState, ChatSessionMessage
from app.repositories.base import BaseRepository


class AgentStateRepository(BaseRepository[AgentState]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, AgentState)

    def get_by_session_id(self, session_id: str) -> AgentState | None:
        return self.db.execute(
            select(AgentState).where(
                AgentState.session_id == session_id,
                AgentState.deleted_at.is_(None),
            )
        ).scalar_one_or_none()


class ChatSessionMessageRepository(BaseRepository[ChatSessionMessage]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, ChatSessionMessage)

    def list_recent(self, agent_state_id: str, limit: int = 20) -> list[ChatSessionMessage]:
        rows = self.db.execute(
            select(ChatSessionMessage)
            .where(
                ChatSessionMessage.agent_state_id == agent_state_id,
                ChatSessionMessage.deleted_at.is_(None),
            )
            .order_by(ChatSessionMessage.created_at.desc())
            .limit(limit)
        ).scalars().all()
        return list(reversed(rows))

    def get_latest_ai_snapshot(self, agent_state_id: str) -> ChatSessionMessage | None:
        return self.db.execute(
            select(ChatSessionMessage)
            .where(
                ChatSessionMessage.agent_state_id == agent_state_id,
                ChatSessionMessage.role == AgentMessageRole.ai,
                ChatSessionMessage.metadata_json.is_not(None),
                ChatSessionMessage.deleted_at.is_(None),
            )
            .order_by(ChatSessionMessage.created_at.desc())
            .limit(1)
        ).scalar_one_or_none()

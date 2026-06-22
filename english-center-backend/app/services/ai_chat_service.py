from collections.abc import AsyncGenerator
from datetime import date, datetime, time
from enum import Enum
from uuid import UUID, uuid4

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.ai.agents.advisor_bot.graph import app_graph
from app.ai.agents.advisor_bot.nodes.sample import sample_node
from app.ai.agents.advisor_bot.state import AdvisorState
from app.ai.llms.client import get_llm
from app.models.agent_state import AgentMessageRole, AgentState, ChatSessionMessage
from app.repositories.agent_state import AgentStateRepository, ChatSessionMessageRepository


def _content_to_text(content: object) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: list[str] = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict) and isinstance(item.get("text"), str):
                parts.append(item["text"])
        return " ".join(parts)
    return str(content) if content is not None else ""


def _serialize_value(value: object) -> object:
    if isinstance(value, BaseMessage):
        return {"type": value.type, "content": _content_to_text(value.content)}
    if isinstance(value, BaseModel):
        return value.model_dump(mode="json")
    if isinstance(value, Enum):
        return value.value
    if isinstance(value, UUID):
        return str(value)
    if isinstance(value, (datetime, date, time)):
        return value.isoformat()
    if isinstance(value, list):
        return [_serialize_value(item) for item in value]
    if isinstance(value, tuple):
        return [_serialize_value(item) for item in value]
    if isinstance(value, dict):
        return {str(key): _serialize_value(item) for key, item in value.items()}
    return value


def _message_from_row(row: ChatSessionMessage) -> BaseMessage:
    if row.role == AgentMessageRole.ai:
        return AIMessage(content=row.content)
    return HumanMessage(content=row.content)


class AiChatService:
    def __init__(self, db: Session | None = None) -> None:
        self.db = db
        self.agent_state_repo = AgentStateRepository(db) if db else None
        self.message_repo = ChatSessionMessageRepository(db) if db else None

    def create_chat_session(self) -> str:
        agent_state = self._get_or_create_agent_state(str(uuid4()))
        if self.db:
            self.db.commit()
        return agent_state.session_id

    async def stream_advisor_chat(
        self,
        message: str,
        session_id: str | None = None,
        client_message_id: str | None = None,
    ) -> AsyncGenerator[str, None]:
        if not self.db or not self.agent_state_repo or not self.message_repo:
            async for token in self._stream_advisor_without_persistence(message):
                yield token
            return

        agent_state = self._get_or_create_agent_state(session_id)
        state = self._hydrate_state(agent_state, message, client_message_id)
        self.message_repo.create(
            ChatSessionMessage(
                agent_state_id=agent_state.id,
                role=AgentMessageRole.human,
                content=message,
                client_message_id=client_message_id,
            )
        )

        try:
            final_state = await app_graph.ainvoke(state)
            answer = self._extract_answer(final_state)
            if answer:
                yield answer
            snapshot = self._snapshot_state(final_state)
            agent_state.messages = snapshot.get("messages", [])
            agent_state.metadata_state = {key: value for key, value in snapshot.items() if key != "messages"}
            self.agent_state_repo.update(agent_state)
            self.message_repo.create(
                ChatSessionMessage(
                    agent_state_id=agent_state.id,
                    role=AgentMessageRole.ai,
                    content=answer,
                    metadata_json=snapshot,
                )
            )
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

    async def _stream_advisor_without_persistence(self, message: str) -> AsyncGenerator[str, None]:
        state = {"messages": [HumanMessage(content=message)]}
        async for event in sample_node(state):
            for chunk in event.get("messages", []):
                content = _content_to_text(getattr(chunk, "content", chunk))
                if content:
                    yield content

    async def stream_chat(
        self,
        message: str,
        context: str | None = None,
        session_id: str | None = None,
        client_message_id: str | None = None,
    ) -> AsyncGenerator[str, None]:
        if context in {"home", "advisor", "advisor_bot"}:
            async for token in self.stream_advisor_chat(message, session_id, client_message_id):
                yield token
            return

        llm = get_llm(temperature=0.2, tier="low", streaming=True)
        system_prompt = "Bạn là trợ lý AI của trung tâm tiếng Anh. Trả lời ngắn gọn, rõ ràng, hữu ích bằng tiếng Việt."
        if context == "dashboard":
            system_prompt += " Người dùng đang ở dashboard nội bộ. Ưu tiên hỗ trợ học tập, lớp học, lịch học và bài tập."
        elif context == "home":
            system_prompt += " Người dùng đang ở trang chủ. Ưu tiên tư vấn khóa học và lộ trình học."

        async for chunk in llm.astream([SystemMessage(content=system_prompt), HumanMessage(content=message)]):
            content = getattr(chunk, "content", "")
            if isinstance(content, str) and content:
                yield content

    def _get_or_create_agent_state(self, session_id: str | None) -> AgentState:
        normalized_session_id = session_id or str(uuid4())
        agent_state = self.agent_state_repo.get_by_session_id(normalized_session_id)
        if agent_state:
            return agent_state
        return self.agent_state_repo.create(
            AgentState(
                session_id=normalized_session_id,
                messages=[],
                metadata_state={},
            )
        )

    def _hydrate_state(
        self,
        agent_state: AgentState,
        message: str,
        client_message_id: str | None,
    ) -> AdvisorState:
        latest_snapshot = self.message_repo.get_latest_ai_snapshot(str(agent_state.id))
        metadata = latest_snapshot.metadata_json if latest_snapshot and latest_snapshot.metadata_json else agent_state.metadata_state
        recent_messages = self.message_repo.list_recent(str(agent_state.id), limit=20)

        state: AdvisorState = {
            **(metadata or {}),
            "thread_id": agent_state.session_id,
            "client_message_id": client_message_id,
            "messages": [*_messages_from_rows(recent_messages), HumanMessage(content=message)],
            "tool_results": [],
            "task_result": [],
            "current_action": None,
            "db": self.db,
        }
        return state

    def _snapshot_state(self, state: AdvisorState) -> dict:
        allowed_keys = {
            "thread_id",
            "client_message_id",
            "messages",
            "summary",
            "user_info",
            "last_courses_found",
            "last_course_info_found",
            "last_classes_found",
            "last_class_info_found",
            "planner_decision",
            "action_context",
            "tool_results",
            "task_result",
            "final_answer",
            "flow"
        }
        snapshot = {key: _serialize_value(value) for key, value in state.items() if key in allowed_keys}
        snapshot["task_result"] = _serialize_value(state.get("task_result") or state.get("tool_results", []))
        return snapshot

    def _extract_answer(self, state: AdvisorState) -> str:
        if state.get("final_answer"):
            return str(state["final_answer"]).strip()

        for message in reversed(state.get("messages", [])):
            if isinstance(message, AIMessage):
                return _content_to_text(message.content).strip()

        return ""


def _messages_from_rows(rows: list[ChatSessionMessage]) -> list[BaseMessage]:
    return [_message_from_row(row) for row in rows]

from collections import defaultdict
from typing import Annotated

from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.core.security import decode_access_token
from app.db.session import SessionLocal, get_db
from app.dependencies.auth import require_jwt
from app.models import User
from app.repositories.user import UserRepository
from app.schemas.chat import CreateConversationRequest, SendMessageRequest
from app.services.chat_service import ChatService

router = APIRouter(tags=["chat"])


class ChatConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, user_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections[user_id].add(websocket)

    def disconnect(self, user_id: str, websocket: WebSocket) -> None:
        self.active_connections[user_id].discard(websocket)
        if not self.active_connections[user_id]:
            self.active_connections.pop(user_id, None)

    async def send_to_user(self, user_id: str, payload: dict) -> None:
        disconnected: list[WebSocket] = []
        for websocket in self.active_connections.get(user_id, set()):
            try:
                await websocket.send_json(jsonable_encoder(payload))
            except Exception:
                disconnected.append(websocket)
        for websocket in disconnected:
            self.disconnect(user_id, websocket)

    async def broadcast(self, user_ids: list[str], payload: dict) -> None:
        for user_id in user_ids:
            await self.send_to_user(user_id, payload)


manager = ChatConnectionManager()


@router.get("/chat/contacts")
def list_chat_contacts(db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_jwt)):
    data = ChatService(db).list_contacts(current_user)
    return api_response(True, "Chat contacts retrieved successfully", data, None)


@router.get("/chat/conversations")
def list_chat_conversations(db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_jwt)):
    data = ChatService(db).list_conversations(current_user)
    return api_response(True, "Chat conversations retrieved successfully", data, None)


@router.post("/chat/conversations")
def create_chat_conversation(
    payload: CreateConversationRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_jwt),
):
    service = ChatService(db)
    conversation = service.create_conversation(
        current_user,
        payload.conversation_type,
        payload.participant_user_id,
        payload.consultation_id,
        payload.class_id,
    )
    return api_response(True, "Chat conversation retrieved successfully", service.conversation_dict(conversation, current_user), None)


@router.get("/chat/conversations/{conversation_id}/messages")
def list_chat_messages(
    conversation_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_jwt),
    limit: int = Query(50),
    before_id: str | None = None,
):
    service = ChatService(db)
    data = service.list_messages(conversation_id, current_user, limit=limit, before_id=before_id)
    return api_response(True, "Chat messages retrieved successfully", data, build_pagination(1, len(data) or limit, len(data)))


@router.post("/chat/messages")
async def send_chat_message(
    payload: SendMessageRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_jwt),
):
    service = ChatService(db)
    message = service.send_message(current_user, payload)
    participant_ids = service.participant_user_ids(message["conversation_id"])
    await manager.broadcast(participant_ids, {"type": "message.new", "payload": message})
    return api_response(True, "Message sent successfully", message, None)


@router.websocket("/ws/chat")
async def chat_websocket(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)
        return

    db = SessionLocal()
    current_user = None
    try:
        payload = decode_access_token(token)
        user_id = payload.get("user_id")
        current_user = UserRepository(db).get_active_by_id(user_id)
        if not current_user:
            await websocket.close(code=1008)
            return
        await manager.connect(str(current_user.id), websocket)
        await websocket.send_json({"type": "connected", "payload": {"user_id": str(current_user.id)}})

        while True:
            data = await websocket.receive_json()
            event_type = data.get("type")
            if event_type != "message.send":
                await websocket.send_json({"type": "error", "payload": {"message": "Unsupported event type"}})
                continue
            try:
                message = ChatService(db).send_message(current_user, SendMessageRequest(**(data.get("payload") or {})))
                participant_ids = ChatService(db).participant_user_ids(message["conversation_id"])
                await manager.broadcast(participant_ids, {"type": "message.new", "payload": message})
            except Exception as exc:
                await websocket.send_json({"type": "error", "payload": {"message": str(exc)}})
    except WebSocketDisconnect:
        pass
    except Exception:
        await websocket.close(code=1008)
    finally:
        if current_user:
            manager.disconnect(str(current_user.id), websocket)
        db.close()

from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.services.ai_chat_service import AiChatService


class AiChatStreamRequest(BaseModel):
    message: str = Field(min_length=1)
    context: str | None = None
    session_id: str = Field(min_length=1)
    client_message_id: str | None = None

router = APIRouter(tags=["ai-chat"])


def _stream_response(payload: AiChatStreamRequest, db: Session, context: str | None = None) -> StreamingResponse:
    async def event_stream():
        try:
            async for token in AiChatService(db).stream_chat(
                payload.message,
                context or payload.context,
                payload.session_id,
                payload.client_message_id,
            ):
                safe_token = token.replace("\r", " ").replace("\n", "\\n")
                yield f"data: {safe_token}\n\n"
            yield "event: done\ndata: [DONE]\n\n"
        except Exception as exc:
            message = str(exc).replace("\r", " ").replace("\n", " ")
            yield f"event: error\ndata: {message}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.post("/chat/session")
def create_ai_chat_session(db: Annotated[Session, Depends(get_db)]):
    session_id = AiChatService(db).create_chat_session()
    return api_response(True, "AI chat session created successfully", {"session_id": session_id}, None)


@router.post("/chat/stream")
async def stream_ai_chat(payload: AiChatStreamRequest, db: Annotated[Session, Depends(get_db)]):
    return _stream_response(payload, db)


@router.post("/chat/advisor/stream")
async def stream_advisor_chat(payload: AiChatStreamRequest, db: Annotated[Session, Depends(get_db)]):
    return _stream_response(payload, db, context="advisor_bot")

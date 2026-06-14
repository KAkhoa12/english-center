from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas.chat import AiChatStreamRequest
from app.services.ai_chat_service import AiChatService

router = APIRouter(tags=["ai-chat"])


@router.post("/chat/stream")
async def stream_ai_chat(payload: AiChatStreamRequest):
    async def event_stream():
        try:
            async for token in AiChatService().stream_chat(payload.message, payload.context):
                safe_token = token.replace("\r", " ").replace("\n", "\\n")
                yield f"data: {safe_token}\n\n"
            yield "event: done\ndata: [DONE]\n\n"
        except Exception as exc:
            message = str(exc).replace("\r", " ").replace("\n", " ")
            yield f"event: error\ndata: {message}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")

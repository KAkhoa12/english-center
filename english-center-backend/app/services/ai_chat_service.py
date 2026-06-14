from collections.abc import AsyncGenerator

from langchain_core.messages import HumanMessage, SystemMessage

from app.ai.llms.client import get_llm


class AiChatService:
    async def stream_chat(self, message: str, context: str | None = None) -> AsyncGenerator[str, None]:
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

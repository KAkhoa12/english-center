from app.ai.agents.advisor_bot.state import AdvisorState
from app.ai.helper.prompt_convert import render_prompt
from app.ai.llms.client import get_llm
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

async def sample_node(state: AdvisorState):
    last_message = state["messages"][-1]
    user_question = last_message.content
    promtp_text = render_prompt("advisor_bot/sample.j2", question=user_question)
    llm = get_llm(tier="high", temperature=0.2, streaming=True)

    async for chunk in llm.astream(promtp_text):
        yield {"messages": [chunk]}

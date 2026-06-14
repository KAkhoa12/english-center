
import json

from langchain_core.messages import SystemMessage

from app.ai.agents.advisor_bot.nodes.base import (
    QuestionClassification,
    classifier_llm,
    render_prompt,
)
from app.ai.agents.advisor_bot.nodes.base import build_business_context
from app.ai.agents.advisor_bot.state import AdvisorState


async def classify_node(state: AdvisorState):
    last_user_message = state["messages"][-1].content

    business_context = build_business_context(state)

    system_prompt = render_prompt(
        "advisor_bot/classifier.j2",
        current_message=last_user_message,
        business_context=json.dumps(
            business_context,
            ensure_ascii=False,
            default=str,
        ),
    )

    structured_llm = classifier_llm.with_structured_output(QuestionClassification)

    result = await structured_llm.ainvoke([
        SystemMessage(content=system_prompt),
    ])

    return {
        "classification": result,
    }

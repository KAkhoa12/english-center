from pathlib import Path
from typing import Any, Literal

from jinja2 import Environment, FileSystemLoader, StrictUndefined
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, BaseMessage


PROMPT_ROOT = Path(__file__).resolve().parents[1] / "agents"


_jinja_env = Environment(
    loader=FileSystemLoader(str(PROMPT_ROOT)),
    undefined=StrictUndefined,
    autoescape=False,
    trim_blocks=True,
    lstrip_blocks=True,
)


def render_prompt(template_name: str, **context: Any) -> str:
    """
    Render file .j2 thành string prompt.

    Example:
        render_prompt(
            "advisor_bot/classifier.j2",
            current_message="Tôi muốn học IELTS",
            context={...}
        )
    """
    template = _jinja_env.get_template(template_name)
    return template.render(**context).strip()


def render_message(
    role: Literal["system", "human", "ai"],
    template_name: str,
    **context: Any,
) -> BaseMessage:
    """
    Render file .j2 thành LangChain message.
    """
    content = render_prompt(template_name, **context)

    if role == "system":
        return SystemMessage(content=content)

    if role == "human":
        return HumanMessage(content=content)

    if role == "ai":
        return AIMessage(content=content)

    raise ValueError(f"Unsupported role: {role}")


def render_messages(
    items: list[dict[str, Any]],
) -> list[BaseMessage]:
    """
    Render nhiều message từ nhiều template.

    Example:
        render_messages([
            {
                "role": "system",
                "template": "advisor_bot/classifier.j2",
                "context": {...}
            }
        ])
    """
    messages: list[BaseMessage] = []

    for item in items:
        messages.append(
            render_message(
                role=item["role"],
                template_name=item["template"],
                **item.get("context", {}),
            )
        )

    return messages

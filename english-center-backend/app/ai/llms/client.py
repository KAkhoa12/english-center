from fastapi.security import api_key
from langchain_ollama import ChatOllama, OllamaEmbeddings
from app.core.config import settings
from typing import Any, Literal, Sequence
Tier = Literal["low", "high"]

def _build_llm(temperature: float, tier: Tier, streaming: bool = False):
    if tier == "high":
        model_name = settings.OLLAMA_HIGH_LLM_MODEL
    elif tier == "low":
        model_name = settings.OLLAMA_LOW_LLM_MODEL

    return ChatOllama(
        model=model_name,
        base_url=settings.OLLAMA_BASE_URL,
        temperature=temperature,
        disable_streaming=not streaming,
        client_kwargs={
            "headers": {
                "Authorization": f"Bearer {settings.OLLAMA_API_KEY}"
            }
        },
    )

def _maybe_bind_tools(llm: Any, enable_tools: bool = False, tools: Sequence[Any] | None = None):
    """
    Bind tools only when explicitly enabled.
    - enable_tools=False: always return base llm (no tool calling).
    - enable_tools=True and tools provided: bind tools for tool calling.
    - enable_tools=True and no tools: keep base llm.
    """
    if not enable_tools:
        return llm
    if not tools:
        return llm
    return llm.bind_tools(list(tools))

def get_llm(
    temperature: float = 0.2,
    tier: Tier = "high",
    streaming: bool = False,
    enable_tools: bool = False,
    tools: Sequence[Any] | None = None,
):
    llm = _build_llm(temperature, tier, streaming)
    return _maybe_bind_tools(llm, enable_tools, tools)

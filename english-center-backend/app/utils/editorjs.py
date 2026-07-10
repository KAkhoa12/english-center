from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any

EDITORJS_VERSION = "2.30.8"


def _now_ms() -> int:
    return int(datetime.now(timezone.utc).timestamp() * 1000)


def text_to_editorjs_document(text: str) -> dict[str, Any]:
    return {
        "time": _now_ms(),
        "blocks": [
            {
                "type": "paragraph",
                "data": {"text": text},
            }
        ],
        "version": EDITORJS_VERSION,
    }


def normalize_editorjs_content(content: Any) -> dict[str, Any] | None:
    if content is None:
        return None

    if isinstance(content, dict):
        return content

    if isinstance(content, list):
        return {
            "time": _now_ms(),
            "blocks": content,
            "version": EDITORJS_VERSION,
        }

    if isinstance(content, str):
        stripped = content.strip()
        if not stripped:
            return None
        try:
            parsed = json.loads(stripped)
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            pass
        return text_to_editorjs_document(stripped)

    return text_to_editorjs_document(str(content))

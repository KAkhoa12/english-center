from math import ceil
from typing import Any

from fastapi.responses import JSONResponse


def api_response(success: bool, message: str, payload: Any = None, pagination: Any = None) -> dict[str, Any]:
    return {
        "success": success,
        "message": message,
        "payload": payload,
        "pagination": pagination,
    }


def build_pagination(page: int, page_size: int, total_items: int) -> dict[str, Any]:
    total_pages = ceil(total_items / page_size) if total_items > 0 else 0
    return {
        "page": page,
        "page_size": page_size,
        "total_items": total_items,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_previous": page > 1,
    }


def json_response(
    success: bool,
    message: str,
    payload: Any = None,
    pagination: Any = None,
    status_code: int = 200,
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content=api_response(success=success, message=message, payload=payload, pagination=pagination),
    )


def error_response(message: str, status_code: int, payload: Any = None, pagination: Any = None) -> JSONResponse:
    return json_response(
        success=False,
        message=message,
        payload=payload,
        pagination=pagination,
        status_code=status_code,
    )

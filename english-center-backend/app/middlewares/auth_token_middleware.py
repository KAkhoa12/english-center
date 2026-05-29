from fastapi import Request, status
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.response import error_response
from app.core.security import decode_access_token


class AccessTokenValidationMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, excluded_paths: set[str] | None = None) -> None:
        super().__init__(app)
        self.excluded_paths = excluded_paths or set()

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        if request.method == "OPTIONS" or path in self.excluded_paths:
            return await call_next(request)

        authorization = request.headers.get("Authorization", "").strip()
        if not authorization:
            return await call_next(request)
        if not authorization.startswith("Bearer "):
            return error_response(message="Invalid or expired token", status_code=status.HTTP_401_UNAUTHORIZED)

        token = authorization[7:].strip()
        if not token:
            return error_response(message="Invalid or expired token", status_code=status.HTTP_401_UNAUTHORIZED)

        try:
            decode_access_token(token)
        except Exception:
            return error_response(message="Invalid or expired token", status_code=status.HTTP_401_UNAUTHORIZED)

        return await call_next(request)

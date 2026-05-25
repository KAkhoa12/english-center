import hashlib
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from passlib.context import CryptContext

from app.core.config import settings

# Use pbkdf2_sha256 to avoid runtime issues from bcrypt backend mismatch on some environments.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def _normalize_password(password: str) -> str:
    # Keep deterministic normalization for very long inputs.
    if len(password.encode("utf-8")) > 4096:
        return hashlib.sha256(password.encode("utf-8")).hexdigest()
    return password


def hash_password(password: str) -> str:
    return pwd_context.hash(_normalize_password(password))


def verify_password(plain_password: str, password_hash: str) -> bool:
    try:
        return pwd_context.verify(_normalize_password(plain_password), password_hash)
    except Exception:
        return False


def create_access_token(user_id: str, email: str, expires_delta: timedelta | None = None) -> str:
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES))
    payload = {"user_id": user_id, "email": email, "token_type": "access", "exp": expire}
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(user_id: str, email: str, expires_delta: timedelta | None = None) -> str:
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS))
    payload = {"user_id": user_id, "email": email, "token_type": "refresh", "exp": expire}
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])


def decode_access_token(token: str) -> dict[str, Any]:
    payload = decode_token(token)
    if payload.get("token_type") != "access":
        raise jwt.InvalidTokenError("Invalid token type")
    return payload


def decode_refresh_token(token: str) -> dict[str, Any]:
    payload = decode_token(token)
    if payload.get("token_type") != "refresh":
        raise jwt.InvalidTokenError("Invalid token type")
    return payload

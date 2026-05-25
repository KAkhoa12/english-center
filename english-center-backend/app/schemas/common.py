from typing import Any, Generic, TypeVar

from pydantic import BaseModel, EmailStr, Field, field_validator

T = TypeVar("T")


class PaginationParams(BaseModel):
    page: int = Field(default=1)
    page_size: int = Field(default=10)
    search: str | None = None
    sort_by: str | None = None
    sort_order: str = "desc"

    @field_validator("page", mode="before")
    @classmethod
    def normalize_page(cls, value: int) -> int:
        try:
            page = int(value)
        except (TypeError, ValueError):
            return 1
        return page if page >= 1 else 1

    @field_validator("page_size", mode="before")
    @classmethod
    def normalize_page_size(cls, value: int) -> int:
        try:
            page_size = int(value)
        except (TypeError, ValueError):
            return 10
        if page_size < 1:
            return 10
        if page_size > 100:
            return 100
        return page_size


class PaginationMeta(BaseModel):
    page: int
    page_size: int
    total_items: int
    total_pages: int
    has_next: bool
    has_previous: bool


class APIResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    payload: T | None = None
    pagination: PaginationMeta | None = None


class ValidationErrorPayload(BaseModel):
    errors: list[dict[str, Any]]


class UserAccountCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    password: str
    avatar_url: str | None = None

class AvatarUpdateRequest(BaseModel):
    avatar_url: str

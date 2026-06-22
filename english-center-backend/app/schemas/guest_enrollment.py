from datetime import datetime

from pydantic import BaseModel, Field, field_validator


def _not_blank(value: str) -> str:
    if not value or not value.strip():
        raise ValueError("must not be blank")
    return value.strip()


class GuestEnrollmentCreate(BaseModel):
    content: str = Field(min_length=1)

    @field_validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        return _not_blank(value)


class GuestEnrollmentUpdate(BaseModel):
    content: str | None = None

    @field_validator("content")
    @classmethod
    def validate_content(cls, value: str | None) -> str | None:
        return _not_blank(value) if value is not None else None


class GuestEnrollmentResponse(BaseModel):
    id: str
    content: str
    created_at: datetime
    updated_at: datetime

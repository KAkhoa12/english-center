from decimal import Decimal
from typing import Any

from pydantic import BaseModel, Field, field_validator


def _not_blank(value: str) -> str:
    if not value or not value.strip():
        raise ValueError("must not be blank")
    return value.strip()


class CourseCategoryCreate(BaseModel):
    name: str
    slug: str | None = None
    description: str | None = None
    status: str = "active"

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        return _not_blank(value)


class CourseCategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    status: str | None = None


class CourseCreate(BaseModel):
    name: str
    code: str
    slug: str | None = None
    description: str | None = None
    category_id: str
    target_level: str | None = None
    output_goal: str | None = None
    discount_price: Decimal | None = Field(default=None, ge=0)
    total_duration_time: int | None = Field(default=None, ge=0)
    total_sessions: int | None = Field(default=None, ge=0)
    price: Decimal = Field(default=0, ge=0)
    status: str = "active"
    requirements: list[str] | None = None
    outcomes: list[str] | None = None

    @field_validator("name", "code")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        return _not_blank(value)


class CourseUpdate(BaseModel):
    title: str | None = None
    name: str | None = None
    code: str | None = None
    slug: str | None = None
    description: str | None = None
    category_id: str | None = None
    target_level: str | None = None
    output_goal: str | None = None
    discount_price: Decimal | None = Field(default=None, ge=0)
    total_duration_time: int | None = Field(default=None, ge=0)
    total_sessions: int | None = Field(default=None, ge=0)
    price: Decimal | None = Field(default=None, ge=0)
    status: str | None = None


class CourseMediaCreate(BaseModel):
    media_id: str
    media_type: str | None = None
    order_index: int = Field(default=0, ge=0)
    is_primary: bool = False


class CourseMediaUpdate(BaseModel):
    media_type: str | None = None
    order_index: int | None = Field(default=None, ge=0)
    is_primary: bool | None = None

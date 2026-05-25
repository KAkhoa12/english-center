from datetime import datetime
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, Field, field_validator


def _not_blank(value: str) -> str:
    if not value or not value.strip():
        raise ValueError("must not be blank")
    return value.strip()


class AssignmentCreate(BaseModel):
    session_id: str | None = None
    lesson_id: str | None = None
    title: str
    description: str | None = None
    instruction: str | None = None
    assignment_type: str = "homework"
    status: str = "draft"
    max_score: Decimal = Field(default=10, gt=0)
    due_at: datetime | None = None
    allow_late_submission: bool = True

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        return _not_blank(value)


class AssignmentUpdate(BaseModel):
    session_id: str | None = None
    lesson_id: str | None = None
    title: str | None = None
    description: str | None = None
    instruction: str | None = None
    assignment_type: str | None = None
    status: str | None = None
    max_score: Decimal | None = Field(default=None, gt=0)
    due_at: datetime | None = None
    allow_late_submission: bool | None = None


class AssignmentAttachmentCreate(BaseModel):
    title: str | None = None
    description: str | None = None
    attachment_type: str
    file_bucket: str | None = None
    file_object_name: str | None = None
    external_url: str | None = None
    content_type: str | None = None
    file_size: int | None = Field(default=None, ge=0)
    order_index: int = Field(default=0, ge=0)


class AssignmentAttachmentUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    attachment_type: str | None = None
    file_bucket: str | None = None
    file_object_name: str | None = None
    external_url: str | None = None
    content_type: str | None = None
    file_size: int | None = Field(default=None, ge=0)
    order_index: int | None = Field(default=None, ge=0)


class SubmissionAttachmentCreate(BaseModel):
    title: str | None = None
    file_bucket: str
    file_object_name: str
    original_filename: str | None = None
    content_type: str | None = None
    file_size: int | None = Field(default=None, ge=0)


class AssignmentSubmissionCreate(BaseModel):
    content: str | None = None
    status: str = "submitted"
    attachments: list[SubmissionAttachmentCreate] | None = None


class AssignmentSubmissionUpdate(BaseModel):
    content: str | None = None
    status: str | None = None


class AssignmentGradeCreate(BaseModel):
    score: Decimal | None = Field(default=None, ge=0)
    feedback: str | None = None
    rubric: dict[str, Any] | None = None
    grading_method: str = "teacher"


class AssignmentGradeUpdate(BaseModel):
    score: Decimal | None = Field(default=None, ge=0)
    feedback: str | None = None
    rubric: dict[str, Any] | None = None
    grading_method: str | None = None

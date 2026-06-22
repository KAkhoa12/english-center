from datetime import date

from pydantic import BaseModel, Field, field_validator


def _not_blank(value: str) -> str:
    if not value or not value.strip():
        raise ValueError("must not be blank")
    return value.strip()


class ClassCreate(BaseModel):
    course_id: str
    teacher_id: str | None = None
    room_id: str | None = None
    name: str
    code: str | None = None
    class_type: str
    max_students: int = Field(ge=1)
    start_date: date | None = None
    status: str = "planned"

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        return _not_blank(value)


class ClassUpdate(BaseModel):
    teacher_id: str | None = None
    room_id: str | None = None
    name: str | None = None
    code: str | None = None
    class_type: str | None = None
    max_students: int | None = Field(default=None, ge=1)
    start_date: date | None = None
    status: str | None = None

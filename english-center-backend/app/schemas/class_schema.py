from datetime import date

from pydantic import BaseModel, Field, field_validator, model_validator


def _not_blank(value: str) -> str:
    if not value or not value.strip():
        raise ValueError("must not be blank")
    return value.strip()


class ClassCreate(BaseModel):
    course_id: str
    teacher_id: str | None = None
    name: str
    code: str | None = None
    class_type: str
    max_students: int = Field(ge=1)
    start_date: date | None = None
    end_date: date | None = None
    status: str = "planned"

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        return _not_blank(value)

    @model_validator(mode="after")
    def validate_dates(self) -> "ClassCreate":
        if self.start_date and self.end_date and self.start_date > self.end_date:
            raise ValueError("start_date must be less than or equal to end_date")
        return self


class ClassUpdate(BaseModel):
    teacher_id: str | None = None
    name: str | None = None
    code: str | None = None
    class_type: str | None = None
    max_students: int | None = Field(default=None, ge=1)
    start_date: date | None = None
    end_date: date | None = None
    status: str | None = None

    @model_validator(mode="after")
    def validate_dates(self) -> "ClassUpdate":
        if self.start_date and self.end_date and self.start_date > self.end_date:
            raise ValueError("start_date must be less than or equal to end_date")
        return self

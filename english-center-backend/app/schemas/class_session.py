from datetime import date, time

from pydantic import BaseModel, field_validator, model_validator


def _not_blank(value: str) -> str:
    if not value or not value.strip():
        raise ValueError("must not be blank")
    return value.strip()


class ClassSessionCreate(BaseModel):
    teacher_id: str | None = None
    lesson_id: str | None = None
    room_id: str | None = None
    title: str
    description: str | None = None
    session_date: date
    start_time: time
    end_time: time
    mode: str
    meeting_url: str | None = None
    note: str | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        return _not_blank(value)

    @model_validator(mode="after")
    def validate_times(self) -> "ClassSessionCreate":
        if self.end_time <= self.start_time:
            raise ValueError("end_time must be greater than start_time")
        return self


class ClassSessionUpdate(BaseModel):
    teacher_id: str | None = None
    lesson_id: str | None = None
    room_id: str | None = None
    title: str | None = None
    description: str | None = None
    session_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None
    mode: str | None = None
    meeting_url: str | None = None
    status: str | None = None
    note: str | None = None

    @model_validator(mode="after")
    def validate_times(self) -> "ClassSessionUpdate":
        if self.start_time and self.end_time and self.end_time <= self.start_time:
            raise ValueError("end_time must be greater than start_time")
        return self

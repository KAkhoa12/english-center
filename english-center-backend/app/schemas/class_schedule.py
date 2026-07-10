from datetime import time
from typing import Literal

from pydantic import BaseModel, model_validator


ScheduleName = Literal["T2", "T3", "T4", "T5", "T6", "T7", "CN"]


class ClassScheduleCreate(BaseModel):
    schedule_name: ScheduleName
    shift_number: int | None = None
    start_time: time
    end_time: time

    @model_validator(mode="after")
    def validate_time_range(self) -> "ClassScheduleCreate":
        if self.end_time <= self.start_time:
            raise ValueError("end_time must be greater than start_time")
        return self


class ClassScheduleUpdate(BaseModel):
    schedule_name: ScheduleName | None = None
    shift_number: int | None = None
    start_time: time | None = None
    end_time: time | None = None

    @model_validator(mode="after")
    def validate_time_range(self) -> "ClassScheduleUpdate":
        if self.start_time and self.end_time and self.end_time <= self.start_time:
            raise ValueError("end_time must be greater than start_time")
        return self

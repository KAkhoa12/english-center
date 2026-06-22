from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field


class ProfileUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1)
    phone: str | None = None
    date_of_birth: date | None = None
    gender: str | None = None
    address: str | None = None
    level: str | None = None
    learning_goal: str | None = None
    parent_name: str | None = None
    parent_phone: str | None = None
    specialization: str | None = None
    bio: str | None = None
    experience_years: int | None = Field(default=None, ge=0)
    certificates: dict | None = None
    hourly_rate: Decimal | None = Field(default=None, ge=0)

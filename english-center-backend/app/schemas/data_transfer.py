from datetime import date, datetime
from decimal import Decimal
from typing import Any, Literal

from pydantic import BaseModel, EmailStr, Field


class TransferUserData(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    password_hash: str | None = None
    avatar_url: str | None = None
    status: str | None = None
    is_verified: bool | None = None


class TeacherTransferItem(BaseModel):
    user: TransferUserData
    specialization: str | None = None
    bio: str | None = None
    experience_years: int = 0
    certificates: Any | None = None
    hourly_rate: Decimal | None = None


class StudentTransferItem(BaseModel):
    user: TransferUserData
    date_of_birth: date | None = None
    gender: str | None = None
    address: str | None = None
    level: str | None = None
    learning_goal: str | None = None
    parent_name: str | None = None
    parent_phone: str | None = None


class StaffTransferItem(BaseModel):
    user: TransferUserData
    position: str | None = None
    department: str | None = None
    note: str | None = None


class DataExportEnvelope(BaseModel):
    entity: Literal["teachers", "students", "staff"]
    exported_at: datetime
    items: list[dict[str, Any]] = Field(default_factory=list)


class DataImportResult(BaseModel):
    entity: Literal["teachers", "students", "staff"]
    total: int
    created: int
    updated: int
    skipped: int
    errors: list[dict[str, Any]] = Field(default_factory=list)

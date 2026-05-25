from decimal import Decimal

from pydantic import BaseModel

from app.schemas.common import UserAccountCreate
from app.schemas.user import UserRead


class TeacherCreate(UserAccountCreate):
    specialization: str | None = None
    bio: str | None = None
    experience_years: int = 0
    certificates: dict | None = None
    hourly_rate: Decimal | None = None


class TeacherUpdate(BaseModel):
    specialization: str | None = None
    bio: str | None = None
    experience_years: int | None = None
    certificates: dict | None = None
    hourly_rate: Decimal | None = None


class TeacherRead(BaseModel):
    id: str
    user: UserRead
    specialization: str | None = None
    bio: str | None = None
    experience_years: int = 0
    certificates: dict | None = None
    hourly_rate: Decimal | None = None

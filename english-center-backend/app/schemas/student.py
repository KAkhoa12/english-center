from datetime import date

from pydantic import BaseModel

from app.schemas.common import UserAccountCreate
from app.schemas.user import UserRead


class StudentCreate(UserAccountCreate):
    date_of_birth: date | None = None
    gender: str | None = None
    address: str | None = None
    level: str | None = None
    learning_goal: str | None = None
    parent_name: str | None = None
    parent_phone: str | None = None


class StudentUpdate(BaseModel):
    date_of_birth: date | None = None
    gender: str | None = None
    address: str | None = None
    level: str | None = None
    learning_goal: str | None = None
    parent_name: str | None = None
    parent_phone: str | None = None


class StudentRead(BaseModel):
    id: str
    user: UserRead
    date_of_birth: date | None = None
    gender: str | None = None
    address: str | None = None
    level: str | None = None
    learning_goal: str | None = None
    parent_name: str | None = None
    parent_phone: str | None = None

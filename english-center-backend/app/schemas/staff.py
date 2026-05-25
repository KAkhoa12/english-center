from pydantic import BaseModel

from app.schemas.common import UserAccountCreate
from app.schemas.user import UserRead


class StaffCreate(UserAccountCreate):
    position: str | None = None
    department: str | None = None
    note: str | None = None


class StaffUpdate(BaseModel):
    position: str | None = None
    department: str | None = None
    note: str | None = None


class StaffRead(BaseModel):
    id: str
    user: UserRead
    position: str | None = None
    department: str | None = None
    note: str | None = None

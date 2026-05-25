from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    password: str
    avatar_url: str | None = None
    status: str = "active"
    role_ids: list[str] | None = None


class UserUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    status: str | None = None
    is_verified: bool | None = None


class UserRead(BaseModel):
    id: str
    full_name: str
    email: str
    phone: str | None
    avatar_url: str | None
    status: str
    is_verified: bool


class AssignRolesRequest(BaseModel):
    role_ids: list[str]

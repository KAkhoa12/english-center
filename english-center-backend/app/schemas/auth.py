from datetime import date
from typing import Literal

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterStudentRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    password: str
    avatar_url: str | None = None
    date_of_birth: date | None = None
    gender: str | None = None
    address: str | None = None
    level: Literal["beginner", "elementary", "intermediate", "upper_intermediate", "advanced"] | None = None
    learning_goal: str | None = None
    parent_name: str | None = None
    parent_phone: str | None = None


class AuthUser(BaseModel):
    id: str
    full_name: str
    email: EmailStr


class LoginPayload(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: AuthUser
    roles: list[str]
    permissions: list[str]


class RefreshTokenRequest(BaseModel):
    refresh_token: str

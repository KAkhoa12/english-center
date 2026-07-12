from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterStudentRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str


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

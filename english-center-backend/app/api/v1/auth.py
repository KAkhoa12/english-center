from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.auth import require_jwt
from app.schemas.auth import AuthUser, ForgotPasswordRequest, LoginRequest, RefreshTokenRequest, RegisterStudentRequest, ResetPasswordRequest
from app.services.auth_service import AuthService
from app.services.rbac_service import RBACService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(payload: LoginRequest, db: Annotated[Session, Depends(get_db)]):
    data = AuthService(db).login(payload)
    return api_response(True, "Login successfully", data.model_dump(), None)


@router.post("/register")
def register(payload: RegisterStudentRequest, db: Annotated[Session, Depends(get_db)]):
    data = AuthService(db).register_student(payload)
    return api_response(True, "Student registered successfully", data, None)


@router.post("/refresh")
def refresh(payload: RefreshTokenRequest, db: Annotated[Session, Depends(get_db)]):
    data = AuthService(db).refresh_token(payload.refresh_token)
    return api_response(True, "Token refreshed successfully", data, None)


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Annotated[Session, Depends(get_db)]):
    data = AuthService(db).forgot_password(payload)
    return api_response(True, "Reset link sent if email exists", data, None)


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Annotated[Session, Depends(get_db)]):
    data = AuthService(db).reset_password(payload)
    return api_response(True, "Password reset successfully", data, None)


@router.get("/me")
def me(db: Annotated[Session, Depends(get_db)], current_user = Depends(require_jwt)):
    rbac = RBACService(db)
    payload = {
        "user": AuthUser(id=str(current_user.id), full_name=current_user.full_name, email=current_user.email).model_dump(),
        "roles": rbac.get_user_roles(str(current_user.id)),
        "permissions": rbac.get_user_permissions(str(current_user.id)),
    }
    return api_response(True, "Current user retrieved successfully", payload, None)

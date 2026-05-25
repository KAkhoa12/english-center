from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.api.deps import get_auth_service
from app.schemas.auth import LoginRequest, Token
from app.schemas.common import APIResponse
from app.schemas.user import UserCreate, UserRead
from app.services.auth_service import AuthService
from app.use_cases.auth.login_user import LoginUserUseCase
from app.use_cases.auth.register_user import RegisterUserUseCase

router = APIRouter()


@router.post("/register", response_model=APIResponse[UserRead], status_code=status.HTTP_201_CREATED)
def register(
    payload: UserCreate,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> APIResponse[UserRead]:
    user = RegisterUserUseCase(auth_service).execute(payload)
    return APIResponse(success=True, message="Register success", payload=UserRead.model_validate(user))


@router.post("/login", response_model=APIResponse[Token])
def login(
    payload: LoginRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> APIResponse[Token]:
    token = LoginUserUseCase(auth_service).execute(payload)
    return APIResponse(success=True, message="Login success", payload=token)

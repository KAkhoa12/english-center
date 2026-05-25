from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user, get_user_service
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.user import UserRead, UserUpdate
from app.services.user_service import UserService
from app.use_cases.users.get_user import GetUserUseCase
from app.use_cases.users.update_user import UpdateUserUseCase

router = APIRouter()


@router.get("/me", response_model=APIResponse[UserRead])
def get_me(current_user: Annotated[User, Depends(get_current_user)]) -> APIResponse[UserRead]:
    return APIResponse(message="User profile", data=UserRead.model_validate(current_user))


@router.put("/me", response_model=APIResponse[UserRead])
def update_me(
    payload: UserUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    user_service: Annotated[UserService, Depends(get_user_service)],
) -> APIResponse[UserRead]:
    updated = UpdateUserUseCase(user_service).execute(current_user.id, payload)
    return APIResponse(message="User updated", data=UserRead.model_validate(updated))


@router.get("/{user_id}", response_model=APIResponse[UserRead])
def get_user(
    user_id: int,
    user_service: Annotated[UserService, Depends(get_user_service)],
) -> APIResponse[UserRead]:
    user = GetUserUseCase(user_service).execute(user_id)
    return APIResponse(message="User detail", data=UserRead.model_validate(user))

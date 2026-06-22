from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.auth import require_jwt
from app.models.rbac.user import User
from app.schemas.profile import ProfileUpdate
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("/me")
def get_my_profile(
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_jwt),
):
    return api_response(True, "Profile retrieved successfully", ProfileService(db).get_my_profile(current_user), None)


@router.patch("/me")
def update_my_profile(
    payload: ProfileUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_jwt),
):
    return api_response(True, "Profile updated successfully", ProfileService(db).update_my_profile(current_user, payload), None)


@router.patch("/me/avatar")
def update_my_avatar(
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_jwt),
    file: UploadFile = File(...),
):
    return api_response(True, "Profile avatar updated successfully", ProfileService(db).update_my_avatar(current_user, file), None)

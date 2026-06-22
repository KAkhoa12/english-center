from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.auth import get_current_active_user
from app.models.rbac.user import User
from app.schemas.common import PaginationParams
from app.schemas.guest_enrollment import GuestEnrollmentCreate, GuestEnrollmentUpdate
from app.services.guest_enrollment_service import GuestEnrollmentService
from app.services.rbac_service import RBACService

router = APIRouter(prefix="/guest-enrollments", tags=["guest-enrollments"])


def require_admin(db: Session, current_user: User) -> None:
    roles = RBACService(db).get_user_roles(str(current_user.id))
    if "admin" not in roles:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied")


@router.post("")
def create_guest_enrollment(
    payload: GuestEnrollmentCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    require_admin(db, current_user)
    service = GuestEnrollmentService(db)
    item = service.create_guest_enrollment_from_payload(payload)
    return api_response(True, "Guest enrollment created successfully", service.guest_enrollment_dict(item), None)


@router.get("")
def list_guest_enrollments(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_active_user)],
    page: int = Query(1),
    page_size: int = Query(10),
    search: str | None = None,
    sort_by: str | None = None,
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
):
    require_admin(db, current_user)
    query = PaginationParams(page=page, page_size=page_size, search=search, sort_by=sort_by, sort_order=sort_order)
    service = GuestEnrollmentService(db)
    items, total = service.get_guest_enrollments(query)
    return api_response(
        True,
        "Guest enrollments retrieved successfully",
        [service.guest_enrollment_dict(item) for item in items],
        build_pagination(page, page_size, total),
    )


@router.get("/{guest_enrollment_id}")
def get_guest_enrollment(
    guest_enrollment_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    require_admin(db, current_user)
    service = GuestEnrollmentService(db)
    item = service.get_guest_enrollment_by_id(guest_enrollment_id)
    return api_response(True, "Guest enrollment retrieved successfully", service.guest_enrollment_dict(item), None)


@router.patch("/{guest_enrollment_id}")
def update_guest_enrollment(
    guest_enrollment_id: str,
    payload: GuestEnrollmentUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    require_admin(db, current_user)
    service = GuestEnrollmentService(db)
    item = service.update_guest_enrollment(guest_enrollment_id, payload)
    return api_response(True, "Guest enrollment updated successfully", service.guest_enrollment_dict(item), None)


@router.delete("/{guest_enrollment_id}")
def delete_guest_enrollment(
    guest_enrollment_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    require_admin(db, current_user)
    GuestEnrollmentService(db).delete_guest_enrollment(guest_enrollment_id)
    return api_response(True, "Guest enrollment deleted successfully", None, None)

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.auth import require_jwt
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.common import PaginationParams
from app.services.commerce_service import EnrollmentService

router = APIRouter(prefix="/enrollments", tags=["enrollments"])


@router.get("/my")
def my_enrollments(db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_jwt), page: int = Query(1), page_size: int = Query(10)):
    query = PaginationParams(page=page, page_size=page_size)
    service = EnrollmentService(db)
    items, total = service.get_my_enrollments(query, current_user)
    return api_response(True, "My enrollments retrieved successfully", [service.enrollment_dict(item) for item in items], build_pagination(page, page_size, total))


@router.get("")
def list_enrollments(db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("order.read")), page: int = Query(1), page_size: int = Query(10)):
    query = PaginationParams(page=page, page_size=page_size)
    service = EnrollmentService(db)
    items, total = service.get_enrollments(query, current_user)
    return api_response(True, "Enrollments retrieved successfully", [service.enrollment_dict(item) for item in items], build_pagination(page, page_size, total))

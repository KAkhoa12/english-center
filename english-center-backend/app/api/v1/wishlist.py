from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.commerce import WishlistCreate
from app.schemas.common import PaginationParams
from app.services.commerce_service import WishlistService

router = APIRouter(tags=["wishlist"])


@router.get("/wishlist")
def get_wishlist(
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("wishlist.read")),
    page: int = Query(1),
    page_size: int = Query(10),
):
    query = PaginationParams(page=page, page_size=page_size)
    items, total = WishlistService(db).get_wishlist(str(current_user.id), query)
    return api_response(True, "Wishlist retrieved successfully", items, build_pagination(page, page_size, total))


@router.post("/wishlist")
def add_wishlist(payload: WishlistCreate, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("wishlist.create"))):
    item = WishlistService(db).add_to_wishlist(str(current_user.id), payload.course_id)
    return api_response(True, "Course added to wishlist successfully", {"id": str(item.id), "course_id": str(item.course_id)}, None)


@router.delete("/wishlist/{course_id}")
def remove_wishlist(course_id: str, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("wishlist.delete"))):
    WishlistService(db).remove_from_wishlist(str(current_user.id), course_id)
    return api_response(True, "Course removed from wishlist successfully", None, None)


@router.get("/courses/{course_id}/wishlist-status")
def wishlist_status(course_id: str, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("wishlist.read"))):
    return api_response(True, "Wishlist status retrieved successfully", {"is_favorited": WishlistService(db).is_favorited(str(current_user.id), course_id)}, None)

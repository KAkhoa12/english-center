from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.user import User
from app.schemas.commerce import AddCartItemRequest, UpdateCartItemRequest
from app.services.commerce_service import CartService

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("")
def get_cart(db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("cart.read"))):
    service = CartService(db)
    cart = service.get_or_create_active_cart(str(current_user.id))
    return api_response(True, "Cart retrieved successfully", service.cart_dict(cart), None)


@router.post("/items")
def add_cart_item(payload: AddCartItemRequest, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("cart.create"))):
    service = CartService(db)
    cart = service.add_course_to_cart(str(current_user.id), payload.course_id)
    return api_response(True, "Course added to cart successfully", service.cart_dict(cart), None)


@router.patch("/items/{cart_item_id}")
def update_cart_item(cart_item_id: str, payload: UpdateCartItemRequest, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("cart.update"))):
    service = CartService(db)
    cart = service.update_cart_item(str(current_user.id), cart_item_id, payload.quantity)
    return api_response(True, "Cart item updated successfully", service.cart_dict(cart), None)


@router.delete("/items/{cart_item_id}")
def delete_cart_item(cart_item_id: str, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("cart.delete"))):
    service = CartService(db)
    cart = service.remove_cart_item(str(current_user.id), cart_item_id)
    return api_response(True, "Cart item removed successfully", service.cart_dict(cart), None)


@router.delete("/clear")
def clear_cart(db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("cart.delete"))):
    service = CartService(db)
    cart = service.clear_cart(str(current_user.id))
    return api_response(True, "Cart cleared successfully", service.cart_dict(cart), None)

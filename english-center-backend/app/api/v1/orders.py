from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.response import api_response, build_pagination
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.commerce import CheckoutRequest, ConvertConsultationRequest, StaffCreateOrderRequest
from app.schemas.common import PaginationParams
from app.services.commerce_service import OrderSerializer, OrderService

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/checkout")
def checkout(payload: CheckoutRequest, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("order.create"))):
    order = OrderService(db).checkout_from_cart(current_user, payload)
    return api_response(True, "Order created successfully", OrderSerializer(db).order_detail(order), None)


@router.get("")
def list_orders(
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("order.read")),
    page: int = Query(1),
    page_size: int = Query(10),
    status: str | None = None,
    user_id: str | None = None,
):
    query = PaginationParams(page=page, page_size=page_size)
    items, total = OrderService(db).get_orders(query, current_user, status, user_id)
    return api_response(True, "Orders retrieved successfully", [OrderSerializer(db).order_detail(item) for item in items], build_pagination(page, page_size, total))


@router.get("/my")
def my_orders(db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("order.read")), page: int = Query(1), page_size: int = Query(10)):
    query = PaginationParams(page=page, page_size=page_size)
    items, total = OrderService(db).get_orders(query, current_user)
    return api_response(True, "My orders retrieved successfully", [OrderSerializer(db).order_detail(item) for item in items], build_pagination(page, page_size, total))


@router.get("/{order_id}")
def get_order(order_id: str, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("order.read"))):
    service = OrderService(db)
    order = service.get_order(order_id)
    service.assert_order_access(order, current_user)
    return api_response(True, "Order retrieved successfully", OrderSerializer(db).order_detail(order), None)


@router.get("/by-invoice/{invoice_number}")
def get_order_by_invoice(invoice_number: str, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("order.read"))):
    service = OrderService(db)
    order = service.get_order_by_invoice_number(invoice_number)
    if not order:
        return api_response(False, "Order not found", None, None)
    service.assert_order_access(order, current_user)
    return api_response(True, "Order payment status retrieved successfully", OrderSerializer(db).order_detail(order), None)


@router.get("/{order_id}/payment-status")
def get_order_payment_status(order_id: str, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("order.read"))):
    service = OrderService(db)
    order = service.get_order(order_id)
    service.assert_order_access(order, current_user)
    return api_response(True, "Order payment status retrieved successfully", OrderSerializer(db).order_detail(order), None)


@router.patch("/{order_id}/cancel")
def cancel_order(order_id: str, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("order.update"))):
    order = OrderService(db).cancel_order(order_id, current_user)
    return api_response(True, "Order cancelled successfully", OrderSerializer(db).order_detail(order), None)


@router.post("/consultations/{consultation_id}/convert")
def convert_consultation(
    consultation_id: str,
    payload: ConvertConsultationRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("order.create")),
):
    order = OrderService(db).convert_consultation(consultation_id, payload, current_user)
    return api_response(True, "Consultation converted to order", OrderSerializer(db).order_detail(order), None)


@router.post("/create-for-student")
def create_order_for_student(payload: StaffCreateOrderRequest, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("order.create"))):
    order = OrderService(db).create_order_for_student(payload, current_user)
    return api_response(True, "Order created successfully", OrderSerializer(db).order_detail(order), None)

from typing import Annotated

from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.commerce import CreateSePayPaymentRequest
from app.services.commerce_service import OrderSerializer, OrderService, PaymentService

router = APIRouter(tags=["payments"])


@router.post("/payments/sepay/create")
async def create_sepay_payment(payload: CreateSePayPaymentRequest, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("payment.create"))):
    service = PaymentService(db)
    payment = await service.create_sepay_payment(payload.order_id, payload.payment_method, current_user)
    order = OrderService(db).get_order(str(payment.order_id))
    data = OrderSerializer(db).payment_dict(payment)
    data["invoice_number"] = order.invoice_number
    data["checkout_form_fields"] = (payment.raw_response or {}).get("checkout_form_fields") or payment.raw_request
    return api_response(True, "SePay payment created successfully", data, None)


@router.get("/payments/{payment_id}")
def get_payment(payment_id: str, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("payment.read"))):
    payment = PaymentService(db).get_payment(payment_id, current_user)
    return api_response(True, "Payment retrieved successfully", OrderSerializer(db).payment_dict(payment), None)


@router.get("/orders/{order_id}/payments")
def get_order_payments(order_id: str, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("payment.read"))):
    items = PaymentService(db).get_order_payments(order_id, current_user)
    return api_response(True, "Order payments retrieved successfully", [OrderSerializer(db).payment_dict(item) for item in items], None)


@router.post("/payments/sepay/ipn")
async def sepay_ipn(request: Request, db: Annotated[Session, Depends(get_db)]):
    payload = await request.json()
    success, status_code = PaymentService(db).handle_sepay_ipn(payload, dict(request.headers))
    return JSONResponse(status_code=status_code, content={"success": success})

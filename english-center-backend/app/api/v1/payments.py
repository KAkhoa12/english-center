import json
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.commerce import CreateSePayPaymentRequest, MarkOrderPaidRequest
from app.services.commerce_service import OrderSerializer, OrderService, PaymentService, mark_order_paid_for_testing

router = APIRouter(tags=["payments"])


async def _read_json_body(request: Request) -> dict:
    raw_body = await request.body()
    if not raw_body:
        return {}

    try:
        decoded = raw_body.decode("utf-8")
        return json.loads(decoded) if decoded.strip() else {}
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="Webhook body must be valid JSON") from exc


@router.post("/payments/sepay/create")
async def create_sepay_payment(payload: CreateSePayPaymentRequest, db: Annotated[Session, Depends(get_db)], current_user: User = Depends(require_permission("payment.create"))):
    service = PaymentService(db)
    payment = await service.create_sepay_payment(payload.order_id, payload.payment_method, current_user)
    data = OrderSerializer(db).payment_dict(payment)
    invoice = OrderSerializer(db).invoice(str(payment.order_id))
    data["invoice_number"] = invoice.invoice_number if invoice else None
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
    payload = await _read_json_body(request)
    success, status_code = PaymentService(db).handle_sepay_ipn(payload, dict(request.headers))
    return JSONResponse(status_code=status_code, content={"success": success})


@router.post("/orders/{order_id}/payments/mark-paid")
def mark_order_paid(
    order_id: str,
    payload: MarkOrderPaidRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("payment.update")),
):
    order = mark_order_paid_for_testing(db, order_id, current_user, payload.payment_method, payload.reference)
    return api_response(True, "Order marked as paid successfully", OrderSerializer(db).order_detail(order), None)


@router.post("/payment/webhook/sepay")
async def payment_webhook_sepay(
    request: Request
):
    raw_body = await request.body()
    print(raw_body.decode("utf-8", errors="replace"))

    return {
        "success": True
    }

import json
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.response import api_response
from app.db.session import get_db
from app.dependencies.permissions import require_permission
from app.models.rbac.user import User
from app.schemas.commerce import CreatePaymentPlanRequest, CreateSePayPaymentRequest, MarkOrderPaidRequest, RecordInstallmentPaymentRequest
from app.services.commerce_service import OrderSerializer, OrderService, PaymentPlanService, PaymentService, mark_order_paid_for_testing

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
    print(raw_body.decode("utf-8", errors="replace" ))

    return {
        "success": True,
        "raw_body": raw_body.decode("utf-8", errors="replace"),
    }


@router.post("/orders/{order_id}/payment-plans")
def create_payment_plan(
    order_id: str,
    payload: CreatePaymentPlanRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("payment.create")),
):
    plan = PaymentPlanService(db).create_plan(order_id, payload, current_user)
    return api_response(True, "Payment plan created", PaymentPlanService(db)._plan_dict(plan), None)


@router.get("/orders/{order_id}/payment-plans")
def get_order_payment_plan(
    order_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("payment.read")),
):
    plan = PaymentPlanService(db).get_plan_by_order(order_id, current_user)
    return api_response(True, "Payment plan retrieved", plan, None)


@router.get("/payment-plans/{plan_id}/installments")
def list_installments(
    plan_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("payment.read")),
):
    items = PaymentPlanService(db).get_installments(plan_id, current_user)
    return api_response(True, "Installments retrieved", items, None)


@router.post("/installments/{installment_id}/pay")
def record_installment_payment(
    installment_id: str,
    payload: RecordInstallmentPaymentRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("payment.update")),
):
    inst = PaymentPlanService(db).record_payment(
        installment_id, payload.amount, payload.payment_method,
        current_user, payload.reference, payload.note,
    )
    return api_response(True, "Payment recorded", PaymentPlanService._installment_dict(inst), None)


@router.get("/payment-plans")
def list_payment_plans(
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("payment.read")),
    status: str | None = None,
):
    plans = PaymentPlanService(db).list_plans(status=status)
    return api_response(True, "Payment plans retrieved", plans, None)


@router.get("/payment-plans/my")
def my_payment_plans(
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("payment.read")),
):
    plans = PaymentPlanService(db).list_my_plans(current_user)
    return api_response(True, "My payment plans retrieved", plans, None)


@router.get("/payment-plans/{plan_id}")
def get_payment_plan(
    plan_id: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: User = Depends(require_permission("payment.read")),
):
    plan = PaymentPlanService(db).get_plan_detail(plan_id, current_user)
    return api_response(True, "Payment plan retrieved", plan, None)

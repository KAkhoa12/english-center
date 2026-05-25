import base64
import json
from decimal import Decimal
from typing import Any

import httpx
from fastapi import HTTPException, status

from app.core.config import settings


class SePayService:
    def get_auth_header(self) -> dict[str, str]:
        raw = f"{settings.SEPAY_MERCHANT_ID}:{settings.SEPAY_SECRET_KEY}".encode("utf-8")
        token = base64.b64encode(raw).decode("utf-8")
        return {"Authorization": f"Basic {token}", "Content-Type": "application/json"}

    async def create_checkout_payment(self, order: Any, payment_method: str) -> dict[str, Any]:
        form_fields = {
            "operation": "PURCHASE",
            "payment_method": payment_method,
            "order_invoice_number": order.invoice_number,
            "order_amount": str(order.total_amount),
            "currency": order.currency,
            "order_description": f"Thanh toán khóa học {order.order_code}",
            "customer_id": str(order.user_id),
            "success_url": settings.SEPAY_SUCCESS_URL,
            "error_url": settings.SEPAY_ERROR_URL,
            "cancel_url": settings.SEPAY_CANCEL_URL,
            "custom_data": json.dumps({"order_id": str(order.id), "user_id": str(order.user_id)}),
        }
        # SePay docs for Python do not publish an official SDK. This keeps the gateway boundary isolated.
        return {
            "checkout_url": settings.SEPAY_CHECKOUT_URL,
            "checkout_form_fields": form_fields,
            "raw_response": {"mode": "checkout_form", "base_url": settings.SEPAY_BASE_URL},
        }

    async def post_json(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        async with httpx.AsyncClient(base_url=settings.SEPAY_BASE_URL, timeout=20) as client:
            response = await client.post(path, json=payload, headers=self.get_auth_header())
            if response.status_code >= 400:
                raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="SePay API request failed")
            return response.json()

    def verify_ipn_secret(self, headers: dict[str, str]) -> bool:
        expected = settings.SEPAY_IPN_SECRET_KEY
        if not expected:
            return True
        return headers.get("x-secret-key") == expected or headers.get("X-Secret-Key") == expected

    def parse_ipn_payload(self, payload: dict[str, Any]) -> dict[str, Any]:
        order = payload.get("order") or {}
        transaction = payload.get("transaction") or {}
        return {
            "notification_type": payload.get("notification_type"),
            "invoice_number": order.get("order_invoice_number"),
            "sepay_order_id": order.get("id"),
            "sepay_transaction_id": transaction.get("transaction_id") or transaction.get("id"),
            "transaction_status": transaction.get("transaction_status"),
            "amount": Decimal(str(transaction.get("transaction_amount") or order.get("order_amount") or "0")),
            "currency": transaction.get("transaction_currency") or order.get("order_currency"),
            "payment_method": transaction.get("payment_method"),
        }

    def is_paid_ipn(self, payload: dict[str, Any]) -> bool:
        parsed = self.parse_ipn_payload(payload)
        return parsed["notification_type"] == "ORDER_PAID" and parsed["transaction_status"] == "APPROVED"

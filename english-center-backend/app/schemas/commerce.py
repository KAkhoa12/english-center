from datetime import datetime

from pydantic import BaseModel, Field


class AddCartItemRequest(BaseModel):
    course_id: str
    class_id: str | None = None


class UpdateCartItemRequest(BaseModel):
    quantity: int = Field(default=1, ge=1, le=1)


class WishlistCreate(BaseModel):
    course_id: str


class CheckoutRequest(BaseModel):
    note: str | None = None
    buyer_name: str | None = None
    buyer_email: str | None = None
    buyer_phone: str | None = None
    billing_address: str | None = None


class CreateSePayPaymentRequest(BaseModel):
    order_id: str
    payment_method: str = "BANK_TRANSFER"


class MarkOrderPaidRequest(BaseModel):
    payment_method: str = "MANUAL_BANK_TRANSFER"
    reference: str | None = None


class InstallmentInput(BaseModel):
    installment_number: int
    name: str
    amount: float
    due_date: datetime | None = None
    grace_period_days: int | None = None


class CreatePaymentPlanRequest(BaseModel):
    plan_type: str  # full | deposit_then_full | installment
    deposit_amount: float | None = None
    installments: list[InstallmentInput] = []
    installment_count: int | None = None
    grace_period_days: int | None = None


class RecordInstallmentPaymentRequest(BaseModel):
    amount: float
    payment_method: str = "CASH"
    reference: str | None = None
    note: str | None = None


class ConvertConsultationRequest(BaseModel):
    student_id: str
    note: str | None = None
    plan_type: str | None = None  # full | deposit_then_full | installment
    deposit_amount: float | None = None
    installments: list[InstallmentInput] = []


class StaffCreateOrderRequest(BaseModel):
    student_id: str
    course_id: str
    class_id: str
    note: str | None = None
    plan_type: str | None = None
    deposit_amount: float | None = None
    installments: list[InstallmentInput] = []
    installment_count: int | None = None
    grace_period_days: int | None = None

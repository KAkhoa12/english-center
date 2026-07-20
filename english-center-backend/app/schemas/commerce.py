from pydantic import BaseModel, Field


class WishlistCreate(BaseModel):
    course_id: str


class CreateSePayPaymentRequest(BaseModel):
    order_id: str
    payment_method: str = "BANK_TRANSFER"
    payment_type: str = "full"


class RecordCashPaymentRequest(BaseModel):
    amount: float
    payment_type: str = "full"
    reference: str | None = None
    note: str | None = None


class MarkOrderPaidRequest(BaseModel):
    payment_method: str = "MANUAL_BANK_TRANSFER"
    reference: str | None = None


class ConvertConsultationRequest(BaseModel):
    student_id: str
    note: str | None = None


class StaffCreateOrderRequest(BaseModel):
    student_id: str
    course_id: str
    class_id: str
    note: str | None = None

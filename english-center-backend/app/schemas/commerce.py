from pydantic import BaseModel, Field


class AddCartItemRequest(BaseModel):
    course_id: str


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

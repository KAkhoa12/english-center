import enum
from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class CartStatus(str, enum.Enum):
    active = "active"
    checked_out = "checked_out"
    abandoned = "abandoned"


class OrderStatus(str, enum.Enum):
    pending = "pending"
    awaiting_payment = "awaiting_payment"
    paid = "paid"
    failed = "failed"
    cancelled = "cancelled"
    expired = "expired"
    refunded = "refunded"


class OrderPaymentMethod(str, enum.Enum):
    sepay_bank_transfer = "sepay_bank_transfer"
    sepay_card = "sepay_card"
    sepay_napas_bank_transfer = "sepay_napas_bank_transfer"
    manual_cash = "manual_cash"
    manual_bank_transfer = "manual_bank_transfer"


class InvoiceStatus(str, enum.Enum):
    draft = "draft"
    issued = "issued"
    paid = "paid"
    overdue = "overdue"
    cancelled = "cancelled"


class PaymentProvider(str, enum.Enum):
    sepay = "sepay"
    momo = "momo"
    vnpay = "vnpay"
    cash = "cash"
    other = "other"
    manual = "cash"


class PaymentMethod(str, enum.Enum):
    bank_transfer = "bank_transfer"
    cash = "cash"
    payment_gateway = "payment_gateway"
    BANK_TRANSFER = "bank_transfer"
    CASH = "cash"
    PAYMENT_GATEWAY = "payment_gateway"
    MANUAL_BANK_TRANSFER = "bank_transfer"
    MANUAL_CASH = "cash"
    CARD = "payment_gateway"
    NAPAS_BANK_TRANSFER = "payment_gateway"


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    success = "success"
    approved = "success"
    failed = "failed"
    cancelled = "cancelled"
    refunded = "refunded"


class EnrollmentStatus(str, enum.Enum):
    pending_payment = "pending_payment"
    active = "active"
    payment_overdue = "payment_overdue"
    suspended = "suspended"
    completed = "completed"
    cancelled = "cancelled"
    refunded = "refunded"


class Cart(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "carts"

    user_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    status: Mapped[CartStatus] = mapped_column(Enum(CartStatus, name="cart_status"), default=CartStatus.active, nullable=False)


class CartItem(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "cart_items"
    __table_args__ = (UniqueConstraint("cart_id", "course_id", name="uq_cart_items_cart_course"),)

    cart_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("carts.id"), nullable=False, index=True)
    course_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False, index=True)
    course_name: Mapped[str] = mapped_column(String(255), nullable=False)
    course_code: Mapped[str | None] = mapped_column(String(100), nullable=True)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=0)


class CourseWishlist(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "course_wishlists"
    __table_args__ = (UniqueConstraint("user_id", "course_id", name="uq_course_wishlists_user_course"),)

    user_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    course_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False, index=True)


class Order(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "orders"

    user_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    student_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=True)
    cart_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("carts.id"), nullable=True)
    order_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    order_type: Mapped[str] = mapped_column(String(20), nullable=False, default="center", index=True)
    consultation_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("consultations.id"), nullable=True, index=True)
    confirmed_by: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[OrderStatus] = mapped_column(Enum(OrderStatus, name="order_status"), default=OrderStatus.pending, nullable=False, index=True)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="VND")
    subtotal_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    discount_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    total_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    expired_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class OrderItem(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "order_items"

    order_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    course_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    class_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=True, index=True)
    student_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=True, index=True)
    course_name: Mapped[str] = mapped_column(String(255), nullable=False)
    course_code: Mapped[str | None] = mapped_column(String(100), nullable=True)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    discount_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    final_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)


class Invoice(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "invoices"

    order_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    invoice_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    installment_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("payment_installments.id"), nullable=True, index=True)
    due_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    invoice_status: Mapped[InvoiceStatus] = mapped_column(Enum(InvoiceStatus, name="invoice_status"), default=InvoiceStatus.draft, nullable=False)
    issued_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    buyer_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    buyer_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    buyer_phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    billing_address: Mapped[str | None] = mapped_column(Text, nullable=True)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="VND")
    total_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    invoice_metadata: Mapped[dict | None] = mapped_column(JSONB, nullable=True)


class InvoiceItem(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "invoice_items"

    invoice_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("invoices.id"), nullable=False)
    course_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=True)
    class_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=True, index=True)
    item_name: Mapped[str] = mapped_column(String(255), nullable=False)
    item_code: Mapped[str | None] = mapped_column(String(100), nullable=True)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    total_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)


class Payment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "payments"

    order_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False, index=True)
    invoice_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("invoices.id"), nullable=True)
    installment_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("payment_installments.id"), nullable=True, index=True)
    user_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    provider: Mapped[PaymentProvider] = mapped_column(Enum(PaymentProvider, name="payment_provider"), nullable=False)
    payment_method: Mapped[PaymentMethod] = mapped_column(Enum(PaymentMethod, name="payment_method"), nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus, name="payment_status"), default=PaymentStatus.pending, nullable=False, index=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="VND")
    external_order_id: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    external_transaction_id: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    provider_payment_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    provider_transaction_id: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    checkout_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    failed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    collected_by: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    raw_request: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    raw_response: Mapped[dict | None] = mapped_column(JSONB, nullable=True)


class PaymentWebhookLog(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "payment_webhook_logs"

    order_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=True)
    payment_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("payments.id"), nullable=True)
    provider: Mapped[PaymentProvider] = mapped_column(Enum(PaymentProvider, name="payment_provider"), nullable=False, index=True)
    external_order_id: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    external_transaction_id: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    event_type: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    payload: Mapped[dict] = mapped_column(JSONB, nullable=False)
    headers: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    is_valid: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)


SePayIPNLog = PaymentWebhookLog


class CourseEnrollment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "course_enrollments"
    __table_args__ = ()

    enrollment_type: Mapped[str] = mapped_column(String(20), nullable=False, default="center", index=True)
    student_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=True)
    course_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False, index=True)
    order_item_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("order_items.id"), nullable=True)
    enrollment_status: Mapped[EnrollmentStatus] = mapped_column(
        Enum(EnrollmentStatus, name="enrollment_status"),
        default=EnrollmentStatus.active,
        nullable=False,
    )
    access_started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    access_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    enrolled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class PaymentPlanType(str, enum.Enum):
    full = "full"
    deposit_then_full = "deposit_then_full"
    installment = "installment"


class PaymentPlanStatus(str, enum.Enum):
    active = "active"
    completed = "completed"
    cancelled = "cancelled"


class PaymentInstallmentStatus(str, enum.Enum):
    pending = "pending"
    partially_paid = "partially_paid"
    paid = "paid"
    overdue = "overdue"
    waived = "waived"
    cancelled = "cancelled"


class PaymentReminderType(str, enum.Enum):
    before_due = "before_due"
    due_today = "due_today"
    overdue = "overdue"
    final_warning = "final_warning"


class PaymentReminderChannel(str, enum.Enum):
    in_app = "in_app"
    email = "email"
    sms = "sms"


class PaymentPlan(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "payment_plans"

    order_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False, index=True)
    plan_type: Mapped[PaymentPlanType] = mapped_column(Enum(PaymentPlanType, name="payment_plan_type"), nullable=False, index=True)
    total_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    deposit_amount: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    installment_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    grace_period_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[PaymentPlanStatus] = mapped_column(Enum(PaymentPlanStatus, name="payment_plan_status"), nullable=False, default=PaymentPlanStatus.active)
    created_by: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    approved_by: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)


class PaymentInstallment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "payment_installments"

    payment_plan_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("payment_plans.id"), nullable=False, index=True)
    installment_number: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    grace_period_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[PaymentInstallmentStatus] = mapped_column(Enum(PaymentInstallmentStatus, name="payment_installment_status"), nullable=False, default=PaymentInstallmentStatus.pending, index=True)
    paid_amount: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class PaymentReminder(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "payment_reminders"

    installment_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("payment_installments.id"), nullable=False, index=True)
    reminder_type: Mapped[PaymentReminderType] = mapped_column(Enum(PaymentReminderType, name="payment_reminder_type"), nullable=False, index=True)
    channel: Mapped[PaymentReminderChannel] = mapped_column(Enum(PaymentReminderChannel, name="payment_reminder_channel"), nullable=False, index=True)
    recipient_user_id: Mapped[str | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="pending", index=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)


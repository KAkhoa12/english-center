from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.payment_plan import PaymentInstallment, PaymentPlan, PaymentReminder
from app.repositories.base import BaseRepository


class PaymentPlanRepository(BaseRepository[PaymentPlan]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, PaymentPlan)

    def get_by_order(self, order_id: str) -> PaymentPlan | None:
        return self.db.execute(
            select(PaymentPlan).where(
                PaymentPlan.order_id == order_id,
                PaymentPlan.deleted_at.is_(None),
            )
        ).scalar_one_or_none()

    def list_all(self, status: str | None = None) -> list[PaymentPlan]:
        q = select(PaymentPlan).where(PaymentPlan.deleted_at.is_(None))
        if status:
            q = q.where(PaymentPlan.status == status)
        return list(self.db.execute(q.order_by(PaymentPlan.created_at.desc())).scalars().all())


class PaymentInstallmentRepository(BaseRepository[PaymentInstallment]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, PaymentInstallment)

    def list_by_plan(self, payment_plan_id: str) -> list[PaymentInstallment]:
        return list(
            self.db.execute(
                select(PaymentInstallment)
                .where(
                    PaymentInstallment.payment_plan_id == payment_plan_id,
                    PaymentInstallment.deleted_at.is_(None),
                )
                .order_by(PaymentInstallment.installment_number.asc())
            ).scalars().all()
        )


    def list_all(self, status: str | None = None) -> list[PaymentPlan]:
        q = select(PaymentPlan).where(PaymentPlan.deleted_at.is_(None))
        if status:
            q = q.where(PaymentPlan.status == status)
        return list(self.db.execute(q.order_by(PaymentPlan.created_at.desc())).scalars().all())

    def list_by_order_ids(self, order_ids: list[str]) -> list[PaymentPlan]:
        if not order_ids:
            return []
        return list(self.db.execute(
            select(PaymentPlan).where(
                PaymentPlan.order_id.in_(order_ids),
                PaymentPlan.deleted_at.is_(None),
            ).order_by(PaymentPlan.created_at.desc())
        ).scalars().all())

    def list_by_user_id(self, user_id: str) -> list[PaymentPlan]:
        from app.models.commerce import Order
        return list(self.db.execute(
            select(PaymentPlan).join(Order, PaymentPlan.order_id == Order.id).where(
                Order.user_id == user_id,
                PaymentPlan.deleted_at.is_(None),
                Order.deleted_at.is_(None),
            ).order_by(PaymentPlan.created_at.desc())
        ).scalars().all())


class PaymentReminderRepository(BaseRepository[PaymentReminder]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, PaymentReminder)

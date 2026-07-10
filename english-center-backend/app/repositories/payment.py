from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.commerce import Payment, PaymentProvider, PaymentWebhookLog
from app.repositories.base import BaseRepository


class PaymentRepository(BaseRepository[Payment]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Payment)

    def list_by_order_id(self, order_id: str) -> list[Payment]:
        return list(
            self.db.execute(
                select(Payment).where(Payment.order_id == order_id, Payment.deleted_at.is_(None)).order_by(Payment.created_at.desc())
            ).scalars().all()
        )

    def get_by_provider_transaction_id(self, provider_transaction_id: str) -> Payment | None:
        return self.db.execute(
            select(Payment).where(
                Payment.provider_transaction_id == provider_transaction_id,
                Payment.deleted_at.is_(None),
            )
        ).scalar_one_or_none()

    def get_by_external_transaction_id(self, external_transaction_id: str) -> Payment | None:
        return self.db.execute(
            select(Payment).where(
                Payment.external_transaction_id == external_transaction_id,
                Payment.deleted_at.is_(None),
            )
        ).scalar_one_or_none()

    def get_latest_by_order_and_provider(self, order_id: str, provider: PaymentProvider) -> Payment | None:
        return self.db.execute(
            select(Payment)
            .where(Payment.order_id == order_id, Payment.provider == provider, Payment.deleted_at.is_(None))
            .order_by(Payment.created_at.desc())
        ).scalars().first()


class PaymentWebhookLogRepository(BaseRepository[PaymentWebhookLog]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, PaymentWebhookLog)

    def list_by_external_transaction_id(self, external_transaction_id: str) -> list[PaymentWebhookLog]:
        return list(
            self.db.execute(
                select(PaymentWebhookLog)
                .where(
                    PaymentWebhookLog.external_transaction_id == external_transaction_id,
                    PaymentWebhookLog.deleted_at.is_(None),
                )
                .order_by(PaymentWebhookLog.created_at.desc())
            ).scalars().all()
        )

    def has_valid_event(self, provider: str, external_transaction_id: str, event_type: str, exclude_id: str | None = None) -> bool:
        stmt = select(PaymentWebhookLog).where(
            PaymentWebhookLog.provider == provider,
            PaymentWebhookLog.external_transaction_id == external_transaction_id,
            PaymentWebhookLog.event_type == event_type,
            PaymentWebhookLog.is_valid.is_(True),
        )
        if exclude_id:
            stmt = stmt.where(PaymentWebhookLog.id != exclude_id)
        return self.db.execute(stmt).first() is not None


SePayIPNLogRepository = PaymentWebhookLogRepository

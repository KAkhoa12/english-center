from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.commerce import Payment, SePayIPNLog
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


class SePayIPNLogRepository(BaseRepository[SePayIPNLog]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, SePayIPNLog)

    def list_by_invoice_number(self, invoice_number: str) -> list[SePayIPNLog]:
        return list(
            self.db.execute(
                select(SePayIPNLog)
                .where(SePayIPNLog.invoice_number == invoice_number, SePayIPNLog.deleted_at.is_(None))
                .order_by(SePayIPNLog.created_at.desc())
            ).scalars().all()
        )

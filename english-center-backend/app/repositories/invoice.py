from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.commerce import Invoice, InvoiceItem
from app.repositories.base import BaseRepository


class InvoiceRepository(BaseRepository[Invoice]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Invoice)

    def get_by_invoice_number(self, invoice_number: str) -> Invoice | None:
        return self.db.execute(
            select(Invoice).where(Invoice.invoice_number == invoice_number, Invoice.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_by_order_id(self, order_id: str) -> Invoice | None:
        return self.db.execute(
            select(Invoice).where(Invoice.order_id == order_id, Invoice.deleted_at.is_(None))
        ).scalar_one_or_none()

    def list_by_user_id(self, user_id: str) -> list[Invoice]:
        return list(
            self.db.execute(
                select(Invoice).where(Invoice.user_id == user_id, Invoice.deleted_at.is_(None)).order_by(Invoice.created_at.desc())
            ).scalars().all()
        )


class InvoiceItemRepository(BaseRepository[InvoiceItem]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, InvoiceItem)

    def list_by_invoice_id(self, invoice_id: str) -> list[InvoiceItem]:
        return list(
            self.db.execute(
                select(InvoiceItem).where(InvoiceItem.invoice_id == invoice_id, InvoiceItem.deleted_at.is_(None))
            ).scalars().all()
        )

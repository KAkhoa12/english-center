from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.commerce import Order, OrderItem, OrderStatus
from app.repositories.base import BaseRepository


class OrderRepository(BaseRepository[Order]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Order)

    def get_by_order_code(self, order_code: str) -> Order | None:
        return self.db.execute(
            select(Order).where(Order.order_code == order_code, Order.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_by_invoice_number(self, invoice_number: str) -> Order | None:
        return self.db.execute(
            select(Order).where(Order.invoice_number == invoice_number, Order.deleted_at.is_(None))
        ).scalar_one_or_none()

    def list_by_user_id(self, user_id: str) -> list[Order]:
        return list(
            self.db.execute(
                select(Order).where(Order.user_id == user_id, Order.deleted_at.is_(None)).order_by(Order.created_at.desc())
            ).scalars().all()
        )

    def count_created_since(self, from_datetime: datetime) -> int:
        return int(
            self.db.execute(
                select(func.count()).select_from(Order).where(Order.created_at >= from_datetime)
            ).scalar_one()
        )

    def list_filtered(self, user_id: str | None = None, status: OrderStatus | None = None) -> list[Order]:
        stmt = select(Order).where(Order.deleted_at.is_(None))
        if user_id:
            stmt = stmt.where(Order.user_id == user_id)
        if status:
            stmt = stmt.where(Order.status == status)
        stmt = stmt.order_by(Order.created_at.desc())
        return list(self.db.execute(stmt).scalars().all())


class OrderItemRepository(BaseRepository[OrderItem]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, OrderItem)

    def list_by_order_id(self, order_id: str) -> list[OrderItem]:
        return list(
            self.db.execute(
                select(OrderItem).where(OrderItem.order_id == order_id, OrderItem.deleted_at.is_(None))
            ).scalars().all()
        )

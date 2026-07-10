from sqlalchemy.orm import Session

from app.models.guest_enrollment import GuestEnrollment
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class GuestEnrollmentRepository(BaseRepository[GuestEnrollment]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, GuestEnrollment)

    def get_active_by_id(self, guest_enrollment_id: str) -> GuestEnrollment | None:
        return self.get(guest_enrollment_id)

    def list_filtered(self, query: PaginationParams) -> tuple[list[GuestEnrollment], int]:
        filters = []
        if query.search:
            filters.append(
                (GuestEnrollment.note.ilike(f"%{query.search}%")) |
                (GuestEnrollment.customer_name.ilike(f"%{query.search}%"))
            )

        sort_field = getattr(GuestEnrollment, query.sort_by, GuestEnrollment.created_at) if query.sort_by else GuestEnrollment.created_at
        order_by = sort_field.asc() if query.sort_order == "asc" else sort_field.desc()
        skip = (query.page - 1) * query.page_size

        total = self.count(filters=filters)
        items = self.list(filters=filters, skip=skip, limit=query.page_size, order_by=order_by)
        return items, total

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.assignment_type import AssignmentType, AssignmentTypeStatus
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class AssignmentTypeRepository(BaseRepository[AssignmentType]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, AssignmentType)

    def get_active_by_code(self, code: str) -> AssignmentType | None:
        return self.db.execute(
            select(AssignmentType).where(AssignmentType.code == code, AssignmentType.deleted_at.is_(None))
        ).scalar_one_or_none()

    def get_active_by_id(self, assignment_type_id: str) -> AssignmentType | None:
        return self.db.execute(
            select(AssignmentType).where(
                AssignmentType.id == assignment_type_id,
                AssignmentType.deleted_at.is_(None),
            )
        ).scalar_one_or_none()

    def code_exists(self, code: str, exclude_assignment_type_id: str | None = None) -> bool:
        stmt = select(AssignmentType.id).where(
            AssignmentType.code == code,
            AssignmentType.deleted_at.is_(None),
        )
        if exclude_assignment_type_id is not None:
            stmt = stmt.where(AssignmentType.id != exclude_assignment_type_id)
        return self.db.execute(stmt).first() is not None

    def list_filtered(
        self,
        query: PaginationParams,
        status: AssignmentTypeStatus | None = None,
    ) -> tuple[list[AssignmentType], int]:
        filters = [AssignmentType.deleted_at.is_(None)]
        if query.search:
            term = f"%{query.search}%"
            filters.append(or_(AssignmentType.code.ilike(term), AssignmentType.name.ilike(term)))
        if status:
            filters.append(AssignmentType.status == status)

        sort_field = getattr(AssignmentType, query.sort_by, AssignmentType.created_at) if query.sort_by else AssignmentType.created_at
        order_by = sort_field.asc() if query.sort_order == "asc" else sort_field.desc()
        skip = (query.page - 1) * query.page_size
        return self.list(filters=filters, skip=skip, limit=query.page_size, order_by=order_by), self.count(filters=filters)

from sqlalchemy import select
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models import Role
from app.schemas.common import PaginationParams


class RoleRepository(BaseRepository[Role]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Role)

    def get_active_by_ids(self, role_ids: list[str]) -> list[Role]:
        return list(
            self.db.execute(
                select(Role).where(Role.id.in_(role_ids), Role.deleted_at.is_(None))
            ).scalars().all()
        )

    def get_active_by_id(self, role_id: str) -> Role | None:
        return self.get(role_id)

    def get_active_by_name(self, name: str) -> Role | None:
        return self.db.execute(
            select(Role).where(Role.name == name, Role.deleted_at.is_(None))
        ).scalar_one_or_none()

    def name_exists(self, name: str, exclude_role_id: str | None = None) -> bool:
        stmt = select(Role.id).where(Role.name == name)
        if exclude_role_id is not None:
            stmt = stmt.where(Role.id != exclude_role_id)
        return self.db.execute(stmt).first() is not None

    def list_active_role_names_by_ids(self, role_ids: list[str]) -> list[str]:
        if not role_ids:
            return []
        return list(
            self.db.execute(
                select(Role.name).where(Role.id.in_(role_ids), Role.deleted_at.is_(None))
            ).scalars().all()
        )

    def list_filtered(self, query: PaginationParams) -> tuple[list[Role], int]:
        filters = []
        if query.search:
            filters.append(Role.name.ilike(f"%{query.search}%"))

        sort_field = getattr(Role, query.sort_by, Role.created_at) if query.sort_by else Role.created_at
        order_by = sort_field.asc() if query.sort_order == "asc" else sort_field.desc()
        skip = (query.page - 1) * query.page_size
        return self.list(filters=filters, skip=skip, limit=query.page_size, order_by=order_by), self.count(filters=filters)

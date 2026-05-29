from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models import Permission
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class PermissionRepository(BaseRepository[Permission]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Permission)

    def code_exists(self, code: str, exclude_permission_id: str | None = None) -> bool:
        stmt = select(Permission.id).where(
            Permission.code == code,
        )
        if exclude_permission_id is not None:
            stmt = stmt.where(Permission.id != exclude_permission_id)
        return self.db.execute(stmt).first() is not None

    def get_active_by_id(self, permission_id: str) -> Permission | None:
        return self.get(permission_id)

    def get_by_code(self, code: str, include_deleted: bool = False) -> Permission | None:
        stmt = select(Permission).where(Permission.code == code)
        if not include_deleted:
            stmt = stmt.where(Permission.deleted_at.is_(None))
        return self.db.execute(stmt).scalar_one_or_none()

    def get_active_by_ids(self, permission_ids: list[str]) -> list[Permission]:
        return list(
            self.db.execute(
                select(Permission).where(
                    Permission.id.in_(permission_ids),
                    Permission.deleted_at.is_(None),
                )
            ).scalars().all()
        )

    def list_active_codes_by_ids(self, permission_ids: list[str]) -> list[str]:
        if not permission_ids:
            return []
        return list(
            self.db.execute(
                select(Permission.code).where(
                    Permission.id.in_(permission_ids),
                    Permission.deleted_at.is_(None),
                )
            ).scalars().all()
        )

    def list_filtered(self, query: PaginationParams) -> tuple[list[Permission], int]:
        filters = []
        if query.search:
            term = f"%{query.search}%"
            filters.append(or_(Permission.code.ilike(term), Permission.name.ilike(term)))

        sort_field = getattr(Permission, query.sort_by, Permission.created_at) if query.sort_by else Permission.created_at
        order_by = sort_field.asc() if query.sort_order == "asc" else sort_field.desc()
        skip = (query.page - 1) * query.page_size
        return self.list(filters=filters, skip=skip, limit=query.page_size, order_by=order_by), self.count(filters=filters)

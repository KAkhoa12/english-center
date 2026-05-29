from fastapi import HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import ColumnElement

from app.core.security import hash_password
from app.models import User, UserStatus
from app.schemas.common import PaginationParams
from app.schemas.user import UserCreate, UserUpdate
from app.repositories.role import RoleRepository
from app.repositories.user import UserRepository
from app.repositories.user_role import UserRoleRepository

class UserService:
    def __init__(
        self,
        db: Session,
        user_repo: UserRepository | None = None,
        role_repo: RoleRepository | None = None,
        user_role_repo: UserRoleRepository | None = None,
    ) -> None:
        self.db = db
        self.user_repo = user_repo or UserRepository(db)
        self.role_repo = role_repo or RoleRepository(db)
        self.user_role_repo = user_role_repo or UserRoleRepository(db)

    def create_user(self, payload: UserCreate) -> User:
        exists = self.user_repo.email_exists(str(payload.email))
        if exists:
            raise HTTPException(status_code=400, detail="Email already exists")

        user = User(
            full_name=payload.full_name,
            email=str(payload.email),
            phone=payload.phone,
            password_hash=hash_password(payload.password),
            avatar_url=payload.avatar_url,
            status=UserStatus(payload.status),
        )
        self.user_repo.create(user)

        if payload.role_ids:
            self.assign_roles(str(user.id), payload.role_ids)

        self.db.commit()
        return user

    def get_users(self, query: PaginationParams) -> tuple[list[User], int]:
        filters: list[ColumnElement[bool]] = []
        if query.search:
            term = f"%{query.search}%"
            filters.append(or_(User.full_name.ilike(term), User.email.ilike(term), User.phone.ilike(term)))

        sort_field = getattr(User, query.sort_by, User.created_at) if query.sort_by else User.created_at
        order_by = sort_field.asc() if query.sort_order == "asc" else sort_field.desc()
        skip = (query.page - 1) * query.page_size

        total = self.user_repo.count(filters=filters)
        users = self.user_repo.list(filters=filters, skip=skip, limit=query.page_size, order_by=order_by)
        return users, total

    def get_user_by_id(self, user_id: str) -> User:
        user = self.user_repo.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    def update_user(self, user_id: str, payload: UserUpdate) -> User:
        user = self.get_user_by_id(user_id)
        for field in ["full_name", "phone", "avatar_url", "is_verified"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(user, field, value)
        if payload.status is not None:
            user.status = UserStatus(payload.status)
        self.user_repo.update(user)
        self.db.commit()
        return user

    def soft_delete_user(self, user_id: str) -> None:
        user = self.get_user_by_id(user_id)
        self.user_repo.soft_delete(user)
        self.db.commit()

    def assign_roles(self, user_id: str, role_ids: list[str]) -> None:
        user = self.get_user_by_id(user_id)
        _ = user
        roles = self.role_repo.get_active_by_ids(role_ids)
        if len(roles) != len(set(role_ids)):
            raise HTTPException(status_code=404, detail="One or more roles not found")

        for role_id in set(role_ids):
            existing = self.user_role_repo.get_active_relation(user_id, role_id)
            if not existing:
                self.user_role_repo.create_or_restore_relation(user_id, role_id)
        self.db.commit()

    def remove_role(self, user_id: str, role_id: str) -> None:
        relation = self.user_role_repo.get_active_relation(user_id, role_id)
        if not relation:
            raise HTTPException(status_code=404, detail="User role not found")
        self.user_role_repo.soft_delete(relation)
        self.db.commit()

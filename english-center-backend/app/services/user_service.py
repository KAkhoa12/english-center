from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.role import Role, UserRole
from app.models.user import User, UserStatus
from app.schemas.common import PaginationParams
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_user(self, payload: UserCreate) -> User:
        exists = self.db.execute(select(User).where(User.email == str(payload.email), User.deleted_at.is_(None))).scalar_one_or_none()
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
        self.db.add(user)
        self.db.flush()

        if payload.role_ids:
            self.assign_roles(str(user.id), payload.role_ids)

        self.db.commit()
        self.db.refresh(user)
        return user

    def get_users(self, query: PaginationParams) -> tuple[list[User], int]:
        filters = [User.deleted_at.is_(None)]
        if query.search:
            term = f"%{query.search}%"
            filters.append(or_(User.full_name.ilike(term), User.email.ilike(term), User.phone.ilike(term)))

        total = self.db.execute(select(func.count()).select_from(User).where(*filters)).scalar_one()
        stmt = select(User).where(*filters)
        sort_field = getattr(User, query.sort_by, User.created_at) if query.sort_by else User.created_at
        stmt = stmt.order_by(sort_field.asc() if query.sort_order == "asc" else sort_field.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def get_user_by_id(self, user_id: str) -> User:
        user = self.db.execute(select(User).where(User.id == user_id, User.deleted_at.is_(None))).scalar_one_or_none()
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
        self.db.commit()
        self.db.refresh(user)
        return user

    def soft_delete_user(self, user_id: str) -> None:
        user = self.get_user_by_id(user_id)
        user.deleted_at = datetime.now(timezone.utc)
        self.db.commit()

    def assign_roles(self, user_id: str, role_ids: list[str]) -> None:
        user = self.get_user_by_id(user_id)
        _ = user
        roles = self.db.execute(select(Role).where(Role.id.in_(role_ids), Role.deleted_at.is_(None))).scalars().all()
        if len(roles) != len(set(role_ids)):
            raise HTTPException(status_code=404, detail="One or more roles not found")

        for role_id in set(role_ids):
            existing = self.db.execute(
                select(UserRole).where(UserRole.user_id == user_id, UserRole.role_id == role_id, UserRole.deleted_at.is_(None))
            ).scalar_one_or_none()
            if not existing:
                self.db.add(UserRole(user_id=user_id, role_id=role_id))
        self.db.commit()

    def remove_role(self, user_id: str, role_id: str) -> None:
        relation = self.db.execute(
            select(UserRole).where(UserRole.user_id == user_id, UserRole.role_id == role_id, UserRole.deleted_at.is_(None))
        ).scalar_one_or_none()
        if not relation:
            raise HTTPException(status_code=404, detail="User role not found")
        relation.deleted_at = datetime.now(timezone.utc)
        self.db.commit()

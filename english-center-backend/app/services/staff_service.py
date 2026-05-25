from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.role import Role
from app.models.staff import StaffProfile
from app.models.user import User
from app.schemas.common import PaginationParams
from app.schemas.staff import StaffCreate, StaffUpdate
from app.schemas.user import UserCreate
from app.services.user_service import UserService


class StaffService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.user_service = UserService(db)

    def create_staff(self, payload: StaffCreate) -> StaffProfile:
        user = self.user_service.create_user(
            UserCreate(
                full_name=payload.full_name,
                email=payload.email,
                phone=payload.phone,
                password=payload.password,
                avatar_url=payload.avatar_url,
                role_ids=[],
            )
        )

        role = self.db.execute(select(Role).where(Role.name == "staff", Role.deleted_at.is_(None))).scalar_one_or_none()
        if role:
            self.user_service.assign_roles(str(user.id), [str(role.id)])

        existing = self.db.execute(
            select(StaffProfile).where(StaffProfile.user_id == user.id, StaffProfile.deleted_at.is_(None))
        ).scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=400, detail="Staff profile already exists")

        obj = StaffProfile(user_id=user.id, position=payload.position, department=payload.department, note=payload.note)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def get_staff(self, query: PaginationParams) -> tuple[list[tuple[StaffProfile, User]], int]:
        stmt = select(StaffProfile, User).join(User, User.id == StaffProfile.user_id).where(StaffProfile.deleted_at.is_(None), User.deleted_at.is_(None))
        if query.search:
            q = f"%{query.search}%"
            stmt = stmt.where(or_(User.full_name.ilike(q), User.email.ilike(q), User.phone.ilike(q), StaffProfile.position.ilike(q), StaffProfile.department.ilike(q)))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(StaffProfile.created_at.asc() if query.sort_order == "asc" else StaffProfile.created_at.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).all()), int(total)

    def get_staff_by_id(self, staff_id: str) -> tuple[StaffProfile, User]:
        row = self.db.execute(
            select(StaffProfile, User)
            .join(User, User.id == StaffProfile.user_id)
            .where(StaffProfile.id == staff_id, StaffProfile.deleted_at.is_(None), User.deleted_at.is_(None))
        ).first()
        if not row:
            raise HTTPException(status_code=404, detail="Staff not found")
        return row

    def update_staff(self, staff_id: str, payload: StaffUpdate) -> StaffProfile:
        staff, _ = self.get_staff_by_id(staff_id)
        for field in ["position", "department", "note"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(staff, field, value)
        self.db.commit()
        self.db.refresh(staff)
        return staff

    def soft_delete_staff(self, staff_id: str) -> None:
        staff, _ = self.get_staff_by_id(staff_id)
        staff.deleted_at = datetime.now(timezone.utc)
        self.db.commit()

    def update_avatar(self, staff_id: str, avatar_url: str) -> User:
        _, user = self.get_staff_by_id(staff_id)
        user.avatar_url = avatar_url
        self.db.commit()
        self.db.refresh(user)
        return user

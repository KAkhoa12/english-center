from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models import StaffProfile, User, UserStatus
from app.repositories.role import RoleRepository
from app.repositories.staff import StaffRepository
from app.repositories.user import UserRepository
from app.repositories.user_role import UserRoleRepository
from app.schemas.common import PaginationParams
from app.schemas.staff import StaffCreate, StaffUpdate


class StaffService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.user_repo = UserRepository(db)
        self.role_repo = RoleRepository(db)
        self.user_role_repo = UserRoleRepository(db)
        self.staff_repo = StaffRepository(db)

    def create_staff(self, payload: StaffCreate) -> StaffProfile:
        try:
            if self.user_repo.email_exists(str(payload.email)):
                raise HTTPException(status_code=400, detail="Email already exists")

            role = self.role_repo.get_active_by_name("staff")
            if not role:
                raise HTTPException(status_code=404, detail="Staff role not found")

            user = self.user_repo.create(
                User(
                    full_name=payload.full_name,
                    email=str(payload.email),
                    phone=payload.phone,
                    password_hash=hash_password(payload.password),
                    avatar_url=payload.avatar_url,
                    status=UserStatus.active,
                )
            )
            self.user_role_repo.create_or_restore_relation(str(user.id), str(role.id))

            if self.staff_repo.get_by_user_id(str(user.id)):
                raise HTTPException(status_code=400, detail="Staff profile already exists")

            obj = StaffProfile(user_id=str(user.id), position=payload.position, department=payload.department, note=payload.note)
            created = self.staff_repo.create(obj)
            self.db.commit()
            return created
        except Exception:
            self.db.rollback()
            raise

    def get_staff(self, query: PaginationParams) -> tuple[list[tuple[StaffProfile, User]], int]:
        return self.staff_repo.list_with_user(query)

    def get_staff_by_id(self, staff_id: str) -> tuple[StaffProfile, User]:
        row = self.staff_repo.get_with_user_by_id(staff_id)
        if not row:
            raise HTTPException(status_code=404, detail="Staff not found")
        return row

    def update_staff(self, staff_id: str, payload: StaffUpdate) -> StaffProfile:
        try:
            staff, _ = self.get_staff_by_id(staff_id)
            for field in ["position", "department", "note"]:
                value = getattr(payload, field)
                if value is not None:
                    setattr(staff, field, value)
            updated = self.staff_repo.update(staff)
            self.db.commit()
            return updated
        except Exception:
            self.db.rollback()
            raise

    def soft_delete_staff(self, staff_id: str) -> None:
        try:
            staff, _ = self.get_staff_by_id(staff_id)
            self.staff_repo.soft_delete(staff)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

    def update_avatar(self, staff_id: str, avatar_url: str) -> User:
        try:
            _, user = self.get_staff_by_id(staff_id)
            user.avatar_url = avatar_url
            updated = self.user_repo.update(user)
            self.db.commit()
            return updated
        except Exception:
            self.db.rollback()
            raise

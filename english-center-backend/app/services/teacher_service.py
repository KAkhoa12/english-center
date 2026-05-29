from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models import Teacher, User, UserStatus
from app.repositories.role import RoleRepository
from app.repositories.teacher import TeacherRepository
from app.repositories.user import UserRepository
from app.repositories.user_role import UserRoleRepository
from app.schemas.common import PaginationParams
from app.schemas.teacher import TeacherCreate, TeacherUpdate


class TeacherService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.user_repo = UserRepository(db)
        self.role_repo = RoleRepository(db)
        self.user_role_repo = UserRoleRepository(db)
        self.teacher_repo = TeacherRepository(db)

    def create_teacher(self, payload: TeacherCreate) -> Teacher:
        try:
            if self.user_repo.email_exists(str(payload.email)):
                raise HTTPException(status_code=400, detail="Email already exists")

            role = self.role_repo.get_active_by_name("teacher")
            if not role:
                raise HTTPException(status_code=404, detail="Teacher role not found")

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

            if self.teacher_repo.get_by_user_id(str(user.id)):
                raise HTTPException(status_code=400, detail="Teacher profile already exists")

            obj = Teacher(
                user_id=str(user.id),
                specialization=payload.specialization,
                bio=payload.bio,
                experience_years=payload.experience_years,
                certificates=payload.certificates,
                hourly_rate=payload.hourly_rate,
            )
            created = self.teacher_repo.create(obj)
            self.db.commit()
            return created
        except Exception:
            self.db.rollback()
            raise

    def get_teachers(self, query: PaginationParams) -> tuple[list[tuple[Teacher, User]], int]:
        return self.teacher_repo.list_with_user(query)

    def get_teacher_by_id(self, teacher_id: str) -> tuple[Teacher, User]:
        row = self.teacher_repo.get_with_user_by_id(teacher_id)
        if not row:
            raise HTTPException(status_code=404, detail="Teacher not found")
        return row

    def update_teacher(self, teacher_id: str, payload: TeacherUpdate) -> Teacher:
        try:
            teacher, _ = self.get_teacher_by_id(teacher_id)
            for field in ["specialization", "bio", "experience_years", "certificates", "hourly_rate"]:
                value = getattr(payload, field)
                if value is not None:
                    setattr(teacher, field, value)
            updated = self.teacher_repo.update(teacher)
            self.db.commit()
            return updated
        except Exception:
            self.db.rollback()
            raise

    def soft_delete_teacher(self, teacher_id: str) -> None:
        try:
            teacher, _ = self.get_teacher_by_id(teacher_id)
            self.teacher_repo.soft_delete(teacher)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

    def update_avatar(self, teacher_id: str, avatar_url: str) -> User:
        try:
            _, user = self.get_teacher_by_id(teacher_id)
            user.avatar_url = avatar_url
            updated = self.user_repo.update(user)
            self.db.commit()
            return updated
        except Exception:
            self.db.rollback()
            raise

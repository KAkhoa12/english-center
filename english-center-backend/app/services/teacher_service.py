from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.role import Role
from app.models.teacher import Teacher
from app.models.user import User
from app.schemas.common import PaginationParams
from app.schemas.teacher import TeacherCreate, TeacherUpdate
from app.schemas.user import UserCreate
from app.services.user_service import UserService


class TeacherService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.user_service = UserService(db)

    def create_teacher(self, payload: TeacherCreate) -> Teacher:
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

        role = self.db.execute(select(Role).where(Role.name == "teacher", Role.deleted_at.is_(None))).scalar_one_or_none()
        if role:
            self.user_service.assign_roles(str(user.id), [str(role.id)])

        existing = self.db.execute(select(Teacher).where(Teacher.user_id == user.id, Teacher.deleted_at.is_(None))).scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=400, detail="Teacher profile already exists")

        obj = Teacher(
            user_id=user.id,
            specialization=payload.specialization,
            bio=payload.bio,
            experience_years=payload.experience_years,
            certificates=payload.certificates,
            hourly_rate=payload.hourly_rate,
        )
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def get_teachers(self, query: PaginationParams) -> tuple[list[tuple[Teacher, User]], int]:
        stmt = select(Teacher, User).join(User, User.id == Teacher.user_id).where(Teacher.deleted_at.is_(None), User.deleted_at.is_(None))
        if query.search:
            q = f"%{query.search}%"
            stmt = stmt.where(or_(User.full_name.ilike(q), User.email.ilike(q), User.phone.ilike(q), Teacher.specialization.ilike(q)))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(Teacher.created_at.asc() if query.sort_order == "asc" else Teacher.created_at.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).all()), int(total)

    def get_teacher_by_id(self, teacher_id: str) -> tuple[Teacher, User]:
        row = self.db.execute(
            select(Teacher, User)
            .join(User, User.id == Teacher.user_id)
            .where(Teacher.id == teacher_id, Teacher.deleted_at.is_(None), User.deleted_at.is_(None))
        ).first()
        if not row:
            raise HTTPException(status_code=404, detail="Teacher not found")
        return row

    def update_teacher(self, teacher_id: str, payload: TeacherUpdate) -> Teacher:
        teacher, _ = self.get_teacher_by_id(teacher_id)
        for field in ["specialization", "bio", "experience_years", "certificates", "hourly_rate"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(teacher, field, value)
        self.db.commit()
        self.db.refresh(teacher)
        return teacher

    def soft_delete_teacher(self, teacher_id: str) -> None:
        teacher, _ = self.get_teacher_by_id(teacher_id)
        teacher.deleted_at = datetime.now(timezone.utc)
        self.db.commit()

    def update_avatar(self, teacher_id: str, avatar_url: str) -> User:
        _, user = self.get_teacher_by_id(teacher_id)
        user.avatar_url = avatar_url
        self.db.commit()
        self.db.refresh(user)
        return user

from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.role import Role
from app.models.student import Student, StudentLevel
from app.models.user import User
from app.schemas.common import PaginationParams
from app.schemas.student import StudentCreate, StudentUpdate
from app.schemas.user import UserCreate
from app.services.user_service import UserService


class StudentService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.user_service = UserService(db)

    def create_student(self, payload: StudentCreate) -> Student:
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

        role = self.db.execute(select(Role).where(Role.name == "student", Role.deleted_at.is_(None))).scalar_one_or_none()
        if role:
            self.user_service.assign_roles(str(user.id), [str(role.id)])

        existing = self.db.execute(
            select(Student).where(Student.user_id == user.id, Student.deleted_at.is_(None))
        ).scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=400, detail="Student profile already exists")

        obj = Student(
            user_id=user.id,
            date_of_birth=payload.date_of_birth,
            gender=payload.gender,
            address=payload.address,
            level=StudentLevel(payload.level) if payload.level else None,
            learning_goal=payload.learning_goal,
            parent_name=payload.parent_name,
            parent_phone=payload.parent_phone,
        )
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def get_students(self, query: PaginationParams, level: str | None = None) -> tuple[list[tuple[Student, User]], int]:
        stmt = select(Student, User).join(User, User.id == Student.user_id).where(Student.deleted_at.is_(None), User.deleted_at.is_(None))
        if level:
            stmt = stmt.where(Student.level == StudentLevel(level))
        if query.search:
            q = f"%{query.search}%"
            stmt = stmt.where(or_(User.full_name.ilike(q), User.email.ilike(q), User.phone.ilike(q)))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(Student.created_at.asc() if query.sort_order == "asc" else Student.created_at.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).all()), int(total)

    def get_student_by_id(self, student_id: str) -> tuple[Student, User]:
        row = self.db.execute(
            select(Student, User)
            .join(User, User.id == Student.user_id)
            .where(Student.id == student_id, Student.deleted_at.is_(None), User.deleted_at.is_(None))
        ).first()
        if not row:
            raise HTTPException(status_code=404, detail="Student not found")
        return row

    def update_student(self, student_id: str, payload: StudentUpdate) -> Student:
        student, _ = self.get_student_by_id(student_id)
        for field in ["date_of_birth", "gender", "address", "learning_goal", "parent_name", "parent_phone"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(student, field, value)
        if payload.level is not None:
            student.level = StudentLevel(payload.level)
        self.db.commit()
        self.db.refresh(student)
        return student

    def soft_delete_student(self, student_id: str) -> None:
        student, _ = self.get_student_by_id(student_id)
        student.deleted_at = datetime.now(timezone.utc)
        self.db.commit()

    def update_avatar(self, student_id: str, avatar_url: str) -> User:
        _, user = self.get_student_by_id(student_id)
        user.avatar_url = avatar_url
        self.db.commit()
        self.db.refresh(user)
        return user

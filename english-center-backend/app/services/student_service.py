from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models import User, UserStatus
from app.models.student import Student, StudentLevel
from app.repositories.role import RoleRepository
from app.repositories.student import StudentRepository
from app.repositories.user import UserRepository
from app.repositories.user_role import UserRoleRepository
from app.schemas.common import PaginationParams
from app.schemas.student import StudentCreate, StudentUpdate


class StudentService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.user_repo = UserRepository(db)
        self.role_repo = RoleRepository(db)
        self.user_role_repo = UserRoleRepository(db)
        self.student_repo = StudentRepository(db)

    def create_student(self, payload: StudentCreate) -> Student:
        try:
            if self.user_repo.email_exists(str(payload.email)):
                raise HTTPException(status_code=400, detail="Email already exists")

            role = self.role_repo.get_active_by_name("student")
            if not role:
                raise HTTPException(status_code=404, detail="Student role not found")

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

            if self.student_repo.get_by_user_id(str(user.id)):
                raise HTTPException(status_code=400, detail="Student profile already exists")

            obj = Student(
                user_id=str(user.id),
                date_of_birth=payload.date_of_birth,
                gender=payload.gender,
                address=payload.address,
                level=StudentLevel(payload.level) if payload.level else None,
                learning_goal=payload.learning_goal,
                parent_name=payload.parent_name,
                parent_phone=payload.parent_phone,
            )
            created = self.student_repo.create(obj)
            self.db.commit()
            return created
        except Exception:
            self.db.rollback()
            raise

    def get_students(self, query: PaginationParams, level: str | None = None) -> tuple[list[tuple[Student, User]], int]:
        return self.student_repo.list_with_user(query=query, level=level)

    def get_student_by_id(self, student_id: str) -> tuple[Student, User]:
        row = self.student_repo.get_with_user_by_id(student_id)
        if not row:
            raise HTTPException(status_code=404, detail="Student not found")
        return row

    def update_student(self, student_id: str, payload: StudentUpdate) -> Student:
        try:
            student, _ = self.get_student_by_id(student_id)
            for field in ["date_of_birth", "gender", "address", "learning_goal", "parent_name", "parent_phone"]:
                value = getattr(payload, field)
                if value is not None:
                    setattr(student, field, value)
            if payload.level is not None:
                student.level = StudentLevel(payload.level)
            updated = self.student_repo.update(student)
            self.db.commit()
            return updated
        except Exception:
            self.db.rollback()
            raise

    def soft_delete_student(self, student_id: str) -> None:
        try:
            student, _ = self.get_student_by_id(student_id)
            self.student_repo.soft_delete(student)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

    def update_avatar(self, student_id: str, avatar_url: str) -> User:
        try:
            _, user = self.get_student_by_id(student_id)
            user.avatar_url = avatar_url
            updated = self.user_repo.update(user)
            self.db.commit()
            return updated
        except Exception:
            self.db.rollback()
            raise

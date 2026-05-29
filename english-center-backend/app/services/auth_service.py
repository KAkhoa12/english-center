from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, create_refresh_token, decode_refresh_token, hash_password, verify_password
from app.models.rbac.user import UserStatus
from app.repositories.user import UserRepository
from app.schemas.auth import AuthUser, LoginPayload, LoginRequest, RegisterStudentRequest
from app.schemas.student import StudentCreate
from app.services.rbac_service import RBACService
from app.services.student_service import StudentService


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.user_repo = UserRepository(db)
        self.rbac_service = RBACService(db)

    def login(self, payload: LoginRequest) -> LoginPayload:
        user = self.user_repo.get_active_by_email(str(payload.email))
        if not user or not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

        if user.status in {UserStatus.inactive, UserStatus.banned}:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive or banned")

        access_token = create_access_token(str(user.id), user.email)
        refresh_token = create_refresh_token(str(user.id), user.email)
        roles = self.rbac_service.get_user_roles(str(user.id))
        permissions = self.rbac_service.get_user_permissions(str(user.id))
        return LoginPayload(
            access_token=access_token,
            refresh_token=refresh_token,
            user=AuthUser(id=str(user.id), full_name=user.full_name, email=user.email),
            roles=roles,
            permissions=permissions,
        )

    def register_student(self, payload: RegisterStudentRequest) -> dict:
        student = StudentService(self.db).create_student(StudentCreate(**payload.model_dump()))
        user = self.user_repo.get_active_by_id(str(student.user_id))
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        roles = self.rbac_service.get_user_roles(str(user.id))
        permissions = self.rbac_service.get_user_permissions(str(user.id))
        access_token = create_access_token(str(user.id), user.email)
        refresh_token = create_refresh_token(str(user.id), user.email)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "full_name": user.full_name,
                "email": user.email,
                "avatar_url": getattr(user, "avatar_url", None),
                "status": user.status.value if getattr(user, "status", None) else None,
                "is_verified": getattr(user, "is_verified", None),
            },
            "student": {
                "id": str(student.id),
                "date_of_birth": student.date_of_birth,
                "gender": student.gender,
                "address": student.address,
                "level": student.level.value if student.level else None,
                "learning_goal": student.learning_goal,
                "parent_name": student.parent_name,
                "parent_phone": student.parent_phone,
            },
            "roles": roles,
            "permissions": permissions,
        }

    def refresh_token(self, refresh_token: str) -> dict:
        try:
            payload = decode_refresh_token(refresh_token)
            user_id = payload.get("user_id")
        except Exception as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token") from exc

        user = self.user_repo.get_active_by_id(str(user_id))
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")
        if user.status in {UserStatus.inactive, UserStatus.banned}:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive or banned")

        new_access_token = create_access_token(str(user.id), user.email)
        new_refresh_token = create_refresh_token(str(user.id), user.email)
        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
        }

    @staticmethod
    def hash_password(raw_password: str) -> str:
        return hash_password(raw_password)

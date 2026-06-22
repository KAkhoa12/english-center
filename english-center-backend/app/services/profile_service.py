from typing import Any

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.rbac.user import User
from app.models.student import StudentLevel
from app.repositories.student import StudentRepository
from app.repositories.teacher import TeacherRepository
from app.repositories.user import UserRepository
from app.schemas.profile import ProfileUpdate
from app.services.rbac_service import RBACService
from app.services.storage_service import StorageService
from app.utils.file import get_upload_file_size, validate_file_extension, validate_file_size
from app.utils.serializers import user_to_dict


class ProfileService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.user_repo = UserRepository(db)
        self.student_repo = StudentRepository(db)
        self.teacher_repo = TeacherRepository(db)
        self.rbac_service = RBACService(db)

    def _avatar_url(self, object_name: str | None) -> str | None:
        if not object_name:
            return None
        try:
            return StorageService().get_presigned_url(settings.MINIO_BUCKET_AVATARS, object_name)
        except HTTPException:
            return None

    def _profile_payload(self, user: User) -> dict[str, Any]:
        student = self.student_repo.get_by_user_id(str(user.id))
        teacher = self.teacher_repo.get_by_user_id(str(user.id))
        payload = {
            "user": {
                **user_to_dict(user, include_meta=True),
                "avatar_presigned_url": self._avatar_url(user.avatar_url),
            },
            "roles": self.rbac_service.get_user_roles(str(user.id)),
            "permissions": self.rbac_service.get_user_permissions(str(user.id)),
            "student": None,
            "teacher": None,
        }
        if student:
            payload["student"] = {
                "id": str(student.id),
                "date_of_birth": student.date_of_birth,
                "gender": student.gender,
                "address": student.address,
                "level": student.level.value if student.level else None,
                "learning_goal": student.learning_goal,
                "parent_name": student.parent_name,
                "parent_phone": student.parent_phone,
            }
        if teacher:
            payload["teacher"] = {
                "id": str(teacher.id),
                "specialization": teacher.specialization,
                "bio": teacher.bio,
                "experience_years": teacher.experience_years,
                "certificates": teacher.certificates,
                "hourly_rate": float(teacher.hourly_rate) if teacher.hourly_rate is not None else None,
            }
        return payload

    def get_my_profile(self, user: User) -> dict[str, Any]:
        return self._profile_payload(user)

    def update_my_profile(self, user: User, payload: ProfileUpdate) -> dict[str, Any]:
        if payload.full_name is not None:
            user.full_name = payload.full_name.strip()
        if payload.phone is not None:
            user.phone = payload.phone.strip() or None

        student = self.student_repo.get_by_user_id(str(user.id))
        if student:
            for field in ["date_of_birth", "gender", "address", "learning_goal", "parent_name", "parent_phone"]:
                value = getattr(payload, field)
                if value is not None:
                    setattr(student, field, value.strip() if isinstance(value, str) else value)
            if payload.level is not None:
                try:
                    student.level = StudentLevel(payload.level)
                except ValueError as exc:
                    raise HTTPException(status_code=400, detail="Invalid student level") from exc

        teacher = self.teacher_repo.get_by_user_id(str(user.id))
        if teacher:
            for field in ["specialization", "bio", "experience_years", "certificates", "hourly_rate"]:
                value = getattr(payload, field)
                if value is not None:
                    setattr(teacher, field, value.strip() if isinstance(value, str) else value)

        self.db.add(user)
        if student:
            self.db.add(student)
        if teacher:
            self.db.add(teacher)
        self.db.commit()
        self.db.refresh(user)
        return self._profile_payload(user)

    def update_my_avatar(self, user: User, file: UploadFile) -> dict[str, Any]:
        size = get_upload_file_size(file)
        validate_file_extension(file.filename or "avatar", "avatar")
        validate_file_size(size, "avatar")
        upload = StorageService().upload_file(
            bucket_name=settings.MINIO_BUCKET_AVATARS,
            file=file,
            file_size=size,
            folder=f"avatars/{user.id}",
        )
        user.avatar_url = upload["object_name"]
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return self._profile_payload(user)

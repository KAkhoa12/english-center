from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.guest_enrollment import GuestEnrollment
from app.repositories.guest_enrollment import GuestEnrollmentRepository
from app.schemas.common import PaginationParams
from app.schemas.guest_enrollment import GuestEnrollmentCreate, GuestEnrollmentUpdate


class GuestEnrollmentService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.guest_enrollment_repo = GuestEnrollmentRepository(db)

    def guest_enrollment_dict(self, item: GuestEnrollment) -> dict:
        return {
            "id": str(item.id),
            "content": item.content,
            "created_at": item.created_at,
            "updated_at": item.updated_at,
        }

    def get_guest_enrollments(self, query: PaginationParams) -> tuple[list[GuestEnrollment], int]:
        return self.guest_enrollment_repo.list_filtered(query)

    def get_guest_enrollment_by_id(self, guest_enrollment_id: str) -> GuestEnrollment:
        item = self.guest_enrollment_repo.get_active_by_id(guest_enrollment_id)
        if not item:
            raise HTTPException(status_code=404, detail="Guest enrollment not found")
        return item

    def create_guest_enrollment(self, content: str, commit: bool = True) -> GuestEnrollment:
        item = self.guest_enrollment_repo.create(GuestEnrollment(content=content.strip()))
        if commit:
            self.db.commit()
            self.db.refresh(item)
        return item

    def create_guest_enrollment_from_payload(self, payload: GuestEnrollmentCreate) -> GuestEnrollment:
        try:
            return self.create_guest_enrollment(payload.content, commit=True)
        except Exception:
            self.db.rollback()
            raise

    def update_guest_enrollment(self, guest_enrollment_id: str, payload: GuestEnrollmentUpdate) -> GuestEnrollment:
        try:
            item = self.get_guest_enrollment_by_id(guest_enrollment_id)
            if payload.content is not None:
                item.content = payload.content.strip()
            updated = self.guest_enrollment_repo.update(item)
            self.db.commit()
            return updated
        except Exception:
            self.db.rollback()
            raise

    def delete_guest_enrollment(self, guest_enrollment_id: str) -> None:
        try:
            item = self.get_guest_enrollment_by_id(guest_enrollment_id)
            self.guest_enrollment_repo.soft_delete(item)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

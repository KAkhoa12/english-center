from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.assignment_type import AssignmentType, AssignmentTypeStatus
from app.repositories.assignment_type import AssignmentTypeRepository
from app.schemas.assignment import AssignmentTypeCreate, AssignmentTypeUpdate
from app.schemas.common import PaginationParams


def _enum_status(value: str | None) -> AssignmentTypeStatus | None:
    if value is None:
        return None
    try:
        return AssignmentTypeStatus(value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid assignment type status") from exc


class AssignmentTypeService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.assignment_type_repo = AssignmentTypeRepository(db)

    def assignment_type_dict(self, item: AssignmentType) -> dict:
        return {
            "id": str(item.id),
            "code": item.code,
            "name": item.name,
            "description": item.description,
            "is_auto_gradable": item.is_auto_gradable,
            "requires_file_submission": item.requires_file_submission,
            "allow_text_submission": item.allow_text_submission,
            "allow_file_submission": item.allow_file_submission,
            "status": item.status.value,
            "created_at": item.created_at,
            "updated_at": item.updated_at,
        }

    def list_assignment_types(
        self,
        query: PaginationParams,
        status: str | None = None,
    ) -> tuple[list[AssignmentType], int]:
        return self.assignment_type_repo.list_filtered(query, _enum_status(status) if status else None)

    def get_assignment_type(self, assignment_type_id: str) -> AssignmentType:
        item = self.assignment_type_repo.get_active_by_id(assignment_type_id)
        if not item:
            raise HTTPException(status_code=404, detail="Assignment type not found")
        return item

    def create_assignment_type(self, payload: AssignmentTypeCreate) -> AssignmentType:
        try:
            if self.assignment_type_repo.code_exists(payload.code):
                raise HTTPException(status_code=400, detail="Assignment type code already exists")
            item = AssignmentType(
                code=payload.code.strip(),
                name=payload.name.strip(),
                description=payload.description,
                is_auto_gradable=payload.is_auto_gradable,
                requires_file_submission=payload.requires_file_submission,
                allow_text_submission=payload.allow_text_submission,
                allow_file_submission=payload.allow_file_submission,
                status=_enum_status(payload.status),
            )
            created = self.assignment_type_repo.create(item)
            self.db.commit()
            return created
        except Exception:
            self.db.rollback()
            raise

    def update_assignment_type(self, assignment_type_id: str, payload: AssignmentTypeUpdate) -> AssignmentType:
        try:
            item = self.get_assignment_type(assignment_type_id)
            if payload.code is not None and payload.code != item.code:
                if self.assignment_type_repo.code_exists(payload.code, exclude_assignment_type_id=assignment_type_id):
                    raise HTTPException(status_code=400, detail="Assignment type code already exists")
                item.code = payload.code.strip()
            for field in [
                "name",
                "description",
                "is_auto_gradable",
                "requires_file_submission",
                "allow_text_submission",
                "allow_file_submission",
            ]:
                value = getattr(payload, field)
                if value is not None:
                    setattr(item, field, value.strip() if isinstance(value, str) else value)
            if payload.status is not None:
                item.status = _enum_status(payload.status)
            updated = self.assignment_type_repo.update(item)
            self.db.commit()
            return updated
        except Exception:
            self.db.rollback()
            raise

    def soft_delete_assignment_type(self, assignment_type_id: str) -> None:
        try:
            item = self.get_assignment_type(assignment_type_id)
            self.assignment_type_repo.soft_delete(item)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

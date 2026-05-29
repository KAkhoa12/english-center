from datetime import datetime

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.assignment import Assignment, AssignmentStatus, AssignmentType
from app.models.class_student import ClassStudent
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class AssignmentRepository(BaseRepository[Assignment]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, Assignment)

    def list_by_class_id(self, class_id: str) -> list[Assignment]:
        return list(
            self.db.execute(
                select(Assignment)
                .where(Assignment.class_id == class_id, Assignment.deleted_at.is_(None))
                .order_by(Assignment.created_at.desc())
            ).scalars().all()
        )

    def list_by_session_id(self, session_id: str) -> list[Assignment]:
        return list(
            self.db.execute(
                select(Assignment)
                .where(Assignment.session_id == session_id, Assignment.deleted_at.is_(None))
                .order_by(Assignment.created_at.desc())
            ).scalars().all()
        )

    def get_active_by_id(self, assignment_id: str) -> Assignment | None:
        return self.get(assignment_id)

    def list_filtered_by_class(
        self,
        class_id: str,
        query: PaginationParams,
        status: AssignmentStatus | None = None,
        assignment_type: AssignmentType | None = None,
        session_id: str | None = None,
        lesson_id: str | None = None,
        due_from: datetime | None = None,
        due_to: datetime | None = None,
        only_published: bool = False,
    ) -> tuple[list[Assignment], int]:
        filters = [Assignment.class_id == class_id]
        if only_published:
            filters.append(Assignment.status == AssignmentStatus.published)
        if status:
            filters.append(Assignment.status == status)
        if assignment_type:
            filters.append(Assignment.assignment_type == assignment_type)
        if session_id:
            filters.append(Assignment.session_id == session_id)
        if lesson_id:
            filters.append(Assignment.lesson_id == lesson_id)
        if due_from:
            filters.append(Assignment.due_at >= due_from)
        if due_to:
            filters.append(Assignment.due_at <= due_to)
        if query.search:
            term = f"%{query.search}%"
            filters.append(or_(Assignment.title.ilike(term), Assignment.description.ilike(term)))

        sort_field = getattr(Assignment, query.sort_by, Assignment.created_at) if query.sort_by else Assignment.created_at
        order_by = sort_field.asc() if query.sort_order == "asc" else sort_field.desc()
        skip = (query.page - 1) * query.page_size
        total = self.count(filters=filters)
        items = self.list(filters=filters, skip=skip, limit=query.page_size, order_by=order_by)
        return items, total

    def list_my_published_assignments(
        self,
        student_id: str,
        query: PaginationParams,
        status: AssignmentStatus | None = None,
        assignment_type: AssignmentType | None = None,
        class_id: str | None = None,
    ) -> list[Assignment]:
        stmt = (
            select(Assignment)
            .join(ClassStudent, ClassStudent.class_id == Assignment.class_id)
            .where(
                ClassStudent.student_id == student_id,
                ClassStudent.deleted_at.is_(None),
                Assignment.deleted_at.is_(None),
                Assignment.status == AssignmentStatus.published,
            )
        )
        if class_id:
            stmt = stmt.where(Assignment.class_id == class_id)
        if status:
            stmt = stmt.where(Assignment.status == status)
        if assignment_type:
            stmt = stmt.where(Assignment.assignment_type == assignment_type)
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(or_(Assignment.title.ilike(term), Assignment.description.ilike(term)))
        stmt = stmt.order_by(Assignment.due_at.asc().nullslast(), Assignment.created_at.desc())
        return list(self.db.execute(stmt).scalars().all())

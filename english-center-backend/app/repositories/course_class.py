from datetime import date

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.class_model import CourseClass
from app.repositories.base import BaseRepository
from app.schemas.common import PaginationParams


class CourseClassRepository(BaseRepository[CourseClass]):
    def __init__(self, db: Session) -> None:
        super().__init__(db, CourseClass)

    def get_by_code(self, code: str) -> CourseClass | None:
        return self.db.execute(
            select(CourseClass).where(CourseClass.code == code, CourseClass.deleted_at.is_(None))
        ).scalar_one_or_none()

    def list_by_course_id(self, course_id: str) -> list[CourseClass]:
        return list(
            self.db.execute(
                select(CourseClass)
                .where(CourseClass.course_id == course_id, CourseClass.deleted_at.is_(None))
                .order_by(CourseClass.created_at.desc())
            ).scalars().all()
        )

    def list_by_teacher_id(self, teacher_id: str) -> list[CourseClass]:
        return list(
            self.db.execute(
                select(CourseClass)
                .where(CourseClass.teacher_id == teacher_id, CourseClass.deleted_at.is_(None))
                .order_by(CourseClass.created_at.desc())
            ).scalars().all()
        )

    def get_active_by_id(self, class_id: str) -> CourseClass | None:
        return self.get(class_id)

    def exists_by_code(self, code: str, exclude_id: str | None = None) -> bool:
        stmt = select(CourseClass.id).where(CourseClass.code == code, CourseClass.deleted_at.is_(None))
        if exclude_id:
            stmt = stmt.where(CourseClass.id != exclude_id)
        return self.db.execute(stmt).first() is not None

    def count_by_code_prefix(self, code_prefix: str) -> int:
        return int(
            self.db.execute(
                select(func.count()).select_from(CourseClass).where(
                    CourseClass.deleted_at.is_(None),
                    CourseClass.code.ilike(f"{code_prefix}%"),
                )
            ).scalar_one()
        )

    def list_filtered(
        self,
        query: PaginationParams,
        course_id: str | None = None,
        teacher_id: str | None = None,
        status=None,
        class_type=None,
        start_date_from: date | None = None,
        start_date_to: date | None = None,
    ) -> tuple[list[CourseClass], int]:
        filters = []
        if course_id:
            filters.append(CourseClass.course_id == course_id)
        if teacher_id:
            filters.append(CourseClass.teacher_id == teacher_id)
        if status:
            filters.append(CourseClass.status == status)
        if class_type:
            filters.append(CourseClass.class_type == class_type)
        if start_date_from:
            filters.append(CourseClass.start_date >= start_date_from)
        if start_date_to:
            filters.append(CourseClass.start_date <= start_date_to)
        if query.search:
            term = f"%{query.search}%"
            filters.append(or_(CourseClass.name.ilike(term), CourseClass.code.ilike(term)))

        sort_field = getattr(CourseClass, query.sort_by, CourseClass.created_at) if query.sort_by else CourseClass.created_at
        order_by = sort_field.asc() if query.sort_order == "asc" else sort_field.desc()
        skip = (query.page - 1) * query.page_size

        total = self.count(filters=filters)
        items = self.list(filters=filters, skip=skip, limit=query.page_size, order_by=order_by)
        return items, total

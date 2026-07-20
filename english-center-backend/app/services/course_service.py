import re
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy import update
from sqlalchemy.orm import Session

from app.models.course import (
    Course,
    CourseCategory,
    CourseMedia,
    CourseStatus,
    CourseTargetLevel,
    Media,
)
from app.core.config import settings
from app.schemas.common import PaginationParams
from app.schemas.course import (
    CourseCategoryCreate,
    CourseCategoryUpdate,
    CourseCreate,
    CourseMediaCreate,
    CourseMediaUpdate,
    CourseUpdate,
)
from app.repositories.course_media import CourseMediaRepository
from app.repositories.course import CourseRepository
from app.repositories.course_category import CourseCategoryRepository
from app.repositories.course_class import CourseClassRepository
from app.repositories.course_enrollment import CourseEnrollmentRepository
from app.repositories.class_student import ClassStudentRepository
from app.repositories.media import MediaRepository
from app.services.media_service import MediaService
from app.services.storage_service import StorageService


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _enum(enum_cls, value: str | None, field_name: str):
    if value is None:
        return None
    normalized_value = value.strip() if isinstance(value, str) else value
    if enum_cls is CourseTargetLevel and isinstance(normalized_value, str):
        normalized_value = normalized_value.upper()
    try:
        return enum_cls(normalized_value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid {field_name}") from exc


class CourseSerializationMixin:
    def _media_url(self, media: Media) -> str | None:
        try:
            return StorageService().get_presigned_url(media.bucket, media.object_name)
        except HTTPException:
            return None

    def _course_primary_media(self, course_id: str) -> CourseMedia | None:
        return self.course_media_repo.get_primary_by_course(course_id)

    def _category_dict(self, category: CourseCategory) -> dict[str, Any]:
        return {"id": str(category.id), "name": category.name, "slug": category.slug}

    def _media_dict(self, media: Media) -> dict[str, Any]:
        return {
            "id": str(media.id),
            "folder": media.folder,
            "original_filename": media.original_filename,
            "content_type": media.content_type,
            "size": media.size,
            "url": self._media_url(media),
        }

    def _course_base_dict(self, course: Course) -> dict[str, Any]:
        category = self.category_repo.get(str(course.category_id))
        primary_mapping = self._course_primary_media(str(course.id))
        primary_media = None
        if primary_mapping:
            primary_media = self.media_repo.get_active_by_id(str(primary_mapping.media_id))
        return {
            "id": str(course.id),
            "name": course.name,
            "code": course.code,
            "slug": course.slug,
            "description": course.description,
            "category": self._category_dict(category) if category else None,
            "target_level": course.target_level.value if course.target_level else None,
            "total_sessions": course.total_sessions,
            "total_duration_time": course.total_duration_time,
            "price": float(course.price),
            "discount_price": float(course.discount_price) if course.discount_price is not None else None,
            "status": course.status.value,
            "thumbnail_url": self._media_url(primary_media) if primary_media else None,
            "thumbnail": self._media_dict(primary_media) if primary_media else None,
            "created_at": course.created_at,
            "updated_at": course.updated_at,
        }


class CourseCategoryService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.category_repo = CourseCategoryRepository(db)
        self.course_repo = CourseRepository(db)

    def create_category(self, payload: CourseCategoryCreate) -> CourseCategory:
        slug = payload.slug or slugify(payload.name)
        if self.category_repo.get_by_name(payload.name) or self.category_repo.get_by_slug(slug):
            raise HTTPException(status_code=400, detail="Category name or slug already exists")
        category = CourseCategory(name=payload.name, slug=slug, description=payload.description, status=payload.status or "active")
        self.category_repo.create(category)
        self.db.commit()
        return category

    def get_categories(self, query: PaginationParams, status: str | None = None) -> tuple[list[CourseCategory], int]:
        items = self.category_repo.list_filtered(query.search, status)
        sort_field_name = query.sort_by if query.sort_by and hasattr(CourseCategory, query.sort_by) else "created_at"
        reverse = query.sort_order != "asc"
        items.sort(key=lambda x: getattr(x, sort_field_name), reverse=reverse)
        total = len(items)
        start = (query.page - 1) * query.page_size
        end = start + query.page_size
        return items[start:end], total

    def get_category_by_id(self, category_id: str) -> CourseCategory:
        category = self.category_repo.get(category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Course category not found")
        return category

    def update_category(self, category_id: str, payload: CourseCategoryUpdate) -> CourseCategory:
        category = self.get_category_by_id(category_id)
        if payload.name is not None:
            category.name = payload.name.strip()
            if payload.slug is None:
                category.slug = slugify(payload.name)
        if payload.slug is not None:
            category.slug = payload.slug
        if payload.description is not None:
            category.description = payload.description
        if payload.status is not None:
            category.status = payload.status
        self.db.commit()
        self.db.refresh(category)
        return category

    def soft_delete_category(self, category_id: str) -> None:
        category = self.get_category_by_id(category_id)
        in_use = self.course_repo.count(filters=[Course.category_id == category_id]) > 0
        if in_use:
            raise HTTPException(status_code=400, detail="Category is used by courses")
        category.deleted_at = _now()
        self.db.commit()


class CourseService(CourseSerializationMixin):
    def __init__(self, db: Session) -> None:
        self.db = db
        self.course_repo = CourseRepository(db)
        self.category_repo = CourseCategoryRepository(db)
        self.media_repo = MediaRepository(db)
        self.course_media_repo = CourseMediaRepository(db)
        self.class_repo = CourseClassRepository(db)
        self.class_student_repo = ClassStudentRepository(db)
        self.enrollment_repo = CourseEnrollmentRepository(db)

    def _validate_category(self, category_id: str) -> CourseCategory:
        item = self.category_repo.get(category_id)
        if not item:
            raise HTTPException(status_code=404, detail="Course category not found")
        return item

    def create_course(self, payload: CourseCreate) -> Course:
        slug = payload.slug or slugify(payload.name)
        exists = self.course_repo.get_by_code(payload.code) or self.course_repo.get_by_slug(slug)
        if exists:
            raise HTTPException(status_code=400, detail="Course code or slug already exists")
        self._validate_category(payload.category_id)
        course = Course(
            name=payload.name,
            code=payload.code,
            slug=slug,
            description=payload.description,
            category_id=payload.category_id,
            target_level=_enum(CourseTargetLevel, payload.target_level, "target_level"),
            output_goal=payload.output_goal,
            total_duration_time=payload.total_duration_time,
            requirements=[
                {
                    "id": str(uuid4()),
                    "requirement_text": text.strip(),
                    "order_index": index,
                }
                for index, text in enumerate(payload.requirements or [])
                if text.strip()
            ],
            outcomes=[
                {
                    "id": str(uuid4()),
                    "outcome_text": text.strip(),
                    "order_index": index,
                }
                for index, text in enumerate(payload.outcomes or [])
                if text.strip()
            ],
            total_sessions=payload.total_sessions,
            price=payload.price,
            discount_price=payload.discount_price,
            status=_enum(CourseStatus, payload.status, "status"),
        )
        self.course_repo.create(course)
        self.db.commit()
        self.db.refresh(course)
        return course

    def get_course_by_id(self, course_id: str) -> Course:
        course = self.course_repo.get_active_by_id(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course

    def get_course_by_slug(self, slug: str) -> Course:
        course = self.course_repo.get_by_slug(slug)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course

    def get_courses(
        self,
        query: PaginationParams,
        status: str | None = None,
        target_level: str | None = None,
        category_id: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
    ) -> tuple[list[dict[str, Any]], int]:
        courses = self.course_repo.list_filtered(
            search=query.search,
            status=_enum(CourseStatus, status, "status") if status else None,
            target_level=_enum(CourseTargetLevel, target_level, "target_level") if target_level else None,
            category_id=category_id,
            min_price=min_price,
            max_price=max_price,
        )
        sort_field_name = query.sort_by if query.sort_by and hasattr(Course, query.sort_by) else "created_at"
        reverse = query.sort_order != "asc"
        courses.sort(key=lambda x: getattr(x, sort_field_name), reverse=reverse)
        total = len(courses)
        start = (query.page - 1) * query.page_size
        end = start + query.page_size
        return [self.course_list_dict(course) for course in courses[start:end]], total

    def course_list_dict(self, course: Course) -> dict[str, Any]:
        data = self._course_base_dict(course)
        data["category_id"] = str(course.category_id)
        data["media"] = [self._course_media_dict(item) for item in self.get_course_media(str(course.id))]
        return data

    def course_detail_dict(self, course: Course) -> dict[str, Any]:
        data = self.course_list_dict(course)
        data.update(
            {
                "output_goal": course.output_goal,
                "requirements": course.requirements or [],
                "outcomes": course.outcomes or [],
                "media": [self._course_media_dict(item) for item in self.get_course_media(str(course.id))],
            }
        )
        return data

    def get_course_statistics(self) -> list[dict[str, Any]]:
        courses = self.course_repo.list_filtered()
        courses.sort(key=lambda item: item.created_at, reverse=True)
        results: list[dict[str, Any]] = []
        for course in courses:
            course_data = self.course_list_dict(course)
            total_enrollments = self.enrollment_repo.count_by_course_id(str(course.id))
            classes = self.class_repo.list_by_course_id(str(course.id))
            class_rows = [
                {
                    "id": str(class_obj.id),
                    "name": class_obj.name,
                    "code": class_obj.code,
                    "status": class_obj.status.value,
                    "max_students": class_obj.max_students,
                    "students_count": self.class_student_repo.count_active_students(str(class_obj.id)),
                }
                for class_obj in classes
            ]
            results.append({
                "course": course_data,
                "total_enrollments": total_enrollments,
                "classes_count": len(class_rows),
                "total_class_students": sum(row["students_count"] for row in class_rows),
                "classes": class_rows,
            })
        return results

    def update_course(self, course_id: str, payload: CourseUpdate) -> Course:
        course = self.get_course_by_id(course_id)
        if payload.code and payload.code != course.code:
            exists = self.course_repo.get_by_code(payload.code)
            if exists:
                raise HTTPException(status_code=400, detail="Course code already exists")
            course.code = payload.code
        for field in [
            "description",
            "output_goal",
            "total_duration_time",
            "total_sessions",
            "price",
            "discount_price",
        ]:
            value = getattr(payload, field)
            if value is not None:
                setattr(course, field, value)
        resolved_name = payload.name if payload.name is not None else payload.title
        if resolved_name is not None:
            course.name = resolved_name.strip()
            if payload.slug is None:
                course.slug = slugify(resolved_name)
        if payload.slug is not None:
            course.slug = payload.slug
        if payload.target_level is not None:
            course.target_level = _enum(CourseTargetLevel, payload.target_level, "target_level")
        if payload.category_id is not None:
            self._validate_category(payload.category_id)
            course.category_id = payload.category_id
        if payload.status is not None:
            course.status = _enum(CourseStatus, payload.status, "status")
        self.db.commit()
        self.db.refresh(course)
        return course

    def upload_course_thumbnail(self, course_id: str, file, file_size: int) -> dict[str, Any]:
        course = self.get_course_by_id(course_id)
        media = MediaService(self.db).upload_media(
            bucket_name=settings.MINIO_BUCKET_AVATARS,
            file=file,
            file_size=file_size,
            folder=f"courses/{course_id}",
        )
        self.db.execute(
            update(CourseMedia)
            .where(CourseMedia.course_id == course.id, CourseMedia.media_type == "thumbnail", CourseMedia.deleted_at.is_(None))
            .values(is_primary=False)
        )
        mapping = CourseMedia(
            course_id=course.id,
            media_id=media.id,
            media_type="thumbnail",
            order_index=0,
            is_primary=True,
        )
        self.db.add(mapping)
        self.db.commit()

        return {
            "course_id": str(course.id),
            "thumbnail_url": self._media_url(media),
            "media": self._media_dict(media),
        }

    def soft_delete_course(self, course_id: str) -> None:
        course = self.get_course_by_id(course_id)
        course.deleted_at = _now()
        self.db.commit()

    def _course_media_dict(self, mapping: CourseMedia) -> dict[str, Any]:
        media = self.media_repo.get_active_by_id(str(mapping.media_id))
        return {
            "id": str(mapping.id),
            "course_id": str(mapping.course_id),
            "media_id": str(mapping.media_id),
            "media_type": mapping.media_type,
            "order_index": mapping.order_index,
            "is_primary": mapping.is_primary,
            "media": self._media_dict(media) if media else None,
        }

    def get_course_media(self, course_id: str) -> list[CourseMedia]:
        return self.course_media_repo.get_active_by_course(course_id)


class CourseMediaService(CourseSerializationMixin):
    def __init__(self, db: Session) -> None:
        self.db = db
        self.media_repo = MediaRepository(db)
        self.course_media_repo = CourseMediaRepository(db)

    def _get_course_media_by_id(self, course_media_id: str) -> CourseMedia:
        item = self.course_media_repo.get_active_by_id(course_media_id)
        if not item:
            raise HTTPException(status_code=404, detail="Course media not found")
        return item

    def _get_media_by_id(self, media_id: str) -> Media:
        item = self.media_repo.get_active_by_id(media_id)
        if not item:
            raise HTTPException(status_code=404, detail="Media not found")
        return item

    def _unset_primary(self, course_id: str, media_type: str | None) -> None:
        stmt = update(CourseMedia).where(CourseMedia.course_id == course_id, CourseMedia.deleted_at.is_(None))
        if media_type is None:
            stmt = stmt.where(CourseMedia.media_type.is_(None))
        else:
            stmt = stmt.where(CourseMedia.media_type == media_type)
        self.db.execute(stmt.values(is_primary=False))

    def attach_media(self, course_id: str, payload: CourseMediaCreate) -> dict[str, Any]:
        CourseService(self.db).get_course_by_id(course_id)
        media = self._get_media_by_id(payload.media_id)
        if payload.is_primary:
            self._unset_primary(course_id, payload.media_type)
        mapping = CourseMedia(
            course_id=course_id,
            media_id=media.id,
            media_type=payload.media_type,
            order_index=payload.order_index,
            is_primary=payload.is_primary,
        )
        self.db.add(mapping)
        self.db.commit()
        self.db.refresh(mapping)
        return CourseService(self.db)._course_media_dict(mapping)

    def list_media(self, course_id: str) -> list[dict[str, Any]]:
        CourseService(self.db).get_course_by_id(course_id)
        items = self.course_media_repo.get_active_by_course(course_id)
        return [CourseService(self.db)._course_media_dict(item) for item in items]

    def update_media(self, course_media_id: str, payload: CourseMediaUpdate) -> dict[str, Any]:
        item = self._get_course_media_by_id(course_media_id)
        if payload.media_type is not None:
            item.media_type = payload.media_type
        if payload.order_index is not None:
            item.order_index = payload.order_index
        if payload.is_primary is not None:
            if payload.is_primary:
                self._unset_primary(str(item.course_id), item.media_type)
            item.is_primary = payload.is_primary
        self.db.commit()
        self.db.refresh(item)
        return CourseService(self.db)._course_media_dict(item)

    def delete_media(self, course_media_id: str) -> None:
        item = self._get_course_media_by_id(course_media_id)
        item.deleted_at = _now()
        self.db.commit()

    def upload_and_attach_media(
        self,
        course_id: str,
        file,
        file_size: int,
        media_type: str | None = None,
        is_primary: bool = False,
        order_index: int = 0,
    ) -> dict[str, Any]:
        CourseService(self.db).get_course_by_id(course_id)
        media = MediaService(self.db).upload_media(
            bucket_name=settings.MINIO_BUCKET_AVATARS,
            file=file,
            file_size=file_size,
            folder=f"courses/{course_id}",
        )
        if is_primary:
            self._unset_primary(course_id, media_type)
        mapping = CourseMedia(
            course_id=course_id,
            media_id=media.id,
            media_type=media_type,
            order_index=order_index,
            is_primary=is_primary,
        )
        self.db.add(mapping)
        self.db.commit()
        self.db.refresh(mapping)
        return CourseService(self.db)._course_media_dict(mapping)

    def upload_and_attach_media_many(
        self,
        course_id: str,
        files: list[Any],
        media_type: str | None = "gallery",
    ) -> list[dict[str, Any]]:
        CourseService(self.db).get_course_by_id(course_id)
        existing = self.course_media_repo.get_active_by_course(course_id)
        next_order_index = (max((item.order_index or 0 for item in existing), default=-1) + 1) if existing else 0
        items: list[dict[str, Any]] = []

        for offset, file in enumerate(files):
            size = getattr(file, "_size", None)
            if size is None:
                size = getattr(file, "size", None)
            if size is None:
                current = file.file.tell()
                file.file.seek(0, 2)
                size = file.file.tell()
                file.file.seek(current)
            media = MediaService(self.db).upload_media(
                bucket_name=settings.MINIO_BUCKET_AVATARS,
                file=file,
                file_size=size,
                folder=f"courses/{course_id}",
            )
            mapping = CourseMedia(
                course_id=course_id,
                media_id=media.id,
                media_type=media_type,
                order_index=next_order_index + offset,
                is_primary=False,
            )
            self.db.add(mapping)
            self.db.commit()
            self.db.refresh(mapping)
            items.append(CourseService(self.db)._course_media_dict(mapping))

        return items

import re
from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException
from sqlalchemy import func, or_, select, update
from sqlalchemy.orm import Session

from app.models.course import (
    CategoryStatus,
    Course,
    CourseCategory,
    CourseMedia,
    CourseMode,
    CourseModule,
    CourseModuleStatus,
    CourseOutcome,
    CourseRequirement,
    CourseStatus,
    CourseTag,
    CourseTagMapping,
    CourseTargetLevel,
    Lesson,
    LessonMaterial,
    LessonStatus,
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
    CourseModuleCreate,
    CourseModuleUpdate,
    CourseOutcomeCreate,
    CourseOutcomeUpdate,
    CourseRequirementCreate,
    CourseRequirementUpdate,
    CourseTagCreate,
    CourseTagUpdate,
    CourseUpdate,
    LessonCreate,
    LessonMaterialCreate,
    LessonMaterialUpdate,
    LessonUpdate,
)
from app.repositories.course_media import CourseMediaRepository
from app.repositories.media import MediaRepository
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
        return (
            self.db.execute(
                select(CourseMedia)
                .where(
                    CourseMedia.course_id == course_id,
                    CourseMedia.deleted_at.is_(None),
                    CourseMedia.is_primary.is_(True),
                )
                .order_by(CourseMedia.order_index.asc(), CourseMedia.created_at.asc())
            )
            .scalars()
            .first()
        )

    def _category_dict(self, category: CourseCategory) -> dict[str, Any]:
        return {"id": str(category.id), "name": category.name, "slug": category.slug}

    def _tag_dict(self, tag: CourseTag) -> dict[str, Any]:
        return {"id": str(tag.id), "name": tag.name, "slug": tag.slug}

    def _media_dict(self, media: Media) -> dict[str, Any]:
        return {
            "id": str(media.id),
            "bucket": media.bucket,
            "object_name": media.object_name,
            "original_filename": media.original_filename,
            "content_type": media.content_type,
            "size": media.size,
            "url": self._media_url(media),
        }

    def _requirement_dict(self, item: CourseRequirement) -> dict[str, Any]:
        return {
            "id": str(item.id),
            "course_id": str(item.course_id),
            "requirement_text": item.requirement_text,
            "order_index": item.order_index,
        }

    def _outcome_dict(self, item: CourseOutcome) -> dict[str, Any]:
        return {
            "id": str(item.id),
            "course_id": str(item.course_id),
            "outcome_text": item.outcome_text,
            "order_index": item.order_index,
        }

    def _module_dict(self, item: CourseModule) -> dict[str, Any]:
        media = None
        if item.media_id:
            media = self.db.execute(select(Media).where(Media.id == item.media_id, Media.deleted_at.is_(None))).scalar_one_or_none()
        return {
            "id": str(item.id),
            "course_id": str(item.course_id),
            "title": item.title,
            "description": item.description,
            "media_id": str(item.media_id) if item.media_id else None,
            "media": self._media_dict(media) if media else None,
            "order_index": item.order_index,
            "status": item.status.value,
        }

    def _course_base_dict(self, course: Course) -> dict[str, Any]:
        category = self.db.execute(
            select(CourseCategory).where(CourseCategory.id == course.category_id, CourseCategory.deleted_at.is_(None))
        ).scalar_one_or_none()
        primary_mapping = self._course_primary_media(str(course.id))
        primary_media = None
        if primary_mapping:
            primary_media = self.db.execute(
                select(Media).where(Media.id == primary_mapping.media_id, Media.deleted_at.is_(None))
            ).scalar_one_or_none()
        return {
            "id": str(course.id),
            "name": course.name,
            "code": course.code,
            "slug": course.slug,
            "description": course.description,
            "category": self._category_dict(category) if category else None,
            "mode": course.mode.value,
            "target_level": course.target_level.value if course.target_level else None,
            "duration_weeks": course.duration_weeks,
            "total_sessions": course.total_sessions,
            "price": float(course.price),
            "status": course.status.value,
            "thumbnail_url": self._media_url(primary_media) if primary_media else None,
            "thumbnail": self._media_dict(primary_media) if primary_media else None,
            "created_at": course.created_at,
            "updated_at": course.updated_at,
        }


class CourseCategoryService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_category(self, payload: CourseCategoryCreate) -> CourseCategory:
        slug = payload.slug or slugify(payload.name)
        exists = self.db.execute(
            select(CourseCategory).where(
                CourseCategory.deleted_at.is_(None),
                or_(CourseCategory.name == payload.name, CourseCategory.slug == slug),
            )
        ).scalar_one_or_none()
        if exists:
            raise HTTPException(status_code=400, detail="Category name or slug already exists")
        category = CourseCategory(
            name=payload.name,
            slug=slug,
            description=payload.description,
            status=_enum(CategoryStatus, payload.status, "status"),
        )
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category

    def get_categories(self, query: PaginationParams, status: str | None = None) -> tuple[list[CourseCategory], int]:
        stmt = select(CourseCategory).where(CourseCategory.deleted_at.is_(None))
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(or_(CourseCategory.name.ilike(term), CourseCategory.slug.ilike(term)))
        if status:
            stmt = stmt.where(CourseCategory.status == _enum(CategoryStatus, status, "status"))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        sort_field = getattr(CourseCategory, query.sort_by, CourseCategory.created_at) if query.sort_by else CourseCategory.created_at
        stmt = stmt.order_by(sort_field.asc() if query.sort_order == "asc" else sort_field.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def get_category_by_id(self, category_id: str) -> CourseCategory:
        category = self.db.execute(
            select(CourseCategory).where(CourseCategory.id == category_id, CourseCategory.deleted_at.is_(None))
        ).scalar_one_or_none()
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
            category.status = _enum(CategoryStatus, payload.status, "status")
        self.db.commit()
        self.db.refresh(category)
        return category

    def soft_delete_category(self, category_id: str) -> None:
        category = self.get_category_by_id(category_id)
        in_use = self.db.execute(
            select(Course).where(Course.category_id == category_id, Course.deleted_at.is_(None))
        ).first()
        if in_use:
            raise HTTPException(status_code=400, detail="Category is used by courses")
        category.deleted_at = _now()
        self.db.commit()


class CourseTagService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_tag(self, payload: CourseTagCreate) -> CourseTag:
        slug = payload.slug or slugify(payload.name)
        exists = self.db.execute(
            select(CourseTag).where(
                CourseTag.deleted_at.is_(None),
                or_(CourseTag.name == payload.name, CourseTag.slug == slug),
            )
        ).scalar_one_or_none()
        if exists:
            raise HTTPException(status_code=400, detail="Tag name or slug already exists")
        tag = CourseTag(name=payload.name, slug=slug)
        self.db.add(tag)
        self.db.commit()
        self.db.refresh(tag)
        return tag

    def get_tags(self, query: PaginationParams) -> tuple[list[CourseTag], int]:
        stmt = select(CourseTag).where(CourseTag.deleted_at.is_(None))
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(or_(CourseTag.name.ilike(term), CourseTag.slug.ilike(term)))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        sort_field = getattr(CourseTag, query.sort_by, CourseTag.created_at) if query.sort_by else CourseTag.created_at
        stmt = stmt.order_by(sort_field.asc() if query.sort_order == "asc" else sort_field.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def get_tag_by_id(self, tag_id: str) -> CourseTag:
        tag = self.db.execute(select(CourseTag).where(CourseTag.id == tag_id, CourseTag.deleted_at.is_(None))).scalar_one_or_none()
        if not tag:
            raise HTTPException(status_code=404, detail="Course tag not found")
        return tag

    def update_tag(self, tag_id: str, payload: CourseTagUpdate) -> CourseTag:
        tag = self.get_tag_by_id(tag_id)
        if payload.name is not None:
            tag.name = payload.name.strip()
            if payload.slug is None:
                tag.slug = slugify(payload.name)
        if payload.slug is not None:
            tag.slug = payload.slug
        self.db.commit()
        self.db.refresh(tag)
        return tag

    def soft_delete_tag(self, tag_id: str) -> None:
        tag = self.get_tag_by_id(tag_id)
        tag.deleted_at = _now()
        self.db.commit()


class CourseService(CourseSerializationMixin):
    def __init__(self, db: Session) -> None:
        self.db = db

    def _validate_category(self, category_id: str) -> CourseCategory:
        item = self.db.execute(
            select(CourseCategory).where(CourseCategory.id == category_id, CourseCategory.deleted_at.is_(None))
        ).scalar_one_or_none()
        if not item:
            raise HTTPException(status_code=404, detail="Course category not found")
        return item

    def _validate_tags(self, tag_ids: list[str]) -> list[CourseTag]:
        if not tag_ids:
            return []
        items = self.db.execute(select(CourseTag).where(CourseTag.id.in_(tag_ids), CourseTag.deleted_at.is_(None))).scalars().all()
        if len(items) != len(set(tag_ids)):
            raise HTTPException(status_code=404, detail="One or more tags not found")
        return list(items)

    def create_course(self, payload: CourseCreate) -> Course:
        slug = payload.slug or slugify(payload.name)
        exists = self.db.execute(
            select(Course).where(Course.deleted_at.is_(None), or_(Course.code == payload.code, Course.slug == slug))
        ).scalar_one_or_none()
        if exists:
            raise HTTPException(status_code=400, detail="Course code or slug already exists")
        self._validate_category(payload.category_id)
        self._validate_tags(payload.tag_ids or [])
        course = Course(
            name=payload.name,
            code=payload.code,
            slug=slug,
            description=payload.description,
            category_id=payload.category_id,
            mode=_enum(CourseMode, payload.mode, "mode"),
            target_level=_enum(CourseTargetLevel, payload.target_level, "target_level"),
            output_goal=payload.output_goal,
            duration_weeks=payload.duration_weeks,
            total_sessions=payload.total_sessions,
            price=payload.price,
            status=_enum(CourseStatus, payload.status, "status"),
        )
        self.db.add(course)
        self.db.flush()
        self.replace_course_tags(str(course.id), payload.tag_ids or [], commit=False)
        for index, text in enumerate(payload.requirements or []):
            if text.strip():
                self.db.add(CourseRequirement(course_id=course.id, requirement_text=text.strip(), order_index=index))
        for index, text in enumerate(payload.outcomes or []):
            if text.strip():
                self.db.add(CourseOutcome(course_id=course.id, outcome_text=text.strip(), order_index=index))
        self.db.commit()
        self.db.refresh(course)
        return course

    def get_course_by_id(self, course_id: str) -> Course:
        course = self.db.execute(select(Course).where(Course.id == course_id, Course.deleted_at.is_(None))).scalar_one_or_none()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course

    def get_courses(
        self,
        query: PaginationParams,
        status: str | None = None,
        target_level: str | None = None,
        category_id: str | None = None,
        tag_id: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
    ) -> tuple[list[dict[str, Any]], int]:
        stmt = select(Course).where(Course.deleted_at.is_(None))
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(or_(Course.name.ilike(term), Course.code.ilike(term), Course.slug.ilike(term), Course.description.ilike(term)))
        if status:
            stmt = stmt.where(Course.status == _enum(CourseStatus, status, "status"))
        if target_level:
            stmt = stmt.where(Course.target_level == _enum(CourseTargetLevel, target_level, "target_level"))
        if min_price is not None:
            stmt = stmt.where(Course.price >= min_price)
        if max_price is not None:
            stmt = stmt.where(Course.price <= max_price)
        if category_id:
            stmt = stmt.where(Course.category_id == category_id)
        if tag_id:
            stmt = stmt.join(CourseTagMapping, CourseTagMapping.course_id == Course.id).where(
                CourseTagMapping.tag_id == tag_id,
                CourseTagMapping.deleted_at.is_(None),
            )
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        sort_field = getattr(Course, query.sort_by, Course.created_at) if query.sort_by else Course.created_at
        stmt = stmt.order_by(sort_field.asc() if query.sort_order == "asc" else sort_field.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        courses = list(self.db.execute(stmt).scalars().all())
        return [self.course_list_dict(course) for course in courses], int(total)

    def course_list_dict(self, course: Course) -> dict[str, Any]:
        data = self._course_base_dict(course)
        data["category_id"] = str(course.category_id)
        data["tags"] = [self._tag_dict(item) for item in self.get_course_tags(str(course.id))]
        data["media"] = [self._course_media_dict(item) for item in self.get_course_media(str(course.id))]
        return data

    def course_detail_dict(self, course: Course) -> dict[str, Any]:
        data = self.course_list_dict(course)
        data.update(
            {
                "output_goal": course.output_goal,
                "requirements": [self._requirement_dict(item) for item in self.get_course_requirements(str(course.id))],
                "outcomes": [self._outcome_dict(item) for item in self.get_course_outcomes(str(course.id))],
                "modules": [self._module_dict(item) for item in self.get_course_modules(str(course.id))],
                "media": [self._course_media_dict(item) for item in self.get_course_media(str(course.id))],
                "lessons_count": self.db.execute(
                    select(func.count()).select_from(Lesson).where(Lesson.course_id == course.id, Lesson.deleted_at.is_(None))
                ).scalar_one(),
            }
        )
        return data

    def update_course(self, course_id: str, payload: CourseUpdate) -> Course:
        course = self.get_course_by_id(course_id)
        if payload.code and payload.code != course.code:
            exists = self.db.execute(select(Course).where(Course.code == payload.code, Course.deleted_at.is_(None))).scalar_one_or_none()
            if exists:
                raise HTTPException(status_code=400, detail="Course code already exists")
            course.code = payload.code
        for field in [
            "description",
            "output_goal",
            "duration_weeks",
            "total_sessions",
            "price",
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
        if payload.mode is not None:
            course.mode = _enum(CourseMode, payload.mode, "mode")
        if payload.status is not None:
            course.status = _enum(CourseStatus, payload.status, "status")
        if payload.tag_ids is not None:
            self.replace_course_tags(course_id, payload.tag_ids, commit=False)
        self.db.commit()
        self.db.refresh(course)
        return course

    def upload_course_thumbnail(self, course_id: str, file, file_size: int) -> dict[str, Any]:
        course = self.get_course_by_id(course_id)

        uploaded = StorageService().upload_file(
            bucket_name=settings.MINIO_BUCKET_AVATARS,
            file=file,
            file_size=file_size,
            folder=f"courses/{course_id}",
        )
        media = Media(
            bucket=uploaded["bucket"],
            object_name=uploaded["object_name"],
            original_filename=file.filename,
            content_type=file.content_type,
            size=file_size,
            uploaded_by=None,
        )
        self.db.add(media)
        self.db.flush()
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
        self.db.refresh(media)

        return {
            "course_id": str(course.id),
            "thumbnail_url": self._media_url(media),
            "media": self._media_dict(media),
        }

    def soft_delete_course(self, course_id: str) -> None:
        course = self.get_course_by_id(course_id)
        course.deleted_at = _now()
        self.db.commit()

    def replace_course_tags(self, course_id: str, tag_ids: list[str], commit: bool = True) -> None:
        self._validate_tags(tag_ids)
        active = self.db.execute(
            select(CourseTagMapping).where(CourseTagMapping.course_id == course_id, CourseTagMapping.deleted_at.is_(None))
        ).scalars().all()
        for mapping in active:
            mapping.deleted_at = _now()
        for tag_id in set(tag_ids):
            existing = self.db.execute(
                select(CourseTagMapping).where(
                    CourseTagMapping.course_id == course_id,
                    CourseTagMapping.tag_id == tag_id,
                )
            ).scalar_one_or_none()
            if existing:
                existing.deleted_at = None
            else:
                self.db.add(CourseTagMapping(course_id=course_id, tag_id=tag_id))
        if commit:
            self.db.commit()

    def _course_media_dict(self, mapping: CourseMedia) -> dict[str, Any]:
        media = self.db.execute(select(Media).where(Media.id == mapping.media_id, Media.deleted_at.is_(None))).scalar_one_or_none()
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
        return list(
            self.db.execute(
                select(CourseMedia)
                .where(CourseMedia.course_id == course_id, CourseMedia.deleted_at.is_(None))
                .order_by(CourseMedia.order_index.asc(), CourseMedia.created_at.asc())
            ).scalars().all()
        )

    def get_course_tags(self, course_id: str) -> list[CourseTag]:
        stmt = (
            select(CourseTag)
            .join(CourseTagMapping, CourseTagMapping.tag_id == CourseTag.id)
            .where(CourseTagMapping.course_id == course_id, CourseTagMapping.deleted_at.is_(None), CourseTag.deleted_at.is_(None))
        )
        return list(self.db.execute(stmt).scalars().all())

    def get_course_requirements(self, course_id: str) -> list[CourseRequirement]:
        return list(
            self.db.execute(
                select(CourseRequirement)
                .where(CourseRequirement.course_id == course_id, CourseRequirement.deleted_at.is_(None))
                .order_by(CourseRequirement.order_index.asc())
            ).scalars().all()
        )

    def get_course_outcomes(self, course_id: str) -> list[CourseOutcome]:
        return list(
            self.db.execute(
                select(CourseOutcome)
                .where(CourseOutcome.course_id == course_id, CourseOutcome.deleted_at.is_(None))
                .order_by(CourseOutcome.order_index.asc())
            ).scalars().all()
        )

    def get_course_modules(self, course_id: str) -> list[CourseModule]:
        return list(
            self.db.execute(
                select(CourseModule).where(CourseModule.course_id == course_id, CourseModule.deleted_at.is_(None)).order_by(CourseModule.order_index.asc())
            ).scalars().all()
        )


class CourseRequirementService(CourseSerializationMixin):
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_requirement(self, course_id: str, payload: CourseRequirementCreate) -> CourseRequirement:
        CourseService(self.db).get_course_by_id(course_id)
        item = CourseRequirement(course_id=course_id, requirement_text=payload.requirement_text, order_index=payload.order_index)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def get_requirements_by_course(self, course_id: str) -> list[CourseRequirement]:
        CourseService(self.db).get_course_by_id(course_id)
        return CourseService(self.db).get_course_requirements(course_id)

    def get_requirement_by_id(self, requirement_id: str) -> CourseRequirement:
        item = self.db.execute(
            select(CourseRequirement).where(CourseRequirement.id == requirement_id, CourseRequirement.deleted_at.is_(None))
        ).scalar_one_or_none()
        if not item:
            raise HTTPException(status_code=404, detail="Course requirement not found")
        return item

    def update_requirement(self, requirement_id: str, payload: CourseRequirementUpdate) -> CourseRequirement:
        item = self.get_requirement_by_id(requirement_id)
        if payload.requirement_text is not None:
            item.requirement_text = payload.requirement_text
        if payload.order_index is not None:
            item.order_index = payload.order_index
        self.db.commit()
        self.db.refresh(item)
        return item

    def soft_delete_requirement(self, requirement_id: str) -> None:
        item = self.get_requirement_by_id(requirement_id)
        item.deleted_at = _now()
        self.db.commit()


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
        uploaded = StorageService().upload_file(
            bucket_name=settings.MINIO_BUCKET_AVATARS,
            file=file,
            file_size=file_size,
            folder=f"courses/{course_id}",
        )
        media = Media(
            bucket=uploaded["bucket"],
            object_name=uploaded["object_name"],
            original_filename=file.filename,
            content_type=file.content_type,
            size=file_size,
            uploaded_by=None,
        )
        self.db.add(media)
        self.db.flush()
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


class CourseOutcomeService(CourseSerializationMixin):
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_outcome(self, course_id: str, payload: CourseOutcomeCreate) -> CourseOutcome:
        CourseService(self.db).get_course_by_id(course_id)
        item = CourseOutcome(course_id=course_id, outcome_text=payload.outcome_text, order_index=payload.order_index)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def get_outcomes_by_course(self, course_id: str) -> list[CourseOutcome]:
        CourseService(self.db).get_course_by_id(course_id)
        return CourseService(self.db).get_course_outcomes(course_id)

    def get_outcome_by_id(self, outcome_id: str) -> CourseOutcome:
        item = self.db.execute(select(CourseOutcome).where(CourseOutcome.id == outcome_id, CourseOutcome.deleted_at.is_(None))).scalar_one_or_none()
        if not item:
            raise HTTPException(status_code=404, detail="Course outcome not found")
        return item

    def update_outcome(self, outcome_id: str, payload: CourseOutcomeUpdate) -> CourseOutcome:
        item = self.get_outcome_by_id(outcome_id)
        if payload.outcome_text is not None:
            item.outcome_text = payload.outcome_text
        if payload.order_index is not None:
            item.order_index = payload.order_index
        self.db.commit()
        self.db.refresh(item)
        return item

    def soft_delete_outcome(self, outcome_id: str) -> None:
        item = self.get_outcome_by_id(outcome_id)
        item.deleted_at = _now()
        self.db.commit()


class CourseModuleService(CourseSerializationMixin):
    def __init__(self, db: Session) -> None:
        self.db = db

    def _validate_media(self, media_id: str | None) -> None:
        if not media_id:
            return
        media = self.db.execute(select(Media).where(Media.id == media_id, Media.deleted_at.is_(None))).scalar_one_or_none()
        if not media:
            raise HTTPException(status_code=404, detail="Media not found")

    def create_module(self, course_id: str, payload: CourseModuleCreate) -> CourseModule:
        CourseService(self.db).get_course_by_id(course_id)
        self._validate_media(payload.media_id)
        module = CourseModule(
            course_id=course_id,
            media_id=payload.media_id,
            title=payload.title,
            description=payload.description,
            order_index=payload.order_index,
            status=_enum(CourseModuleStatus, payload.status, "status"),
        )
        self.db.add(module)
        self.db.commit()
        self.db.refresh(module)
        return module

    def get_modules_by_course(self, course_id: str) -> list[CourseModule]:
        CourseService(self.db).get_course_by_id(course_id)
        return CourseService(self.db).get_course_modules(course_id)

    def get_module_by_id(self, module_id: str) -> CourseModule:
        module = self.db.execute(select(CourseModule).where(CourseModule.id == module_id, CourseModule.deleted_at.is_(None))).scalar_one_or_none()
        if not module:
            raise HTTPException(status_code=404, detail="Course module not found")
        return module

    def module_detail_dict(self, module: CourseModule) -> dict[str, Any]:
        data = self._module_dict(module)
        data["lessons"] = [LessonService(self.db).lesson_list_dict(item) for item in LessonService(self.db).get_lessons_by_module(str(module.id))]
        return data

    def update_module(self, module_id: str, payload: CourseModuleUpdate) -> CourseModule:
        module = self.get_module_by_id(module_id)
        if payload.media_id is not None:
            self._validate_media(payload.media_id)
            module.media_id = payload.media_id
        for field in ["title", "description", "order_index"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(module, field, value)
        if payload.status is not None:
            module.status = _enum(CourseModuleStatus, payload.status, "status")
        self.db.commit()
        self.db.refresh(module)
        return module

    def soft_delete_module(self, module_id: str) -> None:
        module = self.get_module_by_id(module_id)
        module.deleted_at = _now()
        self.db.commit()


class LessonService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def _validate_module_for_course(self, course_id: str, module_id: str | None) -> None:
        if not module_id:
            return
        module = CourseModuleService(self.db).get_module_by_id(module_id)
        if str(module.course_id) != str(course_id):
            raise HTTPException(status_code=400, detail="Module does not belong to course")

    def create_lesson(self, course_id: str, payload: LessonCreate, created_by: str | None = None) -> Lesson:
        CourseService(self.db).get_course_by_id(course_id)
        self._validate_module_for_course(course_id, payload.module_id)
        CourseModuleService(self.db)._validate_media(payload.media_id)
        lesson = Lesson(
            course_id=course_id,
            module_id=payload.module_id,
            media_id=payload.media_id,
            title=payload.title,
            description=payload.description,
            content=payload.content,
            order_index=payload.order_index,
            estimated_duration_minutes=payload.estimated_duration_minutes,
            status=_enum(LessonStatus, payload.status, "status"),
            created_by=created_by,
        )
        self.db.add(lesson)
        self.db.commit()
        self.db.refresh(lesson)
        return lesson

    def get_lessons_by_course(
        self,
        course_id: str,
        query: PaginationParams,
        module_id: str | None = None,
        status: str | None = None,
    ) -> tuple[list[Lesson], int]:
        CourseService(self.db).get_course_by_id(course_id)
        stmt = select(Lesson).where(Lesson.course_id == course_id, Lesson.deleted_at.is_(None))
        if module_id:
            stmt = stmt.where(Lesson.module_id == module_id)
        if status:
            stmt = stmt.where(Lesson.status == _enum(LessonStatus, status, "status"))
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(or_(Lesson.title.ilike(term), Lesson.description.ilike(term)))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        sort_field = getattr(Lesson, query.sort_by, Lesson.order_index) if query.sort_by else Lesson.order_index
        stmt = stmt.order_by(sort_field.asc() if query.sort_order == "asc" else sort_field.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def get_lessons_by_module(self, module_id: str) -> list[Lesson]:
        return list(
            self.db.execute(
                select(Lesson).where(Lesson.module_id == module_id, Lesson.deleted_at.is_(None)).order_by(Lesson.order_index.asc())
            ).scalars().all()
        )

    def get_lesson_by_id(self, lesson_id: str) -> Lesson:
        lesson = self.db.execute(select(Lesson).where(Lesson.id == lesson_id, Lesson.deleted_at.is_(None))).scalar_one_or_none()
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")
        return lesson

    def set_thumbnail_media(self, lesson_id: str, media_id: str) -> Lesson:
        lesson = self.get_lesson_by_id(lesson_id)
        media = self.db.execute(select(Media).where(Media.id == media_id, Media.deleted_at.is_(None))).scalar_one_or_none()
        if not media:
            raise HTTPException(status_code=404, detail="Media not found")
        lesson.media_id = media.id
        self.db.commit()
        self.db.refresh(lesson)
        return lesson

    def upload_thumbnail(self, lesson_id: str, file, file_size: int) -> Lesson:
        lesson = self.get_lesson_by_id(lesson_id)
        uploaded = StorageService().upload_file(
            bucket_name=settings.MINIO_BUCKET_AVATARS,
            file=file,
            file_size=file_size,
            folder=f"lessons/{lesson_id}/thumbnail",
        )
        media = Media(
            bucket=uploaded["bucket"],
            object_name=uploaded["object_name"],
            original_filename=file.filename,
            content_type=file.content_type,
            size=file_size,
            uploaded_by=None,
        )
        self.db.add(media)
        self.db.flush()
        lesson.media_id = media.id
        self.db.commit()
        self.db.refresh(lesson)
        return lesson

    def lesson_list_dict(self, lesson: Lesson) -> dict[str, Any]:
        media = None
        if lesson.media_id:
            media = self.db.execute(select(Media).where(Media.id == lesson.media_id, Media.deleted_at.is_(None))).scalar_one_or_none()
        return {
            "id": str(lesson.id),
            "course_id": str(lesson.course_id),
            "module_id": str(lesson.module_id) if lesson.module_id else None,
            "media_id": str(lesson.media_id) if lesson.media_id else None,
            "thumbnail": CourseService(self.db)._media_dict(media) if media else None,
            "title": lesson.title,
            "description": lesson.description,
            "order_index": lesson.order_index,
            "estimated_duration_minutes": lesson.estimated_duration_minutes,
            "status": lesson.status.value,
        }

    def lesson_detail_dict(self, lesson: Lesson) -> dict[str, Any]:
        course = CourseService(self.db).get_course_by_id(str(lesson.course_id))
        module = CourseModuleService(self.db).get_module_by_id(str(lesson.module_id)) if lesson.module_id else None
        data = self.lesson_list_dict(lesson)
        data.update(
            {
                "content": lesson.content,
                "course": {"id": str(course.id), "name": course.name},
                "module": {"id": str(module.id), "title": module.title} if module else None,
                "materials": [
                    LessonMaterialService(self.db).material_dict(item)
                    for item in LessonMaterialService(self.db).get_materials_by_lesson(str(lesson.id))
                ],
            }
        )
        return data

    def update_lesson(self, lesson_id: str, payload: LessonUpdate) -> Lesson:
        lesson = self.get_lesson_by_id(lesson_id)
        if payload.module_id is not None:
            self._validate_module_for_course(str(lesson.course_id), payload.module_id)
            lesson.module_id = payload.module_id
        if payload.media_id is not None:
            CourseModuleService(self.db)._validate_media(payload.media_id)
            lesson.media_id = payload.media_id
        for field in ["title", "description", "content", "order_index", "estimated_duration_minutes"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(lesson, field, value)
        if payload.status is not None:
            lesson.status = _enum(LessonStatus, payload.status, "status")
        self.db.commit()
        self.db.refresh(lesson)
        return lesson

    def soft_delete_lesson(self, lesson_id: str) -> None:
        lesson = self.get_lesson_by_id(lesson_id)
        lesson.deleted_at = _now()
        self.db.commit()


class LessonMaterialService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def _validate_material_payload(self, media_id: str | None, external_url: str | None) -> None:
        if not media_id and not external_url:
            raise HTTPException(status_code=400, detail="Either media_id or external_url is required")
        if media_id:
            media = self.db.execute(select(Media).where(Media.id == media_id, Media.deleted_at.is_(None))).scalar_one_or_none()
            if not media:
                raise HTTPException(status_code=404, detail="Media not found")

    def create_material(self, lesson_id: str, payload: LessonMaterialCreate, created_by: str | None = None) -> LessonMaterial:
        LessonService(self.db).get_lesson_by_id(lesson_id)
        self._validate_material_payload(payload.media_id, payload.external_url)
        material = LessonMaterial(
            lesson_id=lesson_id,
            media_id=payload.media_id,
            title=payload.title,
            description=payload.description,
            external_url=payload.external_url,
            order_index=payload.order_index,
            is_downloadable=payload.is_downloadable,
            created_by=created_by,
        )
        self.db.add(material)
        self.db.commit()
        self.db.refresh(material)
        return material

    def get_materials_by_lesson(self, lesson_id: str) -> list[LessonMaterial]:
        LessonService(self.db).get_lesson_by_id(lesson_id)
        return list(
            self.db.execute(
                select(LessonMaterial)
                .where(LessonMaterial.lesson_id == lesson_id, LessonMaterial.deleted_at.is_(None))
                .order_by(LessonMaterial.order_index.asc())
            ).scalars().all()
        )

    def get_material_by_id(self, material_id: str) -> LessonMaterial:
        material = self.db.execute(
            select(LessonMaterial).where(LessonMaterial.id == material_id, LessonMaterial.deleted_at.is_(None))
        ).scalar_one_or_none()
        if not material:
            raise HTTPException(status_code=404, detail="Lesson material not found")
        return material

    def upload_material_file(
        self,
        lesson_id: str,
        title: str,
        file,
        file_size: int,
        description: str | None = None,
        external_url: str | None = None,
        order_index: int = 0,
        is_downloadable: bool = True,
        created_by: str | None = None,
    ) -> LessonMaterial:
        LessonService(self.db).get_lesson_by_id(lesson_id)
        uploaded = StorageService().upload_file(
            bucket_name=settings.MINIO_BUCKET_AVATARS,
            file=file,
            file_size=file_size,
            folder=f"lessons/{lesson_id}/materials",
        )
        media = Media(
            bucket=uploaded["bucket"],
            object_name=uploaded["object_name"],
            original_filename=file.filename,
            content_type=file.content_type,
            size=file_size,
            uploaded_by=created_by,
        )
        self.db.add(media)
        self.db.flush()
        material = LessonMaterial(
            lesson_id=lesson_id,
            media_id=media.id,
            title=title,
            description=description,
            external_url=external_url,
            order_index=order_index,
            is_downloadable=is_downloadable,
            created_by=created_by,
        )
        self.db.add(material)
        self.db.commit()
        self.db.refresh(material)
        return material

    def set_material_media(self, material_id: str, media_id: str) -> LessonMaterial:
        material = self.get_material_by_id(material_id)
        media = self.db.execute(select(Media).where(Media.id == media_id, Media.deleted_at.is_(None))).scalar_one_or_none()
        if not media:
            raise HTTPException(status_code=404, detail="Media not found")
        material.media_id = media.id
        self._validate_material_payload(str(material.media_id), material.external_url)
        self.db.commit()
        self.db.refresh(material)
        return material

    def material_dict(self, material: LessonMaterial) -> dict[str, Any]:
        media = None
        if material.media_id:
            media = self.db.execute(select(Media).where(Media.id == material.media_id, Media.deleted_at.is_(None))).scalar_one_or_none()
        return {
            "id": str(material.id),
            "lesson_id": str(material.lesson_id),
            "title": material.title,
            "description": material.description,
            "media_id": str(material.media_id) if material.media_id else None,
            "media": CourseService(self.db)._media_dict(media) if media else None,
            "external_url": material.external_url,
            "order_index": material.order_index,
            "is_downloadable": material.is_downloadable,
        }

    def update_material(self, material_id: str, payload: LessonMaterialUpdate) -> LessonMaterial:
        material = self.get_material_by_id(material_id)
        for field in ["title", "description", "external_url", "order_index", "is_downloadable"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(material, field, value)
        if payload.media_id is not None:
            material.media_id = payload.media_id
        self._validate_material_payload(str(material.media_id) if material.media_id else None, material.external_url)
        self.db.commit()
        self.db.refresh(material)
        return material

    def soft_delete_material(self, material_id: str) -> None:
        material = self.get_material_by_id(material_id)
        material.deleted_at = _now()
        self.db.commit()

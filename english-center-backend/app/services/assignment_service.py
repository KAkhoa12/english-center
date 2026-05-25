from datetime import datetime, timezone
from decimal import Decimal
from typing import Any

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.assignment import (
    Assignment,
    AssignmentAttachment,
    AssignmentAttachmentType,
    AssignmentGrade,
    AssignmentGradingMethod,
    AssignmentStatus,
    AssignmentSubmission,
    AssignmentSubmissionStatus,
    AssignmentType,
    SubmissionAttachment,
)
from app.models.class_model import CourseClass
from app.models.class_session import ClassSession
from app.models.class_student import ClassEnrollmentStatus, ClassStudent
from app.models.course import Lesson
from app.models.student import Student
from app.models.user import User
from app.schemas.assignment import (
    AssignmentAttachmentCreate,
    AssignmentAttachmentUpdate,
    AssignmentCreate,
    AssignmentUpdate,
    AssignmentGradeCreate,
    AssignmentGradeUpdate,
    AssignmentSubmissionCreate,
    AssignmentSubmissionUpdate,
    SubmissionAttachmentCreate,
)
from app.schemas.common import PaginationParams
from app.services.class_service import AcademicAccessMixin, ClassService, _enum
from app.services.storage_service import StorageService
from app.utils.serializers import user_to_dict


def _now() -> datetime:
    return datetime.now(timezone.utc)


class AssignmentAccessMixin(AcademicAccessMixin):
    def _get_student(self, student_id: str) -> Student:
        student = self.db.execute(select(Student).where(Student.id == student_id, Student.deleted_at.is_(None))).scalar_one_or_none()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student

    def _get_assignment_class(self, assignment: Assignment) -> CourseClass:
        return ClassService(self.db).get_class_by_id(str(assignment.class_id))

    def _student_in_class(self, student_id: str, class_id: str) -> bool:
        item = self.db.execute(
            select(ClassStudent).where(
                ClassStudent.class_id == class_id,
                ClassStudent.student_id == student_id,
                ClassStudent.deleted_at.is_(None),
                ClassStudent.enrollment_status.notin_([ClassEnrollmentStatus.cancelled, ClassEnrollmentStatus.dropped]),
            )
        ).scalar_one_or_none()
        return item is not None

    def _teacher_owns_assignment(self, assignment: Assignment, user: User) -> bool:
        teacher = self.get_teacher_profile_by_user(str(user.id))
        if not teacher:
            return False
        class_obj = self._get_assignment_class(assignment)
        return bool(class_obj.teacher_id and str(class_obj.teacher_id) == str(teacher.id))

    def assert_can_manage_assignment(self, assignment: Assignment, user: User) -> None:
        if self.has_any_permission(user, "admin.all", "assignment.all", "assignment_grade.all", "assignment_submission.all"):
            return
        if self._teacher_owns_assignment(assignment, user):
            return
        raise HTTPException(status_code=403, detail="Permission denied")

    def assert_can_read_assignment(self, assignment: Assignment, user: User) -> None:
        if self.has_any_permission(user, "admin.all", "assignment.all", "assignment_submission.all", "assignment_grade.all"):
            return
        if self._teacher_owns_assignment(assignment, user):
            return
        student = self.get_student_profile_by_user(str(user.id))
        if student and assignment.status == AssignmentStatus.published and self._student_in_class(str(student.id), str(assignment.class_id)):
            return
        raise HTTPException(status_code=403, detail="Permission denied")

    def assert_can_read_submission(self, submission: AssignmentSubmission, user: User) -> None:
        if str(submission.user_id) == str(user.id):
            return
        assignment = AssignmentService(self.db).get_assignment_by_id(str(submission.assignment_id))
        self.assert_can_manage_assignment(assignment, user)

    def _presigned_url(self, bucket: str | None, object_name: str | None) -> str | None:
        if not bucket or not object_name:
            return None
        try:
            return StorageService().get_presigned_url(bucket, object_name)
        except HTTPException:
            return None


class AssignmentService(AssignmentAccessMixin):
    def _validate_class_links(self, class_obj: CourseClass, session_id: str | None, lesson_id: str | None) -> tuple[ClassSession | None, Lesson | None]:
        session = None
        if session_id:
            session = self.db.execute(select(ClassSession).where(ClassSession.id == session_id, ClassSession.deleted_at.is_(None))).scalar_one_or_none()
            if not session:
                raise HTTPException(status_code=404, detail="Class session not found")
            if str(session.class_id) != str(class_obj.id):
                raise HTTPException(status_code=400, detail="Session does not belong to class")
        lesson = None
        if lesson_id:
            lesson = self.db.execute(select(Lesson).where(Lesson.id == lesson_id, Lesson.deleted_at.is_(None))).scalar_one_or_none()
            if not lesson:
                raise HTTPException(status_code=404, detail="Lesson not found")
            if str(lesson.course_id) != str(class_obj.course_id):
                raise HTTPException(status_code=400, detail="Lesson does not belong to class course")
        return session, lesson

    def create_assignment(self, class_id: str, payload: AssignmentCreate, current_user: User) -> Assignment:
        class_obj = ClassService(self.db).get_class_by_id(class_id)
        fake_assignment = Assignment(class_id=class_obj.id, title=payload.title, max_score=payload.max_score, created_by=current_user.id)
        self.assert_can_manage_assignment(fake_assignment, current_user)
        self._validate_class_links(class_obj, payload.session_id, payload.lesson_id)
        assignment = Assignment(
            class_id=class_obj.id,
            session_id=payload.session_id,
            lesson_id=payload.lesson_id,
            title=payload.title.strip(),
            description=payload.description,
            instruction=payload.instruction,
            assignment_type=_enum(AssignmentType, payload.assignment_type, "assignment type"),
            status=_enum(AssignmentStatus, payload.status, "assignment status"),
            max_score=payload.max_score,
            due_at=payload.due_at,
            allow_late_submission=payload.allow_late_submission,
            created_by=current_user.id,
        )
        self.db.add(assignment)
        self.db.commit()
        self.db.refresh(assignment)
        return assignment

    def get_assignment_by_id(self, assignment_id: str) -> Assignment:
        assignment = self.db.execute(select(Assignment).where(Assignment.id == assignment_id, Assignment.deleted_at.is_(None))).scalar_one_or_none()
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")
        return assignment

    def get_assignments_by_class(
        self,
        class_id: str,
        query: PaginationParams,
        current_user: User,
        status: str | None = None,
        assignment_type: str | None = None,
        session_id: str | None = None,
        lesson_id: str | None = None,
        due_from: datetime | None = None,
        due_to: datetime | None = None,
    ) -> tuple[list[Assignment], int]:
        class_obj = ClassService(self.db).get_class_by_id(class_id)
        stmt = select(Assignment).where(Assignment.class_id == class_obj.id, Assignment.deleted_at.is_(None))
        student = self.get_student_profile_by_user(str(current_user.id))
        can_manage = self.has_any_permission(current_user, "admin.all", "assignment.all") or self._teacher_owns_assignment(
            Assignment(class_id=class_obj.id, title="", max_score=10, created_by=current_user.id), current_user
        )
        if student and not can_manage:
            if not self._student_in_class(str(student.id), class_id):
                raise HTTPException(status_code=403, detail="Permission denied")
            stmt = stmt.where(Assignment.status == AssignmentStatus.published)
        if status:
            stmt = stmt.where(Assignment.status == _enum(AssignmentStatus, status, "assignment status"))
        if assignment_type:
            stmt = stmt.where(Assignment.assignment_type == _enum(AssignmentType, assignment_type, "assignment type"))
        if session_id:
            stmt = stmt.where(Assignment.session_id == session_id)
        if lesson_id:
            stmt = stmt.where(Assignment.lesson_id == lesson_id)
        if due_from:
            stmt = stmt.where(Assignment.due_at >= due_from)
        if due_to:
            stmt = stmt.where(Assignment.due_at <= due_to)
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(or_(Assignment.title.ilike(term), Assignment.description.ilike(term)))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        sort_field = getattr(Assignment, query.sort_by, Assignment.created_at) if query.sort_by else Assignment.created_at
        stmt = stmt.order_by(sort_field.asc() if query.sort_order == "asc" else sort_field.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def update_assignment(self, assignment_id: str, payload: AssignmentUpdate, current_user: User) -> Assignment:
        assignment = self.get_assignment_by_id(assignment_id)
        self.assert_can_manage_assignment(assignment, current_user)
        if assignment.status in {AssignmentStatus.closed, AssignmentStatus.archived} and payload.status is None:
            raise HTTPException(status_code=400, detail="Closed or archived assignment cannot be updated")
        class_obj = self._get_assignment_class(assignment)
        session_id = payload.session_id if payload.session_id is not None else str(assignment.session_id) if assignment.session_id else None
        lesson_id = payload.lesson_id if payload.lesson_id is not None else str(assignment.lesson_id) if assignment.lesson_id else None
        self._validate_class_links(class_obj, session_id, lesson_id)
        for field in ["description", "instruction", "due_at", "allow_late_submission"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(assignment, field, value)
        if payload.title is not None:
            assignment.title = payload.title.strip()
        if payload.session_id is not None:
            assignment.session_id = payload.session_id
        if payload.lesson_id is not None:
            assignment.lesson_id = payload.lesson_id
        if payload.assignment_type is not None:
            assignment.assignment_type = _enum(AssignmentType, payload.assignment_type, "assignment type")
        if payload.status is not None:
            assignment.status = _enum(AssignmentStatus, payload.status, "assignment status")
        if payload.max_score is not None:
            assignment.max_score = payload.max_score
        self.db.commit()
        self.db.refresh(assignment)
        return assignment

    def soft_delete_assignment(self, assignment_id: str, current_user: User) -> None:
        assignment = self.get_assignment_by_id(assignment_id)
        self.assert_can_manage_assignment(assignment, current_user)
        assignment.status = AssignmentStatus.archived
        assignment.deleted_at = _now()
        self.db.commit()

    def publish_assignment(self, assignment_id: str, current_user: User) -> Assignment:
        assignment = self.get_assignment_by_id(assignment_id)
        self.assert_can_manage_assignment(assignment, current_user)
        assignment.status = AssignmentStatus.published
        self.db.commit()
        self.db.refresh(assignment)
        return assignment

    def close_assignment(self, assignment_id: str, current_user: User) -> Assignment:
        assignment = self.get_assignment_by_id(assignment_id)
        self.assert_can_manage_assignment(assignment, current_user)
        assignment.status = AssignmentStatus.closed
        self.db.commit()
        self.db.refresh(assignment)
        return assignment

    def count_submissions(self, assignment_id: str) -> int:
        return int(
            self.db.execute(
                select(func.count()).select_from(AssignmentSubmission).where(
                    AssignmentSubmission.assignment_id == assignment_id,
                    AssignmentSubmission.deleted_at.is_(None),
                )
            ).scalar_one()
        )

    def count_graded_submissions(self, assignment_id: str) -> int:
        return int(
            self.db.execute(
                select(func.count()).select_from(AssignmentSubmission).where(
                    AssignmentSubmission.assignment_id == assignment_id,
                    AssignmentSubmission.status == AssignmentSubmissionStatus.graded,
                    AssignmentSubmission.deleted_at.is_(None),
                )
            ).scalar_one()
        )

    def get_my_assignments(
        self,
        current_user: User,
        query: PaginationParams,
        status: str | None = None,
        assignment_type: str | None = None,
        class_id: str | None = None,
        submitted_status: str | None = None,
    ) -> tuple[list[Assignment], int]:
        student = self.get_student_profile_by_user(str(current_user.id))
        if not student:
            raise HTTPException(status_code=404, detail="Student profile not found")
        stmt = (
            select(Assignment)
            .join(ClassStudent, ClassStudent.class_id == Assignment.class_id)
            .where(
                ClassStudent.student_id == student.id,
                ClassStudent.deleted_at.is_(None),
                Assignment.deleted_at.is_(None),
                Assignment.status == AssignmentStatus.published,
            )
        )
        if class_id:
            stmt = stmt.where(Assignment.class_id == class_id)
        if status:
            stmt = stmt.where(Assignment.status == _enum(AssignmentStatus, status, "assignment status"))
        if assignment_type:
            stmt = stmt.where(Assignment.assignment_type == _enum(AssignmentType, assignment_type, "assignment type"))
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(or_(Assignment.title.ilike(term), Assignment.description.ilike(term)))
        assignments = list(self.db.execute(stmt.order_by(Assignment.due_at.asc().nullslast(), Assignment.created_at.desc())).scalars().all())
        if submitted_status:
            filtered: list[Assignment] = []
            for assignment in assignments:
                submission = AssignmentSubmissionService(self.db).get_student_submission(str(assignment.id), str(student.id))
                if submitted_status == "not_submitted" and not submission:
                    filtered.append(assignment)
                elif submission and submission.status.value == submitted_status:
                    filtered.append(assignment)
            assignments = filtered
        total = len(assignments)
        start = (query.page - 1) * query.page_size
        return assignments[start:start + query.page_size], total

    def assignment_dict(self, assignment: Assignment, current_user: User | None = None, detail: bool = False) -> dict[str, Any]:
        class_obj = ClassService(self.db).get_class_by_id(str(assignment.class_id))
        session = self.db.execute(select(ClassSession).where(ClassSession.id == assignment.session_id)).scalar_one_or_none() if assignment.session_id else None
        lesson = self.db.execute(select(Lesson).where(Lesson.id == assignment.lesson_id)).scalar_one_or_none() if assignment.lesson_id else None
        data = {
            "id": str(assignment.id),
            "class_id": str(assignment.class_id),
            "session_id": str(assignment.session_id) if assignment.session_id else None,
            "lesson_id": str(assignment.lesson_id) if assignment.lesson_id else None,
            "title": assignment.title,
            "description": assignment.description,
            "instruction": assignment.instruction,
            "assignment_type": assignment.assignment_type.value,
            "status": assignment.status.value,
            "max_score": float(assignment.max_score),
            "due_at": assignment.due_at,
            "allow_late_submission": assignment.allow_late_submission,
            "class": {"id": str(class_obj.id), "name": class_obj.name},
            "session": {"id": str(session.id), "title": session.title} if session else None,
            "lesson": {"id": str(lesson.id), "title": lesson.title} if lesson else None,
            "created_at": assignment.created_at,
            "updated_at": assignment.updated_at,
        }
        if detail:
            student = self.get_student_profile_by_user(str(current_user.id)) if current_user else None
            my_submission = AssignmentSubmissionService(self.db).get_student_submission(str(assignment.id), str(student.id)) if student else None
            data.update(
                {
                    "attachments": [
                        AssignmentAttachmentService(self.db).attachment_dict(item)
                        for item in AssignmentAttachmentService(self.db).get_attachments_by_assignment(str(assignment.id))
                    ],
                    "my_submission": AssignmentSubmissionService(self.db).submission_dict(my_submission, current_user) if my_submission and current_user else None,
                    "submission_count": self.count_submissions(str(assignment.id)),
                    "graded_count": self.count_graded_submissions(str(assignment.id)),
                }
            )
        return data


class AssignmentAttachmentService(AssignmentAccessMixin):
    def _validate_attachment(self, attachment_type: AssignmentAttachmentType, file_bucket: str | None, file_object_name: str | None, external_url: str | None) -> None:
        if attachment_type == AssignmentAttachmentType.file and not (file_bucket and file_object_name):
            raise HTTPException(status_code=400, detail="file_bucket and file_object_name are required for file attachments")
        if attachment_type == AssignmentAttachmentType.link and not external_url:
            raise HTTPException(status_code=400, detail="external_url is required for link attachments")

    def create_attachment(self, assignment_id: str, payload: AssignmentAttachmentCreate, current_user: User) -> AssignmentAttachment:
        assignment = AssignmentService(self.db).get_assignment_by_id(assignment_id)
        self.assert_can_manage_assignment(assignment, current_user)
        attachment_type = _enum(AssignmentAttachmentType, payload.attachment_type, "attachment type")
        self._validate_attachment(attachment_type, payload.file_bucket, payload.file_object_name, payload.external_url)
        item = AssignmentAttachment(
            assignment_id=assignment.id,
            title=payload.title,
            description=payload.description,
            file_bucket=payload.file_bucket,
            file_object_name=payload.file_object_name,
            external_url=payload.external_url,
            content_type=payload.content_type,
            file_size=payload.file_size,
            attachment_type=attachment_type,
            order_index=payload.order_index,
            uploaded_by=current_user.id,
        )
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def get_attachments_by_assignment(self, assignment_id: str) -> list[AssignmentAttachment]:
        AssignmentService(self.db).get_assignment_by_id(assignment_id)
        return list(
            self.db.execute(
                select(AssignmentAttachment)
                .where(AssignmentAttachment.assignment_id == assignment_id, AssignmentAttachment.deleted_at.is_(None))
                .order_by(AssignmentAttachment.order_index.asc(), AssignmentAttachment.created_at.asc())
            ).scalars().all()
        )

    def get_attachment_by_id(self, attachment_id: str) -> AssignmentAttachment:
        item = self.db.execute(select(AssignmentAttachment).where(AssignmentAttachment.id == attachment_id, AssignmentAttachment.deleted_at.is_(None))).scalar_one_or_none()
        if not item:
            raise HTTPException(status_code=404, detail="Assignment attachment not found")
        return item

    def update_attachment(self, attachment_id: str, payload: AssignmentAttachmentUpdate, current_user: User) -> AssignmentAttachment:
        item = self.get_attachment_by_id(attachment_id)
        assignment = AssignmentService(self.db).get_assignment_by_id(str(item.assignment_id))
        self.assert_can_manage_assignment(assignment, current_user)
        attachment_type = _enum(AssignmentAttachmentType, payload.attachment_type, "attachment type") if payload.attachment_type else item.attachment_type
        for field in ["title", "description", "file_bucket", "file_object_name", "external_url", "content_type", "file_size", "order_index"]:
            value = getattr(payload, field)
            if value is not None:
                setattr(item, field, value)
        item.attachment_type = attachment_type
        self._validate_attachment(item.attachment_type, item.file_bucket, item.file_object_name, item.external_url)
        self.db.commit()
        self.db.refresh(item)
        return item

    def soft_delete_attachment(self, attachment_id: str, current_user: User) -> None:
        item = self.get_attachment_by_id(attachment_id)
        assignment = AssignmentService(self.db).get_assignment_by_id(str(item.assignment_id))
        self.assert_can_manage_assignment(assignment, current_user)
        item.deleted_at = _now()
        self.db.commit()

    def attachment_dict(self, item: AssignmentAttachment) -> dict[str, Any]:
        return {
            "id": str(item.id),
            "assignment_id": str(item.assignment_id),
            "title": item.title,
            "description": item.description,
            "attachment_type": item.attachment_type.value,
            "file_bucket": item.file_bucket,
            "file_object_name": item.file_object_name,
            "external_url": item.external_url,
            "content_type": item.content_type,
            "file_size": item.file_size,
            "order_index": item.order_index,
            "presigned_url": self._presigned_url(item.file_bucket, item.file_object_name) if item.attachment_type == AssignmentAttachmentType.file else None,
        }


class AssignmentSubmissionService(AssignmentAccessMixin):
    def get_student_submission(self, assignment_id: str, student_id: str) -> AssignmentSubmission | None:
        return self.db.execute(
            select(AssignmentSubmission).where(
                AssignmentSubmission.assignment_id == assignment_id,
                AssignmentSubmission.student_id == student_id,
                AssignmentSubmission.deleted_at.is_(None),
            ).order_by(AssignmentSubmission.attempt_number.desc())
        ).scalars().first()

    def _calculate_submit_status(self, assignment: Assignment, requested_status: str) -> tuple[AssignmentSubmissionStatus, bool, datetime | None]:
        status = _enum(AssignmentSubmissionStatus, requested_status, "submission status")
        if status not in {AssignmentSubmissionStatus.draft, AssignmentSubmissionStatus.submitted}:
            raise HTTPException(status_code=400, detail="Submission status must be draft or submitted")
        if status == AssignmentSubmissionStatus.draft:
            return status, False, None
        submitted_at = _now()
        is_late = bool(assignment.due_at and submitted_at > assignment.due_at)
        if is_late and not assignment.allow_late_submission:
            raise HTTPException(status_code=400, detail="Late submission is not allowed")
        return AssignmentSubmissionStatus.late if is_late else AssignmentSubmissionStatus.submitted, is_late, submitted_at

    def check_student_can_submit(self, assignment: Assignment, current_user: User) -> Student:
        student = self.get_student_profile_by_user(str(current_user.id))
        if not student:
            raise HTTPException(status_code=404, detail="Student profile not found")
        if not self._student_in_class(str(student.id), str(assignment.class_id)):
            raise HTTPException(status_code=403, detail="Student does not belong to assignment class")
        if assignment.status != AssignmentStatus.published:
            raise HTTPException(status_code=400, detail="Assignment is not open for submission")
        return student

    def submit_assignment(self, assignment_id: str, payload: AssignmentSubmissionCreate, current_user: User) -> AssignmentSubmission:
        assignment = AssignmentService(self.db).get_assignment_by_id(assignment_id)
        student = self.check_student_can_submit(assignment, current_user)
        status, is_late, submitted_at = self._calculate_submit_status(assignment, payload.status)
        try:
            submission = self.get_student_submission(assignment_id, str(student.id))
            if submission and submission.status == AssignmentSubmissionStatus.graded:
                raise HTTPException(status_code=400, detail="Graded submission cannot be updated")
            if not submission:
                submission = AssignmentSubmission(
                    assignment_id=assignment.id,
                    student_id=student.id,
                    user_id=current_user.id,
                    attempt_number=1,
                )
                self.db.add(submission)
                self.db.flush()
            submission.content = payload.content
            submission.status = status
            submission.is_late = is_late
            submission.submitted_at = submitted_at or submission.submitted_at
            for attachment in payload.attachments or []:
                self.db.add(
                    SubmissionAttachment(
                        submission_id=submission.id,
                        title=attachment.title,
                        file_bucket=attachment.file_bucket,
                        file_object_name=attachment.file_object_name,
                        original_filename=attachment.original_filename,
                        content_type=attachment.content_type,
                        file_size=attachment.file_size,
                        uploaded_by=current_user.id,
                    )
                )
            self.db.commit()
            self.db.refresh(submission)
            return submission
        except Exception:
            self.db.rollback()
            raise

    def get_submission_by_id(self, submission_id: str) -> AssignmentSubmission:
        submission = self.db.execute(select(AssignmentSubmission).where(AssignmentSubmission.id == submission_id, AssignmentSubmission.deleted_at.is_(None))).scalar_one_or_none()
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
        return submission

    def get_submissions_by_assignment(
        self,
        assignment_id: str,
        query: PaginationParams,
        current_user: User,
        status: str | None = None,
        is_late: bool | None = None,
        graded: bool | None = None,
    ) -> tuple[list[AssignmentSubmission], int]:
        assignment = AssignmentService(self.db).get_assignment_by_id(assignment_id)
        self.assert_can_manage_assignment(assignment, current_user)
        stmt = (
            select(AssignmentSubmission)
            .join(Student, Student.id == AssignmentSubmission.student_id)
            .join(User, User.id == Student.user_id)
            .where(AssignmentSubmission.assignment_id == assignment_id, AssignmentSubmission.deleted_at.is_(None))
        )
        if status:
            stmt = stmt.where(AssignmentSubmission.status == _enum(AssignmentSubmissionStatus, status, "submission status"))
        if is_late is not None:
            stmt = stmt.where(AssignmentSubmission.is_late == is_late)
        if graded is not None:
            stmt = stmt.where(AssignmentSubmission.status == AssignmentSubmissionStatus.graded if graded else AssignmentSubmission.status != AssignmentSubmissionStatus.graded)
        if query.search:
            term = f"%{query.search}%"
            stmt = stmt.where(or_(User.full_name.ilike(term), User.email.ilike(term)))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(AssignmentSubmission.created_at.desc()).offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def update_submission(self, submission_id: str, payload: AssignmentSubmissionUpdate, current_user: User) -> AssignmentSubmission:
        submission = self.get_submission_by_id(submission_id)
        if str(submission.user_id) != str(current_user.id):
            raise HTTPException(status_code=403, detail="Permission denied")
        assignment = AssignmentService(self.db).get_assignment_by_id(str(submission.assignment_id))
        if assignment.status in {AssignmentStatus.closed, AssignmentStatus.archived}:
            raise HTTPException(status_code=400, detail="Assignment is closed")
        if submission.status == AssignmentSubmissionStatus.graded:
            raise HTTPException(status_code=400, detail="Graded submission cannot be updated")
        if payload.status is not None:
            status, is_late, submitted_at = self._calculate_submit_status(assignment, payload.status)
            submission.status = status
            submission.is_late = is_late
            submission.submitted_at = submitted_at or submission.submitted_at
        if payload.content is not None:
            submission.content = payload.content
        self.db.commit()
        self.db.refresh(submission)
        return submission

    def soft_delete_submission(self, submission_id: str, current_user: User) -> None:
        submission = self.get_submission_by_id(submission_id)
        assignment = AssignmentService(self.db).get_assignment_by_id(str(submission.assignment_id))
        if str(submission.user_id) == str(current_user.id):
            if submission.status != AssignmentSubmissionStatus.draft:
                raise HTTPException(status_code=400, detail="Only draft submission can be deleted by student")
        else:
            self.assert_can_manage_assignment(assignment, current_user)
        submission.status = AssignmentSubmissionStatus.cancelled
        submission.deleted_at = _now()
        self.db.commit()

    def get_my_submissions(
        self,
        current_user: User,
        query: PaginationParams,
        class_id: str | None = None,
        assignment_id: str | None = None,
        status: str | None = None,
        graded: bool | None = None,
    ) -> tuple[list[AssignmentSubmission], int]:
        student = self.get_student_profile_by_user(str(current_user.id))
        if not student:
            raise HTTPException(status_code=404, detail="Student profile not found")
        stmt = select(AssignmentSubmission).join(Assignment, Assignment.id == AssignmentSubmission.assignment_id).where(
            AssignmentSubmission.student_id == student.id,
            AssignmentSubmission.deleted_at.is_(None),
            Assignment.deleted_at.is_(None),
        )
        if class_id:
            stmt = stmt.where(Assignment.class_id == class_id)
        if assignment_id:
            stmt = stmt.where(AssignmentSubmission.assignment_id == assignment_id)
        if status:
            stmt = stmt.where(AssignmentSubmission.status == _enum(AssignmentSubmissionStatus, status, "submission status"))
        if graded is not None:
            stmt = stmt.where(AssignmentSubmission.status == AssignmentSubmissionStatus.graded if graded else AssignmentSubmission.status != AssignmentSubmissionStatus.graded)
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(AssignmentSubmission.created_at.desc()).offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def submission_dict(self, submission: AssignmentSubmission, current_user: User | None = None) -> dict[str, Any]:
        assignment = AssignmentService(self.db).get_assignment_by_id(str(submission.assignment_id))
        student = self._get_student(str(submission.student_id))
        user = self.db.execute(select(User).where(User.id == student.user_id, User.deleted_at.is_(None))).scalar_one()
        grade = AssignmentGradeService(self.db).get_grade_by_submission(str(submission.id), raise_not_found=False)
        return {
            "id": str(submission.id),
            "assignment_id": str(submission.assignment_id),
            "student_id": str(submission.student_id),
            "user_id": str(submission.user_id),
            "content": submission.content,
            "status": submission.status.value,
            "submitted_at": submission.submitted_at,
            "is_late": submission.is_late,
            "attempt_number": submission.attempt_number,
            "student": user_to_dict(user, include_meta=False),
            "assignment": {"id": str(assignment.id), "title": assignment.title, "max_score": float(assignment.max_score)},
            "attachments": [SubmissionAttachmentService(self.db).attachment_dict(item) for item in SubmissionAttachmentService(self.db).get_attachments_by_submission(str(submission.id))],
            "grade": AssignmentGradeService(self.db).grade_dict(grade) if grade else None,
        }


class SubmissionAttachmentService(AssignmentAccessMixin):
    def create_submission_attachment(self, submission_id: str, payload: SubmissionAttachmentCreate, current_user: User) -> SubmissionAttachment:
        submission = AssignmentSubmissionService(self.db).get_submission_by_id(submission_id)
        if str(submission.user_id) != str(current_user.id):
            raise HTTPException(status_code=403, detail="Permission denied")
        if submission.status == AssignmentSubmissionStatus.graded:
            raise HTTPException(status_code=400, detail="Cannot add attachment to graded submission")
        item = SubmissionAttachment(
            submission_id=submission.id,
            title=payload.title,
            file_bucket=payload.file_bucket,
            file_object_name=payload.file_object_name,
            original_filename=payload.original_filename,
            content_type=payload.content_type,
            file_size=payload.file_size,
            uploaded_by=current_user.id,
        )
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def get_attachments_by_submission(self, submission_id: str) -> list[SubmissionAttachment]:
        AssignmentSubmissionService(self.db).get_submission_by_id(submission_id)
        return list(
            self.db.execute(
                select(SubmissionAttachment)
                .where(SubmissionAttachment.submission_id == submission_id, SubmissionAttachment.deleted_at.is_(None))
                .order_by(SubmissionAttachment.created_at.asc())
            ).scalars().all()
        )

    def get_attachment_by_id(self, attachment_id: str) -> SubmissionAttachment:
        item = self.db.execute(select(SubmissionAttachment).where(SubmissionAttachment.id == attachment_id, SubmissionAttachment.deleted_at.is_(None))).scalar_one_or_none()
        if not item:
            raise HTTPException(status_code=404, detail="Submission attachment not found")
        return item

    def soft_delete_submission_attachment(self, attachment_id: str, current_user: User) -> None:
        item = self.get_attachment_by_id(attachment_id)
        submission = AssignmentSubmissionService(self.db).get_submission_by_id(str(item.submission_id))
        if str(submission.user_id) != str(current_user.id):
            assignment = AssignmentService(self.db).get_assignment_by_id(str(submission.assignment_id))
            self.assert_can_manage_assignment(assignment, current_user)
        elif submission.status == AssignmentSubmissionStatus.graded:
            raise HTTPException(status_code=400, detail="Cannot delete attachment from graded submission")
        item.deleted_at = _now()
        self.db.commit()

    def attachment_dict(self, item: SubmissionAttachment) -> dict[str, Any]:
        return {
            "id": str(item.id),
            "submission_id": str(item.submission_id),
            "title": item.title,
            "file_bucket": item.file_bucket,
            "file_object_name": item.file_object_name,
            "original_filename": item.original_filename,
            "content_type": item.content_type,
            "file_size": item.file_size,
            "presigned_url": self._presigned_url(item.file_bucket, item.file_object_name),
        }


class AssignmentGradeService(AssignmentAccessMixin):
    def _validate_score(self, score: Decimal | None, max_score: Decimal) -> None:
        if score is not None and score > max_score:
            raise HTTPException(status_code=400, detail="Score cannot exceed max_score")

    def grade_submission(self, submission_id: str, payload: AssignmentGradeCreate, current_user: User) -> AssignmentGrade:
        submission = AssignmentSubmissionService(self.db).get_submission_by_id(submission_id)
        assignment = AssignmentService(self.db).get_assignment_by_id(str(submission.assignment_id))
        self.assert_can_manage_assignment(assignment, current_user)
        self._validate_score(payload.score, assignment.max_score)
        try:
            grade = self.get_grade_by_submission(submission_id, raise_not_found=False)
            if not grade:
                grade = AssignmentGrade(
                    submission_id=submission.id,
                    assignment_id=assignment.id,
                    student_id=submission.student_id,
                    max_score=assignment.max_score,
                )
                self.db.add(grade)
            grade.score = payload.score
            grade.feedback = payload.feedback
            grade.rubric = payload.rubric
            grade.grading_method = _enum(AssignmentGradingMethod, payload.grading_method, "grading method")
            grade.graded_by = current_user.id
            grade.graded_at = _now()
            submission.status = AssignmentSubmissionStatus.graded
            self.db.commit()
            self.db.refresh(grade)
            return grade
        except Exception:
            self.db.rollback()
            raise

    def get_grade_by_submission(self, submission_id: str, raise_not_found: bool = True) -> AssignmentGrade | None:
        grade = self.db.execute(
            select(AssignmentGrade).where(AssignmentGrade.submission_id == submission_id, AssignmentGrade.deleted_at.is_(None))
        ).scalar_one_or_none()
        if not grade and raise_not_found:
            raise HTTPException(status_code=404, detail="Assignment grade not found")
        return grade

    def get_grade_by_id(self, grade_id: str) -> AssignmentGrade:
        grade = self.db.execute(select(AssignmentGrade).where(AssignmentGrade.id == grade_id, AssignmentGrade.deleted_at.is_(None))).scalar_one_or_none()
        if not grade:
            raise HTTPException(status_code=404, detail="Assignment grade not found")
        return grade

    def update_grade(self, grade_id: str, payload: AssignmentGradeUpdate, current_user: User) -> AssignmentGrade:
        grade = self.get_grade_by_id(grade_id)
        assignment = AssignmentService(self.db).get_assignment_by_id(str(grade.assignment_id))
        self.assert_can_manage_assignment(assignment, current_user)
        score = payload.score if payload.score is not None else grade.score
        self._validate_score(score, grade.max_score)
        if payload.score is not None:
            grade.score = payload.score
        if payload.feedback is not None:
            grade.feedback = payload.feedback
        if payload.rubric is not None:
            grade.rubric = payload.rubric
        if payload.grading_method is not None:
            grade.grading_method = _enum(AssignmentGradingMethod, payload.grading_method, "grading method")
        grade.graded_by = current_user.id
        grade.graded_at = _now()
        self.db.commit()
        self.db.refresh(grade)
        return grade

    def soft_delete_grade(self, grade_id: str, current_user: User) -> None:
        grade = self.get_grade_by_id(grade_id)
        assignment = AssignmentService(self.db).get_assignment_by_id(str(grade.assignment_id))
        self.assert_can_manage_assignment(assignment, current_user)
        grade.deleted_at = _now()
        submission = AssignmentSubmissionService(self.db).get_submission_by_id(str(grade.submission_id))
        submission.status = AssignmentSubmissionStatus.submitted
        self.db.commit()

    def get_student_grades(
        self,
        student_id: str,
        query: PaginationParams,
        current_user: User,
        class_id: str | None = None,
        assignment_type: str | None = None,
    ) -> tuple[list[AssignmentGrade], int]:
        try:
            self.assert_student_self_or_privileged(student_id, current_user, "assignment_grade.all")
        except HTTPException:
            teacher = self.get_teacher_profile_by_user(str(current_user.id))
            if not teacher:
                raise
            owns = self.db.execute(
                select(ClassStudent)
                .join(CourseClass, CourseClass.id == ClassStudent.class_id)
                .where(
                    ClassStudent.student_id == student_id,
                    CourseClass.teacher_id == teacher.id,
                    ClassStudent.deleted_at.is_(None),
                    CourseClass.deleted_at.is_(None),
                )
            ).scalar_one_or_none()
            if not owns:
                raise
        stmt = select(AssignmentGrade).join(Assignment, Assignment.id == AssignmentGrade.assignment_id).where(
            AssignmentGrade.student_id == student_id,
            AssignmentGrade.deleted_at.is_(None),
            Assignment.deleted_at.is_(None),
        )
        if class_id:
            stmt = stmt.where(Assignment.class_id == class_id)
        if assignment_type:
            stmt = stmt.where(Assignment.assignment_type == _enum(AssignmentType, assignment_type, "assignment type"))
        total = self.db.execute(select(func.count()).select_from(stmt.subquery())).scalar_one()
        stmt = stmt.order_by(AssignmentGrade.graded_at.desc().nullslast(), AssignmentGrade.created_at.desc())
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        return list(self.db.execute(stmt).scalars().all()), int(total)

    def grade_dict(self, grade: AssignmentGrade) -> dict[str, Any]:
        return {
            "id": str(grade.id),
            "submission_id": str(grade.submission_id),
            "assignment_id": str(grade.assignment_id),
            "student_id": str(grade.student_id),
            "score": float(grade.score) if grade.score is not None else None,
            "max_score": float(grade.max_score),
            "feedback": grade.feedback,
            "rubric": grade.rubric,
            "grading_method": grade.grading_method.value,
            "ai_grading_result_id": str(grade.ai_grading_result_id) if grade.ai_grading_result_id else None,
            "graded_by": str(grade.graded_by) if grade.graded_by else None,
            "graded_at": grade.graded_at,
        }

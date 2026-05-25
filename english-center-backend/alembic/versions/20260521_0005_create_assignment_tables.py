"""create assignment tables

Revision ID: 20260521_0005
Revises: 20260521_0004
Create Date: 2026-05-21
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260521_0005"
down_revision = "20260521_0004"
branch_labels = None
depends_on = None


def timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    ]


def upgrade() -> None:
    assignment_type = sa.Enum("homework", "writing", "speaking", "reading", "listening", "grammar", "vocabulary", "project", "other", name="assignment_type")
    assignment_status = sa.Enum("draft", "published", "closed", "archived", name="assignment_status")
    assignment_attachment_type = sa.Enum("file", "link", name="assignment_attachment_type")
    assignment_submission_status = sa.Enum("draft", "submitted", "late", "graded", "returned", "cancelled", name="assignment_submission_status")
    assignment_grading_method = sa.Enum("teacher", "ai", "mixed", name="assignment_grading_method")
    for enum in [assignment_type, assignment_status, assignment_attachment_type, assignment_submission_status, assignment_grading_method]:
        enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "assignments",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("class_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("classes.id"), nullable=False),
        sa.Column("session_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("class_sessions.id"), nullable=True),
        sa.Column("lesson_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("lessons.id"), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("instruction", sa.Text(), nullable=True),
        sa.Column("assignment_type", assignment_type, nullable=False, server_default="homework"),
        sa.Column("status", assignment_status, nullable=False, server_default="draft"),
        sa.Column("max_score", sa.Numeric(5, 2), nullable=False, server_default="10"),
        sa.Column("due_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("allow_late_submission", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        *timestamps(),
    )
    op.create_index("ix_assignments_class_id", "assignments", ["class_id"])
    op.create_index("ix_assignments_session_id", "assignments", ["session_id"])
    op.create_index("ix_assignments_lesson_id", "assignments", ["lesson_id"])
    op.create_index("ix_assignments_status", "assignments", ["status"])
    op.create_index("ix_assignments_assignment_type", "assignments", ["assignment_type"])
    op.create_index("ix_assignments_due_at", "assignments", ["due_at"])

    op.create_table(
        "assignment_attachments",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("assignment_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("assignments.id"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("file_bucket", sa.String(length=100), nullable=True),
        sa.Column("file_object_name", sa.String(length=500), nullable=True),
        sa.Column("external_url", sa.String(length=1000), nullable=True),
        sa.Column("content_type", sa.String(length=255), nullable=True),
        sa.Column("file_size", sa.Integer(), nullable=True),
        sa.Column("attachment_type", assignment_attachment_type, nullable=False, server_default="file"),
        sa.Column("order_index", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("uploaded_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        *timestamps(),
    )
    op.create_index("ix_assignment_attachments_assignment_id", "assignment_attachments", ["assignment_id"])

    op.create_table(
        "assignment_submissions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("assignment_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("assignments.id"), nullable=False),
        sa.Column("student_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("students.id"), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("status", assignment_submission_status, nullable=False, server_default="draft"),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_late", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("attempt_number", sa.Integer(), nullable=False, server_default="1"),
        *timestamps(),
        sa.UniqueConstraint("assignment_id", "student_id", "attempt_number", name="uq_assignment_submission_attempt"),
    )
    op.create_index("ix_assignment_submissions_assignment_id", "assignment_submissions", ["assignment_id"])
    op.create_index("ix_assignment_submissions_student_id", "assignment_submissions", ["student_id"])
    op.create_index("ix_assignment_submissions_user_id", "assignment_submissions", ["user_id"])
    op.create_index("ix_assignment_submissions_status", "assignment_submissions", ["status"])

    op.create_table(
        "submission_attachments",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("submission_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("assignment_submissions.id"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=True),
        sa.Column("file_bucket", sa.String(length=100), nullable=False),
        sa.Column("file_object_name", sa.String(length=500), nullable=False),
        sa.Column("original_filename", sa.String(length=255), nullable=True),
        sa.Column("content_type", sa.String(length=255), nullable=True),
        sa.Column("file_size", sa.Integer(), nullable=True),
        sa.Column("uploaded_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        *timestamps(),
    )
    op.create_index("ix_submission_attachments_submission_id", "submission_attachments", ["submission_id"])

    op.create_table(
        "assignment_grades",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("submission_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("assignment_submissions.id"), nullable=False, unique=True),
        sa.Column("assignment_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("assignments.id"), nullable=False),
        sa.Column("student_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("students.id"), nullable=False),
        sa.Column("score", sa.Numeric(5, 2), nullable=True),
        sa.Column("max_score", sa.Numeric(5, 2), nullable=False, server_default="10"),
        sa.Column("feedback", sa.Text(), nullable=True),
        sa.Column("rubric", postgresql.JSONB(), nullable=True),
        sa.Column("graded_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("graded_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("grading_method", assignment_grading_method, nullable=False, server_default="teacher"),
        sa.Column("ai_grading_result_id", postgresql.UUID(as_uuid=True), nullable=True),
        *timestamps(),
    )
    op.create_index("ix_assignment_grades_submission_id", "assignment_grades", ["submission_id"])
    op.create_index("ix_assignment_grades_assignment_id", "assignment_grades", ["assignment_id"])
    op.create_index("ix_assignment_grades_student_id", "assignment_grades", ["student_id"])


def downgrade() -> None:
    op.drop_table("assignment_grades")
    op.drop_table("submission_attachments")
    op.drop_table("assignment_submissions")
    op.drop_table("assignment_attachments")
    op.drop_table("assignments")
    for enum_name in [
        "assignment_grading_method",
        "assignment_submission_status",
        "assignment_attachment_type",
        "assignment_status",
        "assignment_type",
    ]:
        sa.Enum(name=enum_name).drop(op.get_bind(), checkfirst=True)

"""refactor assignment types and questions

Revision ID: 20260529_0009
Revises: 20260529_0008
Create Date: 2026-05-29
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import uuid

revision = "20260529_0009"
down_revision = "20260529_0008"
branch_labels = None
depends_on = None


def timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    ]


def upgrade() -> None:
    bind = op.get_bind()

    assignment_type_status = sa.Enum("active", "inactive", name="assignment_type_status")
    assignment_question_type = sa.Enum("single_choice", "multiple_choice", "text_answer", "file_upload", name="assignment_question_type")


    op.create_table(
        "assignment_types",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("code", sa.String(length=100), nullable=False, unique=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_auto_gradable", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("requires_file_submission", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("allow_text_submission", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("allow_file_submission", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("status", assignment_type_status, nullable=False, server_default="active"),
        *timestamps(),
    )
    op.create_index("ix_assignment_types_code", "assignment_types", ["code"], unique=True)
    op.create_index("ix_assignment_types_status", "assignment_types", ["status"], unique=False)

    seed_rows = [
        ("homework", "Homework", False, False, True, False),
        ("quiz", "Quiz", True, False, False, False),
        ("exam", "Exam", False, False, True, False),
        ("practice", "Practice", True, False, True, False),
        ("project", "Project", False, True, True, True),
        ("speaking", "Speaking", False, False, True, False),
        ("writing", "Writing", False, False, True, False),
        ("file_upload", "File Upload", False, True, False, True),
        ("mixed", "Mixed", False, True, True, True),
    ]
    for code, name, is_auto_gradable, requires_file_submission, allow_text_submission, allow_file_submission in seed_rows:
        bind.execute(
            sa.text(
                """
                INSERT INTO assignment_types (
                    id, code, name, description, is_auto_gradable, requires_file_submission, allow_text_submission, allow_file_submission, status, created_at, updated_at, deleted_at
                )
                VALUES (
                    :id, :code, :name, NULL, :is_auto_gradable, :requires_file_submission, :allow_text_submission, :allow_file_submission, 'active', now(), now(), NULL
                )
                ON CONFLICT (code) DO NOTHING
                """
            ),
            {
                "id": uuid.uuid4(),
                "code": code,
                "name": name,
                "is_auto_gradable": is_auto_gradable,
                "requires_file_submission": requires_file_submission,
                "allow_text_submission": allow_text_submission,
                "allow_file_submission": allow_file_submission,
            },
        )

    op.add_column("assignments", sa.Column("assignment_type_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index("ix_assignments_assignment_type_id", "assignments", ["assignment_type_id"], unique=False)
    op.create_foreign_key("fk_assignments_assignment_type_id", "assignments", "assignment_types", ["assignment_type_id"], ["id"])

    op.execute(
        sa.text(
            """
            UPDATE assignments a
            SET assignment_type_id = t.id
            FROM assignment_types t
            WHERE t.code = CASE a.assignment_type::text
                WHEN 'homework' THEN 'homework'
                WHEN 'writing' THEN 'writing'
                WHEN 'speaking' THEN 'speaking'
                WHEN 'project' THEN 'project'
                ELSE 'practice'
            END
            """
        )
    )
    op.execute(
        sa.text(
            """
            UPDATE assignments
            SET assignment_type_id = (SELECT id FROM assignment_types WHERE code = 'homework' LIMIT 1)
            WHERE assignment_type_id IS NULL
            """
        )
    )
    op.alter_column("assignments", "assignment_type_id", nullable=False)
    op.drop_index("ix_assignments_assignment_type", table_name="assignments")
    op.drop_column("assignments", "assignment_type")
    sa.Enum(name="assignment_type").drop(bind, checkfirst=True)

    op.create_table(
        "assignment_questions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("assignment_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("assignments.id"), nullable=False),
        sa.Column("question_type", assignment_question_type, nullable=False),
        sa.Column("question_text", sa.Text(), nullable=False),
        sa.Column("score", sa.Numeric(5, 2), nullable=False, server_default="0"),
        sa.Column("order_index", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_required", sa.Boolean(), nullable=False, server_default=sa.true()),
        *timestamps(),
    )
    op.create_index("ix_assignment_questions_assignment_id", "assignment_questions", ["assignment_id"], unique=False)
    op.create_index("ix_assignment_questions_question_type", "assignment_questions", ["question_type"], unique=False)

    op.create_table(
        "assignment_question_options",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("question_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("assignment_questions.id"), nullable=False),
        sa.Column("option_text", sa.Text(), nullable=False),
        sa.Column("is_correct", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("order_index", sa.Integer(), nullable=False, server_default="0"),
        *timestamps(),
    )
    op.create_index("ix_assignment_question_options_question_id", "assignment_question_options", ["question_id"], unique=False)

    op.create_table(
        "submission_answers",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("submission_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("assignment_submissions.id"), nullable=False),
        sa.Column("question_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("assignment_questions.id"), nullable=False),
        sa.Column("answer_text", sa.Text(), nullable=True),
        sa.Column("selected_option_ids", postgresql.JSONB(), nullable=True),
        sa.Column("is_correct", sa.Boolean(), nullable=True),
        sa.Column("score", sa.Numeric(5, 2), nullable=True),
        *timestamps(),
        sa.UniqueConstraint("submission_id", "question_id", name="uq_submission_answers_submission_question"),
    )
    op.create_index("ix_submission_answers_submission_id", "submission_answers", ["submission_id"], unique=False)
    op.create_index("ix_submission_answers_question_id", "submission_answers", ["question_id"], unique=False)

    op.create_table(
        "submission_answer_media",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("submission_answer_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("submission_answers.id"), nullable=False),
        sa.Column("media_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("media.id"), nullable=False),
        *timestamps(),
        sa.UniqueConstraint("submission_answer_id", "media_id", name="uq_submission_answer_media"),
    )
    op.create_index("ix_submission_answer_media_submission_answer_id", "submission_answer_media", ["submission_answer_id"], unique=False)
    op.create_index("ix_submission_answer_media_media_id", "submission_answer_media", ["media_id"], unique=False)


def downgrade() -> None:
    bind = op.get_bind()
    assignment_type = sa.Enum("homework", "writing", "speaking", "reading", "listening", "grammar", "vocabulary", "project", "other", name="assignment_type")
    assignment_type.create(bind, checkfirst=True)
    op.add_column("assignments", sa.Column("assignment_type", assignment_type, nullable=False, server_default="homework"))
    op.execute(
        sa.text(
            """
            UPDATE assignments a
            SET assignment_type = CASE t.code
                WHEN 'writing' THEN 'writing'
                WHEN 'speaking' THEN 'speaking'
                WHEN 'project' THEN 'project'
                ELSE 'homework'
            END::assignment_type
            FROM assignment_types t
            WHERE a.assignment_type_id = t.id
            """
        )
    )
    op.create_index("ix_assignments_assignment_type", "assignments", ["assignment_type"], unique=False)
    op.drop_constraint("fk_assignments_assignment_type_id", "assignments", type_="foreignkey")
    op.drop_index("ix_assignments_assignment_type_id", table_name="assignments")
    op.drop_column("assignments", "assignment_type_id")

    op.drop_index("ix_submission_answer_media_media_id", table_name="submission_answer_media")
    op.drop_index("ix_submission_answer_media_submission_answer_id", table_name="submission_answer_media")
    op.drop_table("submission_answer_media")
    op.drop_index("ix_submission_answers_question_id", table_name="submission_answers")
    op.drop_index("ix_submission_answers_submission_id", table_name="submission_answers")
    op.drop_table("submission_answers")
    op.drop_index("ix_assignment_question_options_question_id", table_name="assignment_question_options")
    op.drop_table("assignment_question_options")
    op.drop_index("ix_assignment_questions_question_type", table_name="assignment_questions")
    op.drop_index("ix_assignment_questions_assignment_id", table_name="assignment_questions")
    op.drop_table("assignment_questions")

    op.drop_index("ix_assignment_types_status", table_name="assignment_types")
    op.drop_index("ix_assignment_types_code", table_name="assignment_types")
    op.drop_table("assignment_types")
    sa.Enum(name="assignment_question_type").drop(bind, checkfirst=True)
    sa.Enum(name="assignment_type_status").drop(bind, checkfirst=True)

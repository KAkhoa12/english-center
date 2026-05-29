"""create classroom attendance tables

Revision ID: 20260521_0004
Revises: 20260521_0003
Create Date: 2026-05-21
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260521_0004"
down_revision = "20260521_0003"
branch_labels = None
depends_on = None


def timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    ]


def upgrade() -> None:
    room_status = sa.Enum("active", "maintenance", "inactive", name="room_status")
    class_type = sa.Enum("online", "offline", "hybrid", name="class_type")
    class_status = sa.Enum("planned", "ongoing", "completed", "cancelled", "archived", name="class_status")
    class_enrollment_status = sa.Enum("enrolled", "completed", "dropped", "cancelled", name="class_enrollment_status")
    session_mode = sa.Enum("online", "offline", name="session_mode")
    session_status = sa.Enum("scheduled", "completed", "cancelled", name="session_status")
    attendance_status = sa.Enum("present", "absent", "late", "excused", "not_marked", name="attendance_status")

    op.create_table(
        "rooms",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("capacity", sa.Integer(), nullable=False),
        sa.Column("location", sa.String(length=255), nullable=True),
        sa.Column("status", room_status, nullable=False, server_default="active"),
        *timestamps(),
        sa.UniqueConstraint("name", name="uq_rooms_name"),
    )
    op.create_index("ix_rooms_name", "rooms", ["name"], unique=False)
    op.create_index("ix_rooms_status", "rooms", ["status"], unique=False)

    op.create_table(
        "classes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("course_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("teacher_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("teachers.id"), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("code", sa.String(length=100), nullable=True),
        sa.Column("class_type", class_type, nullable=False, server_default="offline"),
        sa.Column("max_students", sa.Integer(), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column("status", class_status, nullable=False, server_default="planned"),
        *timestamps(),
        sa.UniqueConstraint("code", name="uq_classes_code"),
    )
    op.create_index("ix_classes_course_id", "classes", ["course_id"], unique=False)
    op.create_index("ix_classes_teacher_id", "classes", ["teacher_id"], unique=False)
    op.create_index("ix_classes_status", "classes", ["status"], unique=False)
    op.create_index("ix_classes_class_type", "classes", ["class_type"], unique=False)
    op.create_index("ix_classes_code", "classes", ["code"], unique=False)

    op.create_table(
        "class_students",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("class_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("classes.id"), nullable=False),
        sa.Column("student_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("students.id"), nullable=False),
        sa.Column("enrollment_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("course_enrollments.id"), nullable=True),
        sa.Column("enrollment_status", class_enrollment_status, nullable=False, server_default="enrolled"),
        sa.Column("enrolled_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("final_score", sa.Numeric(5, 2), nullable=True),
        sa.Column("note", sa.Text(), nullable=True),
        *timestamps(),
        sa.UniqueConstraint("class_id", "student_id", name="uq_class_students_class_student"),
    )
    op.create_index("ix_class_students_class_id", "class_students", ["class_id"], unique=False)
    op.create_index("ix_class_students_student_id", "class_students", ["student_id"], unique=False)
    op.create_index("ix_class_students_enrollment_status", "class_students", ["enrollment_status"], unique=False)

    op.create_table(
        "class_sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("class_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("classes.id"), nullable=False),
        sa.Column("teacher_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("teachers.id"), nullable=True),
        sa.Column("lesson_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("lessons.id"), nullable=True),
        sa.Column("room_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("rooms.id"), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("session_date", sa.Date(), nullable=False),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column("end_time", sa.Time(), nullable=False),
        sa.Column("mode", session_mode, nullable=False, server_default="offline"),
        sa.Column("meeting_url", sa.String(length=1000), nullable=True),
        sa.Column("status", session_status, nullable=False, server_default="scheduled"),
        sa.Column("note", sa.Text(), nullable=True),
        *timestamps(),
    )
    op.create_index("ix_class_sessions_class_id", "class_sessions", ["class_id"], unique=False)
    op.create_index("ix_class_sessions_teacher_id", "class_sessions", ["teacher_id"], unique=False)
    op.create_index("ix_class_sessions_room_id", "class_sessions", ["room_id"], unique=False)
    op.create_index("ix_class_sessions_session_date", "class_sessions", ["session_date"], unique=False)
    op.create_index("ix_class_sessions_status", "class_sessions", ["status"], unique=False)

    op.create_table(
        "attendances",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("session_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("class_sessions.id"), nullable=False),
        sa.Column("class_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("classes.id"), nullable=False),
        sa.Column("student_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("students.id"), nullable=False),
        sa.Column("status", attendance_status, nullable=False, server_default="not_marked"),
        sa.Column("check_in_time", sa.DateTime(timezone=True), nullable=True),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("recorded_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("recorded_at", sa.DateTime(timezone=True), nullable=True),
        *timestamps(),
        sa.UniqueConstraint("session_id", "student_id", name="uq_attendances_session_student"),
    )
    op.create_index("ix_attendances_session_id", "attendances", ["session_id"], unique=False)
    op.create_index("ix_attendances_class_id", "attendances", ["class_id"], unique=False)
    op.create_index("ix_attendances_student_id", "attendances", ["student_id"], unique=False)
    op.create_index("ix_attendances_status", "attendances", ["status"], unique=False)


def downgrade() -> None:
    op.drop_table("attendances")
    op.drop_table("class_sessions")
    op.drop_table("class_students")
    op.drop_table("classes")
    op.drop_table("rooms")
    for enum_name in [
        "attendance_status",
        "session_status",
        "session_mode",
        "class_enrollment_status",
        "class_status",
        "class_type",
        "room_status",
    ]:
        sa.Enum(name=enum_name).drop(op.get_bind(), checkfirst=True)

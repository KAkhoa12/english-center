"""refactor class schedules

Revision ID: 20260621_0015
Revises: 20260614_0014
Create Date: 2026-06-21 00:00:00.000000
"""

from __future__ import annotations

import uuid

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "20260621_0015"
down_revision = "20260614_0014"
branch_labels = None
depends_on = None


schedule_name_enum = postgresql.ENUM(
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "CN",
    name="class_schedule_name",
    create_type=False,
)


def _weekday_name(session_date) -> str:
    return ["T2", "T3", "T4", "T5", "T6", "T7", "CN"][session_date.weekday()]


def upgrade() -> None:
    bind = op.get_bind()
    schedule_name_enum.create(bind, checkfirst=True)

    op.create_table(
        "class_schedules",
        sa.Column("class_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("classes.id"), nullable=False),
        sa.Column("schedule_name", schedule_name_enum, nullable=False),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column("end_time", sa.Time(), nullable=False),
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("class_id", "schedule_name", "start_time", "end_time", name="uq_class_schedule_time"),
    )
    op.create_index("ix_class_schedules_class_id", "class_schedules", ["class_id"], unique=False)
    op.create_index("ix_class_schedules_schedule_name", "class_schedules", ["schedule_name"], unique=False)

    op.add_column("class_sessions", sa.Column("class_schedule_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.add_column("class_sessions", sa.Column("override_start_time", sa.Time(), nullable=True))
    op.add_column("class_sessions", sa.Column("override_end_time", sa.Time(), nullable=True))
    op.create_index("ix_class_sessions_class_schedule_id", "class_sessions", ["class_schedule_id"], unique=False)
    op.create_foreign_key("fk_class_sessions_class_schedule_id", "class_sessions", "class_schedules", ["class_schedule_id"], ["id"])

    rows = bind.execute(
        sa.text(
            """
            SELECT id, class_id, session_date, start_time, end_time
            FROM class_sessions
            ORDER BY session_date ASC, start_time ASC
            """
        )
    ).mappings().all()

    schedule_ids: dict[tuple[str, str, str, str], uuid.UUID] = {}
    for row in rows:
        schedule_name = _weekday_name(row["session_date"])
        key = (str(row["class_id"]), schedule_name, str(row["start_time"]), str(row["end_time"]))
        schedule_id = schedule_ids.get(key)
        if schedule_id is None:
            schedule_id = uuid.uuid4()
            schedule_ids[key] = schedule_id
            bind.execute(
                sa.text(
                    """
                    INSERT INTO class_schedules (id, class_id, schedule_name, start_time, end_time)
                    VALUES (:id, :class_id, :schedule_name, :start_time, :end_time)
                    """
                ),
                {
                    "id": schedule_id,
                    "class_id": row["class_id"],
                    "schedule_name": schedule_name,
                    "start_time": row["start_time"],
                    "end_time": row["end_time"],
                },
            )
        bind.execute(
            sa.text("UPDATE class_sessions SET class_schedule_id = :schedule_id WHERE id = :session_id"),
            {"schedule_id": schedule_id, "session_id": row["id"]},
        )

    op.alter_column("class_sessions", "class_schedule_id", existing_type=postgresql.UUID(as_uuid=True), nullable=False)
    op.drop_column("class_sessions", "start_time")
    op.drop_column("class_sessions", "end_time")
    op.drop_column("classes", "end_date")
    op.drop_column("courses", "duration_weeks")


def downgrade() -> None:
    op.add_column("courses", sa.Column("duration_weeks", sa.Integer(), nullable=True))
    op.add_column("classes", sa.Column("end_date", sa.Date(), nullable=True))
    op.add_column("class_sessions", sa.Column("start_time", sa.Time(), nullable=True))
    op.add_column("class_sessions", sa.Column("end_time", sa.Time(), nullable=True))

    bind = op.get_bind()
    bind.execute(
        sa.text(
            """
            UPDATE class_sessions AS cs
            SET
                start_time = COALESCE(cs.override_start_time, sch.start_time),
                end_time = COALESCE(cs.override_end_time, sch.end_time)
            FROM class_schedules AS sch
            WHERE sch.id = cs.class_schedule_id
            """
        )
    )
    op.alter_column("class_sessions", "start_time", existing_type=sa.Time(), nullable=False)
    op.alter_column("class_sessions", "end_time", existing_type=sa.Time(), nullable=False)

    op.drop_constraint("fk_class_sessions_class_schedule_id", "class_sessions", type_="foreignkey")
    op.drop_index("ix_class_sessions_class_schedule_id", table_name="class_sessions")
    op.drop_column("class_sessions", "override_end_time")
    op.drop_column("class_sessions", "override_start_time")
    op.drop_column("class_sessions", "class_schedule_id")

    op.drop_index("ix_class_schedules_schedule_name", table_name="class_schedules")
    op.drop_index("ix_class_schedules_class_id", table_name="class_schedules")
    op.drop_table("class_schedules")
    schedule_name_enum.drop(bind, checkfirst=True)

"""init rbac profiles

Revision ID: 20260520_0001
Revises:
Create Date: 2026-05-20
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260520_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    user_status = sa.Enum("active", "inactive", "banned", name="user_status")
    student_level = sa.Enum("beginner", "elementary", "intermediate", "upper_intermediate", "advanced", name="student_level")
    user_status.create(op.get_bind(), checkfirst=True)
    student_level.create(op.get_bind(), checkfirst=True)

    op.create_table("users", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("full_name", sa.String(255), nullable=False), sa.Column("email", sa.String(255), nullable=False, unique=True), sa.Column("phone", sa.String(30), nullable=True), sa.Column("password_hash", sa.String(255), nullable=False), sa.Column("avatar_url", sa.String(500), nullable=True), sa.Column("status", user_status, nullable=False, server_default="active"), sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.false()), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True))
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_table("roles", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("name", sa.String(100), nullable=False, unique=True), sa.Column("description", sa.Text(), nullable=True), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True))
    op.create_table("permissions", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("code", sa.String(150), nullable=False, unique=True), sa.Column("name", sa.String(255), nullable=True), sa.Column("description", sa.Text(), nullable=True), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True))
    op.create_table("user_roles", sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), primary_key=True), sa.Column("role_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("roles.id"), primary_key=True), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True), sa.UniqueConstraint("user_id", "role_id", name="uq_user_roles_user_role"))
    op.create_table("role_permissions", sa.Column("role_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("roles.id"), primary_key=True), sa.Column("permission_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("permissions.id"), primary_key=True), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True), sa.UniqueConstraint("role_id", "permission_id", name="uq_role_permissions_role_permission"))
    op.create_table("students", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), unique=True, nullable=False), sa.Column("date_of_birth", sa.Date(), nullable=True), sa.Column("gender", sa.String(20), nullable=True), sa.Column("address", sa.Text(), nullable=True), sa.Column("level", student_level, nullable=True), sa.Column("learning_goal", sa.Text(), nullable=True), sa.Column("parent_name", sa.String(255), nullable=True), sa.Column("parent_phone", sa.String(30), nullable=True), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True))
    op.create_table("teachers", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), unique=True, nullable=False), sa.Column("specialization", sa.String(255), nullable=True), sa.Column("bio", sa.Text(), nullable=True), sa.Column("experience_years", sa.Integer(), nullable=False, server_default="0"), sa.Column("certificates", postgresql.JSONB(astext_type=sa.Text()), nullable=True), sa.Column("hourly_rate", sa.Numeric(12, 2), nullable=True), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True))
    op.create_table("staff_profiles", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), unique=True, nullable=False), sa.Column("position", sa.String(255), nullable=True), sa.Column("department", sa.String(255), nullable=True), sa.Column("note", sa.Text(), nullable=True), sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()), sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_table("staff_profiles")
    op.drop_table("teachers")
    op.drop_table("students")
    op.drop_table("role_permissions")
    op.drop_table("user_roles")
    op.drop_table("permissions")
    op.drop_table("roles")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
    sa.Enum(name="student_level").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="user_status").drop(op.get_bind(), checkfirst=True)

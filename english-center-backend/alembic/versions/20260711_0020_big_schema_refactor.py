"""big schema refactor

Revision ID: 20260711_0020
Revises: 20260710_0019
Create Date: 2026-07-11
"""

from alembic import op
import sqlalchemy as sa


revision = "20260711_0020"
down_revision = "20260710_0019"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # =========================================================
    # CLASS / SCHEDULE REFACTOR
    # =========================================================
    op.add_column(
        "class_schedules",
        sa.Column("shift_number", sa.Integer(), nullable=True),
    )

    # classes.room_id already exists in the current database.
    # class_sessions.room_id already exists in the current database.
    # Do not add them again.

    # Create the new many-to-many session-teacher table first.
    op.create_table(
        "class_sessions_teachers",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "class_session_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("class_sessions.id"),
            nullable=False,
        ),
        sa.Column(
            "user_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=False,
        ),
        sa.Column(
            "is_primary_teacher",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.create_index(
        "ix_class_sessions_teachers_class_session_id",
        "class_sessions_teachers",
        ["class_session_id"],
    )
    op.create_index(
        "ix_class_sessions_teachers_user_id",
        "class_sessions_teachers",
        ["user_id"],
    )

    # Migrate existing class_sessions.teacher_id data before dropping the column.
    # class_sessions.teacher_id references teachers.id,
    # while the new table stores users.id.
    op.execute(
        sa.text(
            """
            INSERT INTO class_sessions_teachers (
                id,
                class_session_id,
                user_id,
                is_primary_teacher,
                created_at,
                updated_at,
                deleted_at
            )
            SELECT
                gen_random_uuid(),
                cs.id,
                t.user_id,
                true,
                now(),
                now(),
                NULL
            FROM class_sessions cs
            JOIN teachers t ON t.id = cs.teacher_id
            WHERE cs.teacher_id IS NOT NULL
            """
        )
    )

    op.drop_column("class_sessions", "teacher_id")

    # Keep class_sessions.lesson_id because it still represents
    # the lesson taught in a specific class session.

    # =========================================================
    # COURSE REFACTOR
    # =========================================================
    op.add_column("courses", sa.Column("requirements", sa.JSON(), nullable=True))
    op.add_column("courses", sa.Column("outcomes", sa.JSON(), nullable=True))
    op.add_column(
        "courses",
        sa.Column("discount_price", sa.Numeric(12, 2), nullable=True),
    )
    op.add_column(
        "courses",
        sa.Column("total_duration_time", sa.Integer(), nullable=True),
    )

    op.execute(
        sa.text(
            """
            UPDATE courses c
            SET requirements = req.requirements
            FROM (
                SELECT
                    course_id,
                    json_agg(requirement_text ORDER BY order_index) AS requirements
                FROM course_requirements
                WHERE deleted_at IS NULL
                GROUP BY course_id
            ) AS req
            WHERE c.id = req.course_id
            """
        )
    )

    op.execute(
        sa.text(
            """
            UPDATE courses c
            SET outcomes = outc.outcomes
            FROM (
                SELECT
                    course_id,
                    json_agg(outcome_text ORDER BY order_index) AS outcomes
                FROM course_outcomes
                WHERE deleted_at IS NULL
                GROUP BY course_id
            ) AS outc
            WHERE c.id = outc.course_id
            """
        )
    )

    # =========================================================
    # ASSIGNMENT REFACTOR
    # =========================================================
    op.add_column(
        "assignments",
        sa.Column("duration_time", sa.Integer(), nullable=True),
    )
    op.add_column(
        "assignments",
        sa.Column("content", sa.JSON(), nullable=True),
    )
    op.add_column(
        "assignments",
        sa.Column(
            "total_attempt",
            sa.Integer(),
            nullable=False,
            server_default="1",
        ),
    )

    op.add_column(
        "assignment_attachments",
        sa.Column("media_id", sa.UUID(as_uuid=True), nullable=True),
    )
    op.add_column(
        "assignment_attachments",
        sa.Column("location_folder", sa.String(length=255), nullable=True),
    )
    op.drop_column("assignment_attachments", "file_bucket")
    op.drop_column("assignment_attachments", "file_object_name")
    op.drop_column("assignment_attachments", "external_url")
    op.drop_column("assignment_attachments", "content_type")
    op.drop_column("assignment_attachments", "file_size")
    op.drop_column("assignment_attachments", "uploaded_by")

    op.add_column(
        "assignment_questions",
        sa.Column("media_id", sa.UUID(as_uuid=True), nullable=True),
    )
    op.add_column(
        "assignment_questions",
        sa.Column("location_folder", sa.String(length=255), nullable=True),
    )

    op.add_column(
        "assignment_submissions",
        sa.Column("note", sa.Text(), nullable=True),
    )
    op.drop_column("assignment_submissions", "content")

    op.add_column(
        "submission_answer_media",
        sa.Column("location_folder", sa.String(length=255), nullable=True),
    )

    # Old normalized course requirement/outcome data has already been copied.
    op.drop_table("course_requirements")
    op.drop_table("course_outcomes")

    # =========================================================
    # MEDIA SHARE
    # =========================================================
    op.create_table(
        "media_share",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "media_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("media.id"),
            nullable=False,
        ),
        sa.Column(
            "user_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=False,
        ),
        sa.Column("permissions", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )

    # =========================================================
    # CONSULTATION REFACTOR
    # =========================================================
    # Create the new table before copying data into it.
    op.create_table(
        "consultations",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "user_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),
        sa.Column(
            "student_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("students.id"),
            nullable=True,
        ),
        sa.Column("customer_name", sa.String(length=255), nullable=True),
        sa.Column("customer_phone", sa.String(length=30), nullable=True),
        sa.Column("customer_email", sa.String(length=255), nullable=True),
        sa.Column(
            "interested_course_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("courses.id"),
            nullable=True,
        ),
        sa.Column(
            "interested_class_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("classes.id"),
            nullable=True,
        ),
        sa.Column(
            "assigned_staff_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),
        sa.Column(
            "status",
            sa.String(length=30),
            nullable=False,
            server_default="new",
        ),
        sa.Column(
            "source",
            sa.String(length=30),
            nullable=False,
            server_default="other",
        ),
        sa.Column("learning_goal", sa.Text(), nullable=True),
        sa.Column("current_level", sa.String(length=100), nullable=True),
        sa.Column("preferred_schedule", sa.String(length=255), nullable=True),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )

    # Copy old guest enrollment data.
    op.execute(
        sa.text(
            """
            INSERT INTO consultations (
                id,
                customer_name,
                note,
                status,
                source,
                created_at,
                updated_at,
                deleted_at
            )
            SELECT
                gen_random_uuid(),
                NULL,
                content,
                'new',
                'other',
                created_at,
                updated_at,
                deleted_at
            FROM guest_enrollments
            """
        )
    )

    op.drop_table("guest_enrollments")

    # =========================================================
    # ORDER REFACTOR
    # =========================================================
    op.add_column(
        "orders",
        sa.Column(
            "order_type",
            sa.String(length=20),
            nullable=False,
            server_default="center",
        ),
    )
    op.add_column(
        "orders",
        sa.Column("consultation_id", sa.UUID(as_uuid=True), nullable=True),
    )
    op.add_column(
        "orders",
        sa.Column("confirmed_by", sa.UUID(as_uuid=True), nullable=True),
    )
    op.add_column(
        "orders",
        sa.Column("confirmed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "orders",
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.drop_column("orders", "invoice_number")
    op.drop_column("orders", "payment_method")
    op.drop_column("orders", "paid_at")

    # =========================================================
    # CART / ORDER ITEMS
    # =========================================================
    op.add_column(
        "cart_items",
        sa.Column("student_id", sa.UUID(as_uuid=True), nullable=True),
    )
    op.drop_column("cart_items", "class_id")
    op.drop_column("cart_items", "quantity")
    op.drop_column("cart_items", "total_price")

    op.add_column(
        "order_items",
        sa.Column("student_id", sa.UUID(as_uuid=True), nullable=True),
    )
    op.add_column(
        "order_items",
        sa.Column(
            "discount_amount",
            sa.Numeric(12, 2),
            nullable=False,
            server_default="0",
        ),
    )
    op.add_column(
        "order_items",
        sa.Column(
            "final_amount",
            sa.Numeric(12, 2),
            nullable=False,
            server_default="0",
        ),
    )
    op.drop_column("order_items", "quantity")
    op.drop_column("order_items", "total_price")

    # =========================================================
    # INVOICE REFACTOR
    # =========================================================
    op.drop_constraint(
        "invoices_order_id_key",
        "invoices",
        type_="unique",
    )
    op.add_column(
        "invoices",
        sa.Column("installment_id", sa.UUID(as_uuid=True), nullable=True),
    )
    op.add_column(
        "invoices",
        sa.Column("due_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.drop_column("invoices", "subtotal_amount")
    op.drop_column("invoices", "discount_amount")

    op.drop_table("invoice_items")

    # =========================================================
    # PAYMENT REFACTOR
    # =========================================================
    op.add_column(
        "payments",
        sa.Column("installment_id", sa.UUID(as_uuid=True), nullable=True),
    )
    op.add_column(
        "payments",
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "payments",
        sa.Column("failed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "payments",
        sa.Column("cancelled_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "payments",
        sa.Column("collected_by", sa.UUID(as_uuid=True), nullable=True),
    )
    op.add_column(
        "payments",
        sa.Column("note", sa.Text(), nullable=True),
    )

    # =========================================================
    # COURSE ENROLLMENT REFACTOR
    # =========================================================
    op.add_column(
        "course_enrollments",
        sa.Column(
            "enrollment_type",
            sa.String(length=20),
            nullable=False,
            server_default="center",
        ),
    )
    op.add_column(
        "course_enrollments",
        sa.Column("access_started_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "course_enrollments",
        sa.Column("access_expires_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.drop_constraint(
        "uq_course_enrollments_user_course",
        "course_enrollments",
        type_="unique",
    )
    op.drop_column("course_enrollments", "user_id")
    op.drop_column("course_enrollments", "order_id")

    # =========================================================
    # PAYMENT PLAN
    # =========================================================
    op.create_table(
        "payment_plans",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "order_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("orders.id"),
            nullable=False,
        ),
        sa.Column("plan_type", sa.String(length=30), nullable=False),
        sa.Column("total_amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("deposit_amount", sa.Numeric(12, 2), nullable=True),
        sa.Column("installment_count", sa.Integer(), nullable=True),
        sa.Column("grace_period_days", sa.Integer(), nullable=True),
        sa.Column(
            "status",
            sa.String(length=20),
            nullable=False,
            server_default="active",
        ),
        sa.Column(
            "created_by",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),
        sa.Column(
            "approved_by",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.create_table(
        "payment_installments",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "payment_plan_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("payment_plans.id"),
            nullable=False,
        ),
        sa.Column("installment_number", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("due_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("grace_period_days", sa.Integer(), nullable=True),
        sa.Column(
            "status",
            sa.String(length=30),
            nullable=False,
            server_default="pending",
        ),
        sa.Column("paid_amount", sa.Numeric(12, 2), nullable=True),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.create_table(
        "payment_reminders",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "installment_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("payment_installments.id"),
            nullable=False,
        ),
        sa.Column("reminder_type", sa.String(length=30), nullable=False),
        sa.Column("channel", sa.String(length=20), nullable=False),
        sa.Column(
            "recipient_user_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=True,
        ),
        sa.Column("scheduled_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "status",
            sa.String(length=20),
            nullable=False,
            server_default="pending",
        ),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    # =========================================================
    # PAYMENT PLAN
    # =========================================================
    op.drop_table("payment_reminders")
    op.drop_table("payment_installments")
    op.drop_table("payment_plans")

    # =========================================================
    # COURSE ENROLLMENT
    # =========================================================
    op.add_column(
        "course_enrollments",
        sa.Column("order_id", sa.UUID(as_uuid=True), nullable=True),
    )
    op.add_column(
        "course_enrollments",
        sa.Column("user_id", sa.UUID(as_uuid=True), nullable=True),
    )

    # Restore user_id from students.user_id where possible.
    op.execute(
        sa.text(
            """
            UPDATE course_enrollments ce
            SET user_id = s.user_id
            FROM students s
            WHERE ce.student_id = s.id
              AND ce.user_id IS NULL
            """
        )
    )

    # Only set NOT NULL after data restoration.
    op.alter_column(
        "course_enrollments",
        "user_id",
        existing_type=sa.UUID(as_uuid=True),
        nullable=False,
    )

    op.create_unique_constraint(
        "uq_course_enrollments_user_course",
        "course_enrollments",
        ["user_id", "course_id"],
    )
    op.drop_column("course_enrollments", "access_expires_at")
    op.drop_column("course_enrollments", "access_started_at")
    op.drop_column("course_enrollments", "enrollment_type")

    # =========================================================
    # PAYMENTS
    # =========================================================
    op.drop_column("payments", "note")
    op.drop_column("payments", "collected_by")
    op.drop_column("payments", "cancelled_at")
    op.drop_column("payments", "failed_at")
    op.drop_column("payments", "paid_at")
    op.drop_column("payments", "installment_id")

    # =========================================================
    # INVOICES
    # =========================================================
    op.create_table(
        "invoice_items",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "invoice_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("invoices.id"),
            nullable=False,
        ),
        sa.Column("course_id", sa.UUID(as_uuid=True), nullable=True),
        sa.Column("class_id", sa.UUID(as_uuid=True), nullable=True),
        sa.Column("item_name", sa.String(length=255), nullable=False),
        sa.Column("item_code", sa.String(length=100), nullable=True),
        sa.Column("unit_price", sa.Numeric(12, 2), nullable=False),
        sa.Column(
            "quantity",
            sa.Integer(),
            nullable=False,
            server_default="1",
        ),
        sa.Column("total_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.add_column(
        "invoices",
        sa.Column(
            "discount_amount",
            sa.Numeric(12, 2),
            nullable=False,
            server_default="0",
        ),
    )
    op.add_column(
        "invoices",
        sa.Column(
            "subtotal_amount",
            sa.Numeric(12, 2),
            nullable=False,
            server_default="0",
        ),
    )
    op.drop_column("invoices", "due_at")
    op.drop_column("invoices", "installment_id")
    op.create_unique_constraint(
        "invoices_order_id_key",
        "invoices",
        ["order_id"],
    )

    # =========================================================
    # ORDER / CART ITEMS
    # =========================================================
    op.add_column(
        "order_items",
        sa.Column(
            "total_price",
            sa.Numeric(12, 2),
            nullable=False,
            server_default="0",
        ),
    )
    op.add_column(
        "order_items",
        sa.Column(
            "quantity",
            sa.Integer(),
            nullable=False,
            server_default="1",
        ),
    )
    op.drop_column("order_items", "final_amount")
    op.drop_column("order_items", "discount_amount")
    op.drop_column("order_items", "student_id")

    op.add_column(
        "cart_items",
        sa.Column(
            "total_price",
            sa.Numeric(12, 2),
            nullable=False,
            server_default="0",
        ),
    )
    op.add_column(
        "cart_items",
        sa.Column(
            "quantity",
            sa.Integer(),
            nullable=False,
            server_default="1",
        ),
    )
    op.add_column(
        "cart_items",
        sa.Column("class_id", sa.UUID(as_uuid=True), nullable=True),
    )
    op.drop_column("cart_items", "student_id")

    # =========================================================
    # ORDERS
    # =========================================================
    op.add_column(
        "orders",
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.add_column(
        "orders",
        sa.Column("payment_method", sa.String(length=50), nullable=True),
    )
    op.add_column(
        "orders",
        sa.Column(
            "invoice_number",
            sa.String(length=50),
            nullable=True,
        ),
    )

    # Restore invoice_number from invoices where possible.
    op.execute(
        sa.text(
            """
            UPDATE orders o
            SET invoice_number = i.invoice_number
            FROM invoices i
            WHERE i.order_id = o.id
              AND o.invoice_number IS NULL
            """
        )
    )

    op.drop_column("orders", "completed_at")
    op.drop_column("orders", "confirmed_at")
    op.drop_column("orders", "confirmed_by")
    op.drop_column("orders", "consultation_id")
    op.drop_column("orders", "order_type")

    # =========================================================
    # CONSULTATIONS
    # =========================================================
    op.create_table(
        "guest_enrollments",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.execute(
        sa.text(
            """
            INSERT INTO guest_enrollments (
                id,
                content,
                created_at,
                updated_at,
                deleted_at
            )
            SELECT
                id,
                COALESCE(note, ''),
                created_at,
                updated_at,
                deleted_at
            FROM consultations
            """
        )
    )

    op.drop_table("consultations")

    # =========================================================
    # MEDIA SHARE
    # =========================================================
    op.drop_table("media_share")

    # =========================================================
    # COURSE REFACTOR
    # =========================================================
    op.create_table(
        "course_outcomes",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "course_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("courses.id"),
            nullable=False,
        ),
        sa.Column("outcome_text", sa.Text(), nullable=False),
        sa.Column(
            "order_index",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.create_table(
        "course_requirements",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "course_id",
            sa.UUID(as_uuid=True),
            sa.ForeignKey("courses.id"),
            nullable=False,
        ),
        sa.Column("requirement_text", sa.Text(), nullable=False),
        sa.Column(
            "order_index",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )

    # Restore requirements JSON back into normalized rows.
    op.execute(
        sa.text(
            """
            INSERT INTO course_requirements (
                id,
                course_id,
                requirement_text,
                order_index,
                created_at,
                updated_at,
                deleted_at
            )
            SELECT
                gen_random_uuid(),
                c.id,
                value::text,
                ordinality - 1,
                now(),
                now(),
                NULL
            FROM courses c,
            LATERAL json_array_elements_text(
                COALESCE(c.requirements, '[]'::json)
            ) WITH ORDINALITY AS req(value, ordinality)
            """
        )
    )

    # Restore outcomes JSON back into normalized rows.
    op.execute(
        sa.text(
            """
            INSERT INTO course_outcomes (
                id,
                course_id,
                outcome_text,
                order_index,
                created_at,
                updated_at,
                deleted_at
            )
            SELECT
                gen_random_uuid(),
                c.id,
                value::text,
                ordinality - 1,
                now(),
                now(),
                NULL
            FROM courses c,
            LATERAL json_array_elements_text(
                COALESCE(c.outcomes, '[]'::json)
            ) WITH ORDINALITY AS outc(value, ordinality)
            """
        )
    )

    op.drop_column("courses", "total_duration_time")
    op.drop_column("courses", "discount_price")
    op.drop_column("courses", "outcomes")
    op.drop_column("courses", "requirements")

    # =========================================================
    # ASSIGNMENTS
    # =========================================================
    op.drop_column("submission_answer_media", "location_folder")

    op.add_column(
        "assignment_submissions",
        sa.Column("content", sa.Text(), nullable=True),
    )
    op.drop_column("assignment_submissions", "note")

    op.drop_column("assignment_questions", "location_folder")
    op.drop_column("assignment_questions", "media_id")

    op.add_column(
        "assignment_attachments",
        sa.Column("uploaded_by", sa.UUID(as_uuid=True), nullable=True),
    )
    op.add_column(
        "assignment_attachments",
        sa.Column("file_size", sa.Integer(), nullable=True),
    )
    op.add_column(
        "assignment_attachments",
        sa.Column("content_type", sa.String(length=255), nullable=True),
    )
    op.add_column(
        "assignment_attachments",
        sa.Column("external_url", sa.String(length=1000), nullable=True),
    )
    op.add_column(
        "assignment_attachments",
        sa.Column("file_object_name", sa.String(length=500), nullable=True),
    )
    op.add_column(
        "assignment_attachments",
        sa.Column("file_bucket", sa.String(length=100), nullable=True),
    )
    op.drop_column("assignment_attachments", "location_folder")
    op.drop_column("assignment_attachments", "media_id")

    op.drop_column("assignments", "total_attempt")
    op.drop_column("assignments", "content")
    op.drop_column("assignments", "duration_time")

    # =========================================================
    # CLASS / SCHEDULE
    # =========================================================
    op.add_column(
        "class_sessions",
        sa.Column("teacher_id", sa.UUID(as_uuid=True), nullable=True),
    )

    # Restore the primary teacher from the new mapping table.
    op.execute(
        sa.text(
            """
            UPDATE class_sessions cs
            SET teacher_id = t.id
            FROM class_sessions_teachers cst
            JOIN teachers t ON t.user_id = cst.user_id
            WHERE cst.class_session_id = cs.id
              AND cst.is_primary_teacher = true
            """
        )
    )

    op.drop_table("class_sessions_teachers")
    op.drop_column("class_schedules", "shift_number")

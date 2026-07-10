"""change lessons content to jsonb

Revision ID: 20260630_0018
Revises: 20260621_0017
Create Date: 2026-06-30
"""

from alembic import op
import sqlalchemy as sa

revision = "20260630_0018"
down_revision = "20260621_0017"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        sa.text(
            """
            ALTER TABLE lessons
            ALTER COLUMN content TYPE JSONB
            USING CASE
                WHEN content IS NULL THEN NULL
                WHEN content ~ '^[[:space:]]*[\\[{]' THEN content::jsonb
                ELSE jsonb_build_object(
                    'time', 0,
                    'blocks', jsonb_build_array(
                        jsonb_build_object(
                            'type', 'paragraph',
                            'data', jsonb_build_object('text', content)
                        )
                    ),
                    'version', '2.30.8'
                )
            END
            """
        )
    )


def downgrade() -> None:
    op.execute(
        sa.text(
            """
            ALTER TABLE lessons
            ALTER COLUMN content TYPE TEXT
            USING CASE
                WHEN content IS NULL THEN NULL
                ELSE content::text
            END
            """
        )
    )

from sqlalchemy import select
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models import User



class UserRepository(BaseRepository[User]):
    def __init__(self, db: Session) -> None:
        super().__init__(db=db, model=User)

    def email_exists(self, email: str, exclude_user_id=None) -> bool:
        stmt = select(User.id).where(
            User.email == email,
        )

        if exclude_user_id is not None:
            stmt = stmt.where(User.id != exclude_user_id)

        return self.db.execute(stmt).first() is not None

    def phone_exists(self, phone: str, exclude_user_id=None) -> bool:
        stmt = select(User.id).where(
            User.phone == phone,
            User.deleted_at.is_(None),
        )

        if exclude_user_id is not None:
            stmt = stmt.where(User.id != exclude_user_id)

        return self.db.execute(stmt).first() is not None

    def get_by_email_including_deleted(self, email: str) -> User | None:
        return self.db.execute(
            select(User).where(User.email == email)
        ).scalar_one_or_none()

    def get_deleted_by_email(self, email: str) -> User | None:
        return self.db.execute(
            select(User).where(
                User.email == email,
                User.deleted_at.is_not(None),
            )
        ).scalar_one_or_none()

    def get_active_by_email(self, email: str) -> User | None:
        return self.db.execute(
            select(User).where(
                User.email == email,
                User.deleted_at.is_(None),
            )
        ).scalar_one_or_none()

    def get_active_by_id(self, user_id: str) -> User | None:
        return self.get(user_id)

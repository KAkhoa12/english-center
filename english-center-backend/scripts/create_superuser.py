from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.role import Role, UserRole
from app.models.user import User, UserStatus

ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "Admin@123"
ADMIN_FULL_NAME = "System Admin"


if __name__ == "__main__":
    db = SessionLocal()
    try:
        user = db.execute(
            select(User).where(User.email == ADMIN_EMAIL, User.deleted_at.is_(None))
        ).scalar_one_or_none()

        if not user:
            user = User(
                email=ADMIN_EMAIL,
                full_name=ADMIN_FULL_NAME,
                password_hash=hash_password(ADMIN_PASSWORD),
                status=UserStatus.active,
                is_verified=True,
            )
            db.add(user)
            db.flush()

        admin_role = db.execute(
            select(Role).where(Role.name == "admin", Role.deleted_at.is_(None))
        ).scalar_one_or_none()

        if not admin_role:
            admin_role = Role(name="admin", description="System administrator")
            db.add(admin_role)
            db.flush()

        relation = db.execute(
            select(UserRole).where(
                UserRole.user_id == user.id,
                UserRole.role_id == admin_role.id,
                UserRole.deleted_at.is_(None),
            )
        ).scalar_one_or_none()

        if not relation:
            db.add(UserRole(user_id=user.id, role_id=admin_role.id))

        db.commit()
        print(f"Admin account ready: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
    finally:
        db.close()

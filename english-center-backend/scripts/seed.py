from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.user import User


if __name__ == "__main__":
    db = SessionLocal()
    user = User(
        email="user@example.com",
        full_name="Seed User",
        hashed_password=get_password_hash("password123"),
    )
    db.add(user)
    db.commit()
    print("Seed completed")

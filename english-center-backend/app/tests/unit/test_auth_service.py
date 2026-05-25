from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.security import verify_password
from app.db.base import Base
from app.models.user import User
from app.schemas.auth import LoginRequest
from app.schemas.user import UserCreate
from app.services.auth_service import AuthService


def _memory_session() -> Session:
    engine = create_engine("sqlite+pysqlite:///:memory:", future=True)
    Base.metadata.create_all(bind=engine)
    LocalSession = sessionmaker(bind=engine, autoflush=False, autocommit=False, class_=Session)
    return LocalSession()


def test_register_and_login() -> None:
    db = _memory_session()
    service = AuthService(db)

    user = service.register(UserCreate(email="demo@example.com", full_name="Demo User", password="secret123"))
    assert user.id is not None
    assert verify_password("secret123", user.hashed_password)

    token = service.login(LoginRequest(email="demo@example.com", password="secret123"))
    assert token.access_token
    assert token.token_type == "bearer"

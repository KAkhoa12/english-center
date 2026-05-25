from app.schemas.user import UserCreate
from app.services.auth_service import AuthService


class RegisterUserUseCase:
    def __init__(self, auth_service: AuthService) -> None:
        self.auth_service = auth_service

    def execute(self, payload: UserCreate):
        return self.auth_service.register(payload)

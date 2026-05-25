from app.schemas.auth import LoginRequest
from app.services.auth_service import AuthService


class LoginUserUseCase:
    def __init__(self, auth_service: AuthService) -> None:
        self.auth_service = auth_service

    def execute(self, payload: LoginRequest):
        return self.auth_service.login(payload)

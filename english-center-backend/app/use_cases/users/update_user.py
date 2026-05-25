from app.schemas.user import UserUpdate
from app.services.user_service import UserService


class UpdateUserUseCase:
    def __init__(self, user_service: UserService) -> None:
        self.user_service = user_service

    def execute(self, user_id: int, payload: UserUpdate):
        return self.user_service.update_user(user_id, payload)

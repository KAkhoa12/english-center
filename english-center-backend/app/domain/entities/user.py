from dataclasses import dataclass


@dataclass(slots=True)
class UserEntity:
    id: int
    email: str
    full_name: str
    is_active: bool
    is_superuser: bool

from enum import Enum


class PermissionCode(str, Enum):
    def __str__(self) -> str:
        return self.value

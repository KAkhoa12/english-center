from pydantic import BaseModel, Field, field_validator


def _not_blank(value: str) -> str:
    if not value or not value.strip():
        raise ValueError("must not be blank")
    return value.strip()


class RoomCreate(BaseModel):
    name: str
    capacity: int = Field(ge=1)
    location: str | None = None
    status: str = "active"

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        return _not_blank(value)


class RoomUpdate(BaseModel):
    name: str | None = None
    capacity: int | None = Field(default=None, ge=1)
    location: str | None = None
    status: str | None = None

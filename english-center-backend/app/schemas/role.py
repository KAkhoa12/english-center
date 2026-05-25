from pydantic import BaseModel


class RoleCreate(BaseModel):
    name: str
    description: str | None = None


class RoleUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class RoleRead(BaseModel):
    id: str
    name: str
    description: str | None


class AssignPermissionsRequest(BaseModel):
    permission_ids: list[str]

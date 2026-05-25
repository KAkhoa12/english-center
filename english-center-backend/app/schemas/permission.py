from pydantic import BaseModel


class PermissionCreate(BaseModel):
    code: str
    name: str | None = None
    description: str | None = None


class PermissionUpdate(BaseModel):
    code: str | None = None
    name: str | None = None
    description: str | None = None


class PermissionRead(BaseModel):
    id: str
    code: str
    name: str | None
    description: str | None

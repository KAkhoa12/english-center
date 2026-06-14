from pydantic import BaseModel, Field


class ClassSessionMediaCreate(BaseModel):
    media_id: str
    title: str | None = None
    description: str | None = None
    order_index: int = Field(default=0, ge=0)


class ClassSessionMediaUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    order_index: int | None = Field(default=None, ge=0)

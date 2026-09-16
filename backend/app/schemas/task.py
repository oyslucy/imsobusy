from datetime import date as DateType

from pydantic import BaseModel, Field


class TaskRead(BaseModel):
    id: str
    title: str
    location: str | None
    time: str
    category_id: str
    done: bool
    date: DateType

    model_config = {"from_attributes": True}


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    location: str | None = Field(default=None, max_length=200)
    time: str = Field(min_length=1, max_length=5)
    category_id: str
    date: DateType


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    location: str | None = Field(default=None, max_length=200)
    time: str | None = Field(default=None, min_length=1, max_length=5)
    category_id: str | None = None
    done: bool | None = None
    date: DateType | None = None

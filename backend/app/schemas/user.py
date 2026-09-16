from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserRead(BaseModel):
    id: str
    name: str
    email: EmailStr
    bio: str | None
    avatar_emoji: str
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    email: EmailStr | None = None
    bio: str | None = Field(default=None, max_length=200)
    avatar_emoji: str | None = Field(default=None, min_length=1, max_length=8)
    current_password: str | None = None
    new_password: str | None = Field(default=None, min_length=8, max_length=100)

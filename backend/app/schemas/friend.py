from datetime import date as DateType
from datetime import datetime

from pydantic import BaseModel, EmailStr


class FriendRead(BaseModel):
    id: str
    name: str
    email: EmailStr
    avatar_emoji: str

    model_config = {"from_attributes": True}


class FriendRequestCreate(BaseModel):
    email: EmailStr


class FriendRequestRead(BaseModel):
    id: str
    requester: FriendRead
    created_at: datetime


class SharedTaskCreate(BaseModel):
    task_id: str
    recipient_id: str


class SharedTaskAccept(BaseModel):
    category_id: str


class SharedTaskRead(BaseModel):
    id: str
    sender: FriendRead
    title: str
    location: str | None
    time: str | None
    date: DateType
    created_at: datetime

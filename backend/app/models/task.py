import uuid
from datetime import date as date_type

from sqlalchemy import Boolean, Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


def _new_id() -> str:
    return uuid.uuid4().hex


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_new_id)
    owner_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    time: Mapped[str] = mapped_column(String(5))
    category_id: Mapped[str] = mapped_column(ForeignKey("categories.id"))
    done: Mapped[bool] = mapped_column(Boolean, default=False)
    date: Mapped[date_type] = mapped_column(Date, index=True)

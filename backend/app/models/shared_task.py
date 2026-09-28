import uuid
from datetime import date as date_type
from datetime import datetime, timezone

from sqlalchemy import Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


def _new_id() -> str:
    return uuid.uuid4().hex


def _now() -> datetime:
    return datetime.now(timezone.utc)


class SharedTask(Base):
    """A snapshot of a task sent to a friend, copied into their planner on accept."""

    __tablename__ = "shared_tasks"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_new_id)
    sender_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    recipient_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    time: Mapped[str | None] = mapped_column(String(5), nullable=True)
    date: Mapped[date_type] = mapped_column(Date)
    # "pending" | "accepted" | "declined"
    status: Mapped[str] = mapped_column(String(10), default="pending", index=True)
    created_at: Mapped[datetime] = mapped_column(default=_now)

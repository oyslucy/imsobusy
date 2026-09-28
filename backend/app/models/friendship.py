import uuid
from datetime import datetime, timezone

from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


def _new_id() -> str:
    return uuid.uuid4().hex


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Friendship(Base):
    __tablename__ = "friendships"
    __table_args__ = (UniqueConstraint("requester_id", "addressee_id"),)

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_new_id)
    requester_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    addressee_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    # "pending" until the addressee accepts, then "accepted"
    status: Mapped[str] = mapped_column(String(10), default="pending")
    created_at: Mapped[datetime] = mapped_column(default=_now)

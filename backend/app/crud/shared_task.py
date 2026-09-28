from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.shared_task import SharedTask
from app.models.task import Task
from app.models.user import User


def create_shared_task(db: Session, sender_id: str, recipient_id: str, task: Task) -> SharedTask:
    shared = SharedTask(
        sender_id=sender_id,
        recipient_id=recipient_id,
        title=task.title,
        location=task.location,
        time=task.time,
        date=task.date,
    )
    db.add(shared)
    db.commit()
    db.refresh(shared)
    return shared


def list_inbox(db: Session, recipient_id: str) -> list[tuple[SharedTask, User]]:
    stmt = (
        select(SharedTask, User)
        .join(User, User.id == SharedTask.sender_id)
        .where(SharedTask.recipient_id == recipient_id, SharedTask.status == "pending")
        .order_by(SharedTask.created_at.desc())
    )
    return [(row[0], row[1]) for row in db.execute(stmt)]


def get_pending_shared_task(db: Session, recipient_id: str, shared_id: str) -> SharedTask | None:
    stmt = select(SharedTask).where(
        SharedTask.id == shared_id,
        SharedTask.recipient_id == recipient_id,
        SharedTask.status == "pending",
    )
    return db.execute(stmt).scalar_one_or_none()


def set_shared_task_status(db: Session, shared: SharedTask, status: str) -> None:
    shared.status = status
    db.commit()

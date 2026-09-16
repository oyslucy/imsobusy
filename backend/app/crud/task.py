from datetime import date as date_type

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task import Task


def list_tasks(db: Session, owner_id: str) -> list[Task]:
    stmt = select(Task).where(Task.owner_id == owner_id)
    return list(db.execute(stmt).scalars())


def get_task(db: Session, owner_id: str, task_id: str) -> Task | None:
    stmt = select(Task).where(Task.id == task_id, Task.owner_id == owner_id)
    return db.execute(stmt).scalar_one_or_none()


def create_task(
    db: Session,
    owner_id: str,
    *,
    title: str,
    location: str | None,
    time: str | None,
    category_id: str,
    date: date_type,
) -> Task:
    task = Task(
        owner_id=owner_id,
        title=title,
        location=location,
        time=time,
        category_id=category_id,
        date=date,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def save_task(db: Session, task: Task) -> Task:
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()

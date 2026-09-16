from datetime import date as date_type

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.task import Task


def list_tasks(db: Session, owner_id: str) -> list[Task]:
    stmt = (
        select(Task)
        .where(Task.owner_id == owner_id)
        .order_by(Task.date, Task.position)
    )
    return list(db.execute(stmt).scalars())


def get_task(db: Session, owner_id: str, task_id: str) -> Task | None:
    stmt = select(Task).where(Task.id == task_id, Task.owner_id == owner_id)
    return db.execute(stmt).scalar_one_or_none()


def _next_position(db: Session, owner_id: str, date: date_type) -> int:
    stmt = select(func.coalesce(func.max(Task.position), -1)).where(
        Task.owner_id == owner_id, Task.date == date
    )
    return db.execute(stmt).scalar_one() + 1


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
        position=_next_position(db, owner_id, date),
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


def reorder_tasks(db: Session, owner_id: str, task_ids: list[str]) -> list[Task]:
    stmt = select(Task).where(Task.owner_id == owner_id, Task.id.in_(task_ids))
    tasks_by_id = {task.id: task for task in db.execute(stmt).scalars()}
    ordered = [tasks_by_id[task_id] for task_id in task_ids if task_id in tasks_by_id]
    for index, task in enumerate(ordered):
        task.position = index
    db.commit()
    for task in ordered:
        db.refresh(task)
    return ordered

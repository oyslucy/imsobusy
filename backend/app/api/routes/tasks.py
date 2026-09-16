from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.crud.category import get_category
from app.crud.task import create_task, delete_task, get_task, list_tasks, save_task
from app.db.session import get_db
from app.models.user import User
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


def _ensure_category_exists(db: Session, owner_id: str, category_id: str) -> None:
    if get_category(db, owner_id, category_id) is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="존재하지 않는 카테고리예요",
        )


def _get_owned_task_or_404(db: Session, owner_id: str, task_id: str):
    task = get_task(db, owner_id, task_id)
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="일정을 찾을 수 없어요"
        )
    return task


@router.get("", response_model=list[TaskRead])
def get_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[TaskRead]:
    return list_tasks(db, current_user.id)


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def post_task(
    payload: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskRead:
    _ensure_category_exists(db, current_user.id, payload.category_id)
    location = (payload.location or "").strip() or None
    time = (payload.time or "").strip() or None
    return create_task(
        db,
        current_user.id,
        title=payload.title,
        location=location,
        time=time,
        category_id=payload.category_id,
        date=payload.date,
    )


@router.patch("/{task_id}", response_model=TaskRead)
def patch_task(
    task_id: str,
    payload: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskRead:
    task = _get_owned_task_or_404(db, current_user.id, task_id)

    if payload.category_id is not None:
        _ensure_category_exists(db, current_user.id, payload.category_id)
        task.category_id = payload.category_id
    if payload.title is not None:
        task.title = payload.title
    if "location" in payload.model_fields_set:
        task.location = (payload.location or "").strip() or None
    if "time" in payload.model_fields_set:
        task.time = (payload.time or "").strip() or None
    if payload.done is not None:
        task.done = payload.done
    if payload.date is not None:
        task.date = payload.date

    return save_task(db, task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    task = _get_owned_task_or_404(db, current_user.id, task_id)
    delete_task(db, task)

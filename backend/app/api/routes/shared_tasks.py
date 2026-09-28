from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.crud.category import get_category
from app.crud.friend import are_friends
from app.crud.shared_task import (
    create_shared_task,
    get_pending_shared_task,
    list_inbox,
    set_shared_task_status,
)
from app.crud.task import create_task, get_task
from app.db.session import get_db
from app.models.user import User
from app.schemas.friend import FriendRead, SharedTaskAccept, SharedTaskCreate, SharedTaskRead
from app.schemas.task import TaskRead

router = APIRouter(prefix="/shared-tasks", tags=["shared-tasks"])


def _get_pending_or_404(db: Session, user_id: str, shared_id: str):
    shared = get_pending_shared_task(db, user_id, shared_id)
    if shared is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="받은 일정을 찾을 수 없어요"
        )
    return shared


@router.post("", status_code=status.HTTP_204_NO_CONTENT)
def post_shared_task(
    payload: SharedTaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    task = get_task(db, current_user.id, payload.task_id)
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="일정을 찾을 수 없어요"
        )
    if not are_friends(db, current_user.id, payload.recipient_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="친구에게만 일정을 보낼 수 있어요"
        )
    create_shared_task(db, current_user.id, payload.recipient_id, task)


@router.get("/inbox", response_model=list[SharedTaskRead])
def get_inbox(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[SharedTaskRead]:
    return [
        SharedTaskRead(
            id=shared.id,
            sender=FriendRead.model_validate(sender),
            title=shared.title,
            location=shared.location,
            time=shared.time,
            date=shared.date,
            created_at=shared.created_at,
        )
        for shared, sender in list_inbox(db, current_user.id)
    ]


@router.post("/{shared_id}/accept", response_model=TaskRead)
def post_accept(
    shared_id: str,
    payload: SharedTaskAccept,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskRead:
    shared = _get_pending_or_404(db, current_user.id, shared_id)
    if get_category(db, current_user.id, payload.category_id) is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="존재하지 않는 카테고리예요"
        )
    task = create_task(
        db,
        current_user.id,
        title=shared.title,
        location=shared.location,
        time=shared.time,
        category_id=payload.category_id,
        date=shared.date,
    )
    set_shared_task_status(db, shared, "accepted")
    return task


@router.post("/{shared_id}/decline", status_code=status.HTTP_204_NO_CONTENT)
def post_decline(
    shared_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    set_shared_task_status(db, _get_pending_or_404(db, current_user.id, shared_id), "declined")

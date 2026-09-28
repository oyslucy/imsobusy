from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.crud.friend import (
    accept_request,
    create_request,
    delete_friendship,
    get_friendship_between,
    get_incoming_request,
    list_friends,
    list_incoming_requests,
)
from app.crud.user import get_user_by_email
from app.db.session import get_db
from app.models.user import User
from app.schemas.friend import FriendRead, FriendRequestCreate, FriendRequestRead

router = APIRouter(prefix="/friends", tags=["friends"])


def _get_incoming_request_or_404(db: Session, user_id: str, request_id: str):
    friendship = get_incoming_request(db, user_id, request_id)
    if friendship is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="친구 요청을 찾을 수 없어요"
        )
    return friendship


@router.get("", response_model=list[FriendRead])
def get_friends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[FriendRead]:
    return list_friends(db, current_user.id)


@router.get("/requests", response_model=list[FriendRequestRead])
def get_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[FriendRequestRead]:
    return [
        FriendRequestRead(
            id=friendship.id,
            requester=FriendRead.model_validate(requester),
            created_at=friendship.created_at,
        )
        for friendship, requester in list_incoming_requests(db, current_user.id)
    ]


@router.post("/requests", status_code=status.HTTP_204_NO_CONTENT)
def post_request(
    payload: FriendRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    target = get_user_by_email(db, payload.email)
    if target is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="해당 이메일의 사용자가 없어요"
        )
    if target.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="나 자신은 친구로 추가할 수 없어요"
        )

    existing = get_friendship_between(db, current_user.id, target.id)
    if existing is None:
        create_request(db, current_user.id, target.id)
    elif existing.status == "accepted":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="이미 친구예요")
    elif existing.requester_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="이미 친구 요청을 보냈어요"
        )
    else:
        # They already asked us, so asking back simply accepts their request.
        accept_request(db, existing)


@router.post("/requests/{request_id}/accept", status_code=status.HTTP_204_NO_CONTENT)
def post_accept(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    accept_request(db, _get_incoming_request_or_404(db, current_user.id, request_id))


@router.post("/requests/{request_id}/decline", status_code=status.HTTP_204_NO_CONTENT)
def post_decline(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    delete_friendship(db, _get_incoming_request_or_404(db, current_user.id, request_id))


@router.delete("/{friend_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_friend(
    friend_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    friendship = get_friendship_between(db, current_user.id, friend_id)
    if friendship is None or friendship.status != "accepted":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="친구가 아니에요")
    delete_friendship(db, friendship)

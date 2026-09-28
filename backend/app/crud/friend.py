from sqlalchemy import and_, or_, select
from sqlalchemy.orm import Session

from app.models.friendship import Friendship
from app.models.user import User


def get_friendship_between(db: Session, user_a: str, user_b: str) -> Friendship | None:
    stmt = select(Friendship).where(
        or_(
            and_(Friendship.requester_id == user_a, Friendship.addressee_id == user_b),
            and_(Friendship.requester_id == user_b, Friendship.addressee_id == user_a),
        )
    )
    return db.execute(stmt).scalar_one_or_none()


def are_friends(db: Session, user_a: str, user_b: str) -> bool:
    friendship = get_friendship_between(db, user_a, user_b)
    return friendship is not None and friendship.status == "accepted"


def list_friends(db: Session, user_id: str) -> list[User]:
    stmt = select(Friendship).where(
        Friendship.status == "accepted",
        or_(Friendship.requester_id == user_id, Friendship.addressee_id == user_id),
    )
    friend_ids = [
        f.addressee_id if f.requester_id == user_id else f.requester_id
        for f in db.execute(stmt).scalars()
    ]
    if not friend_ids:
        return []
    users = db.execute(select(User).where(User.id.in_(friend_ids))).scalars()
    return sorted(users, key=lambda user: user.name)


def list_incoming_requests(db: Session, user_id: str) -> list[tuple[Friendship, User]]:
    stmt = (
        select(Friendship, User)
        .join(User, User.id == Friendship.requester_id)
        .where(Friendship.addressee_id == user_id, Friendship.status == "pending")
        .order_by(Friendship.created_at.desc())
    )
    return [(row[0], row[1]) for row in db.execute(stmt)]


def get_incoming_request(db: Session, user_id: str, request_id: str) -> Friendship | None:
    stmt = select(Friendship).where(
        Friendship.id == request_id,
        Friendship.addressee_id == user_id,
        Friendship.status == "pending",
    )
    return db.execute(stmt).scalar_one_or_none()


def create_request(db: Session, requester_id: str, addressee_id: str) -> Friendship:
    friendship = Friendship(requester_id=requester_id, addressee_id=addressee_id)
    db.add(friendship)
    db.commit()
    db.refresh(friendship)
    return friendship


def accept_request(db: Session, friendship: Friendship) -> Friendship:
    friendship.status = "accepted"
    db.commit()
    db.refresh(friendship)
    return friendship


def delete_friendship(db: Session, friendship: Friendship) -> None:
    db.delete(friendship)
    db.commit()

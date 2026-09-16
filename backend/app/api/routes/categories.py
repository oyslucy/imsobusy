from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.crud.category import create_category, list_categories
from app.db.session import get_db
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryRead

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryRead])
def get_categories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[CategoryRead]:
    return list_categories(db, current_user.id)


@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def post_category(
    payload: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CategoryRead:
    return create_category(db, current_user.id, payload.label, payload.bg, payload.text)

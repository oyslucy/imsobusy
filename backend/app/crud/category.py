from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.category import Category

DEFAULT_CATEGORIES = [
    {"label": "WORK", "bg": "#c9c2f0", "text": "#2a2560"},
    {"label": "LIFE", "bg": "#ef8a72", "text": "#3a1000"},
    {"label": "MOVE", "bg": "#7fd1b9", "text": "#0a3a2a"},
]


def list_categories(db: Session, owner_id: str) -> list[Category]:
    stmt = select(Category).where(Category.owner_id == owner_id)
    return list(db.execute(stmt).scalars())


def get_category(db: Session, owner_id: str, category_id: str) -> Category | None:
    stmt = select(Category).where(
        Category.id == category_id, Category.owner_id == owner_id
    )
    return db.execute(stmt).scalar_one_or_none()


def create_category(db: Session, owner_id: str, label: str, bg: str, text: str) -> Category:
    category = Category(owner_id=owner_id, label=label, bg=bg, text=text)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def seed_default_categories(db: Session, owner_id: str) -> list[Category]:
    categories = [Category(owner_id=owner_id, **preset) for preset in DEFAULT_CATEGORIES]
    db.add_all(categories)
    db.commit()
    for category in categories:
        db.refresh(category)
    return categories

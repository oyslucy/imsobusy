from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine

# create_all() only creates missing tables, not missing columns on tables
# that already exist. This adds any columns a schema change introduced,
# so upgrading an already-deployed SQLite file doesn't require a full
# migration tool for a simple additive change.
COLUMNS_TO_ENSURE: list[tuple[str, str, str]] = [
    ("tasks", "location", "VARCHAR(200)"),
]


def run_light_migrations(engine: Engine) -> None:
    inspector = inspect(engine)
    with engine.begin() as conn:
        for table, column, ddl_type in COLUMNS_TO_ENSURE:
            if not inspector.has_table(table):
                continue
            existing = {col["name"] for col in inspector.get_columns(table)}
            if column not in existing:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {ddl_type}"))

from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine

# create_all() only creates missing tables, not missing columns on tables
# that already exist. This adds any columns a schema change introduced,
# so upgrading an already-deployed SQLite file doesn't require a full
# migration tool for a simple additive change.
COLUMNS_TO_ENSURE: list[tuple[str, str, str]] = [
    ("tasks", "location", "VARCHAR(200)"),
    ("tasks", "position", "INTEGER DEFAULT 0"),
]

# Columns that need a one-time backfill right after they're first added,
# so existing rows get a meaningful value instead of all sharing the
# column's bare default.
BACKFILL_AFTER_ADD: dict[tuple[str, str], str] = {
    ("tasks", "position"): """
        UPDATE tasks
        SET position = ranked.rn
        FROM (
            SELECT id, ROW_NUMBER() OVER (
                PARTITION BY owner_id, date ORDER BY rowid
            ) - 1 AS rn
            FROM tasks
        ) AS ranked
        WHERE tasks.id = ranked.id
    """,
}

# Columns that used to be NOT NULL and now need to allow NULL. SQLite can't
# drop a column constraint in place, so these tables get rebuilt: renamed
# aside, recreated from the current model (already NULLable there), old
# rows copied back over the columns both versions share, then dropped.
COLUMNS_TO_RELAX: list[tuple[str, str]] = [
    ("tasks", "time"),
]


def _is_not_null(engine: Engine, table: str, column: str) -> bool:
    with engine.connect() as conn:
        rows = conn.execute(text(f"PRAGMA table_info({table})")).fetchall()
    return any(row[1] == column and row[3] for row in rows)


def _relax_not_null_columns(engine: Engine) -> None:
    from app.db.session import Base  # local import to avoid a circular import

    inspector = inspect(engine)
    for table, column in COLUMNS_TO_RELAX:
        if not inspector.has_table(table) or not _is_not_null(engine, table, column):
            continue

        old_columns = [col["name"] for col in inspector.get_columns(table)]
        old_index_names = [idx["name"] for idx in inspector.get_indexes(table)]
        with engine.begin() as conn:
            conn.execute(text(f"ALTER TABLE {table} RENAME TO {table}_old"))
            # SQLite carries named indexes over on rename; drop them so
            # create_all can recreate them under the same name for the
            # rebuilt table below.
            for index_name in old_index_names:
                conn.execute(text(f"DROP INDEX {index_name}"))

        Base.metadata.create_all(bind=engine, tables=[Base.metadata.tables[table]])

        new_columns = {col["name"] for col in inspect(engine).get_columns(table)}
        shared = [c for c in old_columns if c in new_columns]
        cols_sql = ", ".join(shared)
        with engine.begin() as conn:
            conn.execute(
                text(f"INSERT INTO {table} ({cols_sql}) SELECT {cols_sql} FROM {table}_old")
            )
            conn.execute(text(f"DROP TABLE {table}_old"))

        inspector = inspect(engine)


def run_light_migrations(engine: Engine) -> None:
    _relax_not_null_columns(engine)

    inspector = inspect(engine)
    with engine.begin() as conn:
        for table, column, ddl_type in COLUMNS_TO_ENSURE:
            if not inspector.has_table(table):
                continue
            existing = {col["name"] for col in inspector.get_columns(table)}
            if column not in existing:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {ddl_type}"))
                backfill_sql = BACKFILL_AFTER_ADD.get((table, column))
                if backfill_sql:
                    conn.execute(text(backfill_sql))

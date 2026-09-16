from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import auth, categories, tasks, users
from app.core.config import settings
from app.db.session import Base, engine
from app.models import category, task, user  # noqa: F401  (ensures models are registered)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="imsobusy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


# Serve the built frontend (npm run build) so the whole app runs as a single
# server. Mounted last so it never shadows the /api routes above. Absent
# during frontend-less API development, where this is simply skipped.
frontend_dist = Path(__file__).resolve().parent.parent.parent / "dist"
if frontend_dist.is_dir():
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

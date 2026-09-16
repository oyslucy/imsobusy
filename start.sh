#!/usr/bin/env bash
# Builds the frontend and serves the whole app (frontend + API) from a
# single FastAPI process on http://localhost:8000.
set -euo pipefail
cd "$(dirname "$0")"

echo "==> Building frontend"
npm install --no-audit --no-fund
npm run build

echo "==> Preparing backend"
cd backend
if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -q -r requirements.txt
if [ ! -f .env ]; then
  cp .env.example .env
fi

echo "==> Starting server on http://localhost:8000"
exec uvicorn app.main:app --host 0.0.0.0 --port 8000

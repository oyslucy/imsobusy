# The frontend is built in CI (GitHub Actions) and uploaded as a prebuilt
# dist/ directory alongside this Dockerfile, since the VM is too
# memory-constrained to run the TypeScript/Vite build itself.
FROM python:3.12-slim
WORKDIR /app/backend

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
COPY dist /app/dist

RUN mkdir -p /app/backend/data

ENV DATABASE_URL=sqlite:////app/backend/data/app.db
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

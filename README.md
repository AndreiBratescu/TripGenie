TripGenie Backend
==================

This is the backend API for **TripGenie**, an AI-powered travel planner.

## Stack

- FastAPI
- SQLite
- SQLAlchemy

## Getting Started

1. Create a virtual environment and install dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate  # on Windows
pip install -r requirements.txt
```

2. Run the API server:

```bash
uvicorn backend.app.main:app --reload
```

3. Open the interactive docs:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`


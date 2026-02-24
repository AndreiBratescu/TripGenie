# TripGenie

**TripGenie** is an AI-powered travel planner where users create trips, set budget and interests, generate AI travel suggestions (via Gemini), and save and manage destinations.

## Stack

| Layer    | Tech |
| -------- | -----|
| **Backend** | FastAPI, SQLAlchemy, SQLite |
| **Frontend** | React (Vite), TypeScript, TailwindCSS, React Router |

No external UI libraries; the web app uses a flat design system with shared components (Button, Card, Input, PageHeader, EmptyState).

## Features

- **Dashboard** (`/`) — Grid of trip cards, “Create Trip” primary action, delete trips, empty state.
- **Create Trip** (`/create`) — Form: Title, Budget, Season (dropdown), Interests, Description; submit creates a trip and redirects to its details.
- **Trip Details** (`/trip/:id`) — Trip info, prominent “Generate AI Suggestions” button (Gemini), loading state, grid of destination cards, delete destinations, empty state.

API: full CRUD for trips and destinations; AI destination generation via Gemini.

## Prerequisites

- **Python 3.10+** (backend)
- **Node.js 18+** (frontend)

## Getting Started

### 1. Backend

From the project root:

```bash
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

### 2. Frontend

From the project root:

```bash
cd frontend
npm install
npm run dev
```

- App: `http://localhost:5173`

### 3. Environment (optional)

- **Root `.env`** (for backend):  
  - `GEMINI_API_KEY` — required for “Generate AI Suggestions”.  
  - `DATABASE_URL` — optional; defaults to `sqlite:///./tripgenie.db`.

- **Frontend `frontend/.env`** (optional):  
  - `VITE_API_BASE_URL=http://localhost:8000/api/v1` — if the API runs elsewhere.

CORS is set for `http://localhost:5173` and `http://127.0.0.1:5173`.

## Project structure

```
TripGenie/
├── backend/
│   └── app/
│       ├── api/v1/endpoints/   # trips, destinations (incl. ai-generate)
│       ├── core/               # config (database_url, gemini_api_key)
│       ├── db/                 # session, init_db
│       ├── models/             # Trip, Destination
│       ├── schemas/            # Pydantic models
│       └── services/           # trip_service, destination_service, ai_destination_service
├── frontend/
│   └── src/
│       ├── components/         # Layout, Button, Card, Input, PageHeader, EmptyState, ToastProvider, TripsGrid, TripForm
│       ├── pages/              # DashboardPage, CreateTripPage, TripDetailsPage
│       ├── App.tsx             # React Router routes
│       └── main.tsx
├── .env                        # GEMINI_API_KEY, DATABASE_URL
├── requirements.txt
└── README.md
```

## Build for production

- **Backend**: run with a production ASGI server (e.g. `uvicorn backend.app.main:app --host 0.0.0.0 --port 8000`); consider switching to PostgreSQL and using Alembic for migrations.
- **Frontend**:  
  ```bash
  cd frontend && npm run build
  ```
  Serve the `frontend/dist` folder and set `VITE_API_BASE_URL` to your deployed API URL.

# TripGenie

**TripGenie** is an AI-powered travel planner where users create trips, set budget and interests, generate AI travel suggestions (via Gemini), and save and manage destinations.

## Stack

| Layer    | Tech |
| -------- | -----|
| **Backend** | FastAPI, SQLAlchemy, SQLite |
| **Frontend** | React (Vite), TypeScript, TailwindCSS, React Router |

No external UI libraries; the web app uses a flat design system with shared components (Button, Card, Input, PageHeader, EmptyState).

## Features

### Dashboard (`/`)

- **Trip grid** — All trips shown in a responsive card grid. Each card displays title, season, optional description, date range, and budget.
- **Create Trip** — Primary button in the header opens the Create Trip page.
- **Open a trip** — Clicking a card navigates to that trip’s details page (`/trip/:id`).
- **Delete trip** — Each card has a Delete button; confirmation dialog before removal. List refreshes after delete.
- **Empty state** — When there are no trips, a message and icon explain that the user can create their first trip.
- **Loading & errors** — Loading message while fetching; inline error message if the API fails.

### Create Trip (`/create`)

- **Form fields** — Title (required), Start date, End date, Budget (USD), Season (dropdown: Spring / Summer / Autumn / Winter), Interests (comma‑separated), Description (optional).
- **Validation** — Client-side checks: title required, budget non‑negative, end date not before start date. Errors shown inline and via toast.
- **Submit** — Sends `POST /api/v1/trips` with the trip payload. On success, shows a success toast and redirects to the new trip’s details page (`/trip/:id`).
- **Loading state** — Submit button shows a spinner and “Create trip” label while the request is in progress.

### Trip Details (`/trip/:id`)

- **Trip info block** — Displays trip title, season, interests, date range, budget, and description in a clear section.
- **Generate AI Suggestions** — Prominent primary button that calls the backend to generate up to three AI destinations (Gemini) using the trip’s budget, season, and interests. Confirmation dialog before running. New destinations are created and saved to the trip; the list refreshes automatically.
- **Loading state** — Button shows a spinner and “Generating…” while the AI request runs. Errors surface via toast.
- **Destinations grid** — All destinations for the trip in a responsive card grid. Each card shows name, city/country, description, and date range.
- **Delete destination** — Each destination card has a Delete button; confirmation before removal. List updates and a success toast is shown.
- **Empty state** — When there are no destinations, a short message suggests using AI suggestions or adding destinations manually.
- **Invalid or missing trip** — Invalid `id` or 404 shows a clear error message.

### API (Backend)

- **Trips** — `GET /api/v1/trips` (list), `GET /api/v1/trips/{id}` (one), `POST /api/v1/trips` (create), `PUT /api/v1/trips/{id}` (update), `DELETE /api/v1/trips/{id}` (delete).
- **Destinations** — `GET /api/v1/trips/{id}/destinations` (list), `POST /api/v1/trips/{id}/destinations/ai-generate` (create from AI; body: `budget`, `season`, `interests`), `DELETE /api/v1/trips/{id}/destinations/{destination_id}` (delete).
- **Database** — SQLite by default; Trip and Destination models with foreign key relationship; tables created on app startup.
- **AI** — Gemini API used for destination suggestions; requires `GEMINI_API_KEY` in environment or `.env`.

### UX and consistency

- **Toasts** — Success and error notifications (e.g. “Trip created”, “Destination deleted”, API errors) appear briefly without blocking the UI.
- **Confirmations** — Destructive actions (delete trip, delete destination, run AI generation) use browser `confirm` dialogs.
- **Responsive layout** — Dashboard and Trip Details use responsive grids; Create Trip form and headers adapt to small screens.
- **Design system** — Shared Button, Card, Input, PageHeader, and EmptyState components keep the UI consistent and easy to maintain.

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

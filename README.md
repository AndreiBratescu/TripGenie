# TripGenie

## What the app does

**TripGenie** is an AI-powered travel planner for building budget-aware itineraries. You create trips with a title, date range, budget, travel season, and interests, and the app calls an LLM to propose up to three destinations that fit those constraints. Each destination is saved to the trip so you can review the details (city/country, description, estimated cost), keep or delete suggestions, and manage multiple trips from a simple dashboard and trip-detail pages.

---

## LLMs and tools used to build it

- **Cursor** (GPT 5.2 High) for implementation, refactors, and debugging.
- **Google Antigravity** (Gemini 3.1 Pro) for UI and UX.
- **Stack:** Backend: FastAPI, SQLAlchemy, SQLite, httpx. Frontend: React (Vite), TypeScript, TailwindCSS, React Router. No external UI libraries.

---

## One technical hurdle and how I prompted through it

**Hurdle:** Both Gemini 3.1 Pro and GPT 5.2 could not redesign from scratch the UI to look more polished.

**What I did:** I prompted Gemini 3.1 Pro to match keywords such as Flat Design or Material Design instead.

---

## How to run

**Backend:** Python 3.10+. From project root: `python -m venv .venv`, activate it, then `pip install -r requirements.txt` and `uvicorn backend.app.main:app --reload --port 8000`. API at `http://localhost:8000`, docs at `http://localhost:8000/docs`.

**Frontend:** Node.js 18+. From project root: `cd frontend`, `npm install`, `npm run dev`. App at `http://localhost:5173`.

**Env:** Add `GEMINI_API_KEY` to a root `.env` file for the “Generate AI Suggestions” feature.

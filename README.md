# TripGenie

## What the app does

**TripGenie** is an AI-powered travel planner for building budget-aware itineraries. You create trips with a title, date range, budget, travel season, and interests, and the app calls an LLM to propose up to three destinations that fit those constraints. Each destination is saved to the trip so you can review the details (city/country, description, estimated cost), keep or delete suggestions, and manage multiple trips from a simple dashboard and trip-detail pages.

---

## LLMs and tools used to build it

- **Cursor** (AI-assisted editor) for implementation, refactors, and debugging.
- **Google Gemini API** (REST, `gemini-flash-latest`) for generating destination suggestions from budget, season, and interests.
- **Stack:** Backend: FastAPI, SQLAlchemy, SQLite, httpx. Frontend: React (Vite), TypeScript, TailwindCSS, React Router. No external UI libraries.

---

## One technical hurdle and how I prompted through it

**Hurdle:** The Gemini API sometimes returned JSON wrapped in markdown code fences (e.g. ` ```json ... ``` `) or with extra prose, so `json.loads()` raised `JSONDecodeError` and the “Generate AI Suggestions” flow failed.

**What I did:** I prompted the assistant to (1) request **raw JSON only** in the system/user prompt (e.g. “Respond with JSON only, no extra text”), and (2) use the Gemini **structured output** option so the model is constrained to JSON. In code, that meant setting `responseMimeType: "application/json"` in the `generationConfig` of the Gemini request. After that, the API returned parseable JSON consistently and the feature worked reliably.

---

## How to run

**Backend:** Python 3.10+. From project root: `python -m venv .venv`, activate it, then `pip install -r requirements.txt` and `uvicorn backend.app.main:app --reload --port 8000`. API at `http://localhost:8000`, docs at `http://localhost:8000/docs`.

**Frontend:** Node.js 18+. From project root: `cd frontend`, `npm install`, `npm run dev`. App at `http://localhost:5173`.

**Env:** Add `GEMINI_API_KEY` to a root `.env` file for the “Generate AI Suggestions” feature.

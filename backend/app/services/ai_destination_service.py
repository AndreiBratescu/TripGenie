from __future__ import annotations

from typing import Any, List

import json
import os

import httpx

from backend.app.core.config import settings


GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"
# Use a stable alias so you don't hit model deprecations.
GEMINI_MODEL = "gemini-flash-latest"


class GeminiError(Exception):
    pass


def generate_destinations_from_ai(
    budget: float,
    season: str,
    interests: str,
    *,
    model: str = GEMINI_MODEL,
) -> List[dict[str, Any]]:
    """
    Call the Gemini API to generate 3 destinations in JSON format
    based on budget, season and comma-separated interests.
    """

    api_key = (
        settings.gemini_api_key
        or os.getenv("GEMINI_API_KEY")
        or os.getenv("GOOGLE_API_KEY")
    )
    if not api_key:
        raise GeminiError("Gemini API key is not configured")

    prompt = (
        "You are a travel planner. "
        "Given a budget (in USD), a travel season, and comma-separated interests, "
        "return exactly 3 destination suggestions as a JSON array. "
        "Each destination must be an object with these keys: "
        "`name` (string), `country` (string), `city` (string), "
        "`estimated_cost` (number), `best_season` (string), "
        "`matching_interests` (array of strings), `description` (string).\n\n"
        f"Budget: {budget}\n"
        f"Season: {season}\n"
        f"Interests: {interests}\n\n"
        "Respond with JSON only, no extra text."
    )

    url = f"{GEMINI_API_BASE}/{model}:generateContent"

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}],
            }
        ],
        "generationConfig": {
            "temperature": 0.8,
            "responseMimeType": "application/json",
        },
    }

    try:
        response = httpx.post(
            url,
            headers={"x-goog-api-key": api_key},
            json=payload,
            timeout=30.0,
        )
        response.raise_for_status()
    except httpx.HTTPError as exc:
        # Avoid leaking sensitive details; include status when available.
        status_code = getattr(getattr(exc, "response", None), "status_code", None)
        if status_code:
            raise GeminiError(f"Error calling Gemini API (HTTP {status_code})") from exc
        raise GeminiError("Error calling Gemini API") from exc

    data = response.json()
    try:
        parts = data["candidates"][0]["content"]["parts"]
        content = "".join(p.get("text", "") for p in parts if isinstance(p, dict))
    except (KeyError, IndexError) as exc:
        raise GeminiError(f"Unexpected Gemini response format: {data}") from exc

    # Ensure we return a Python list of dicts
    try:
        destinations = json.loads(content)
    except json.JSONDecodeError as exc:
        raise GeminiError(f"Gemini response was not valid JSON: {content}") from exc

    if not isinstance(destinations, list):
        raise GeminiError("Gemini response JSON is not a list")

    return destinations


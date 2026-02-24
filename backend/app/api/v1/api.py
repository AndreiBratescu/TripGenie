from fastapi import APIRouter

from backend.app.api.v1.endpoints import destinations, trips

api_router = APIRouter()
api_router.include_router(trips.router)
api_router.include_router(destinations.router)


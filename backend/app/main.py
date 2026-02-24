from fastapi import FastAPI

from backend.app.api.v1.api import api_router
from backend.app.db.init_db import init_db


def create_application() -> FastAPI:
    app = FastAPI(
        title="TripGenie API",
        version="0.1.0",
    )

    @app.on_event("startup")
    def on_startup() -> None:
        init_db()

    app.include_router(api_router, prefix="/api/v1")

    return app


app = create_application()


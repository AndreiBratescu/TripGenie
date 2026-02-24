from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "TripGenie API"
    database_url: str = "sqlite:///./tripgenie.db"
    # Keep secrets out of source control; set via `.env` or environment variables.
    openai_api_key: str | None = None
    gemini_api_key: str | None = None

    class Config:
        env_file = ".env"


settings = Settings()


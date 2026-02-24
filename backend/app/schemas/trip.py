from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class TripBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = None
    season: Optional[str] = None
    interests: Optional[str] = Field(
        default=None,
        description="Comma-separated list of interests (e.g. 'beach,food,history')",
    )


class TripCreate(TripBase):
    pass


class TripUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = None
    season: Optional[str] = None
    interests: Optional[str] = None


class TripInDBBase(TripBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Trip(TripInDBBase):
    pass


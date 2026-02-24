from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class DestinationBase(BaseModel):
    name: str = Field(..., max_length=120)
    description: Optional[str] = None
    country: Optional[str] = Field(default=None, max_length=80)
    city: Optional[str] = Field(default=None, max_length=80)
    address: Optional[str] = Field(default=None, max_length=255)

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    arrival_date: Optional[date] = None
    departure_date: Optional[date] = None


class DestinationCreate(DestinationBase):
    trip_id: int


class DestinationUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=120)
    description: Optional[str] = None
    country: Optional[str] = Field(default=None, max_length=80)
    city: Optional[str] = Field(default=None, max_length=80)
    address: Optional[str] = Field(default=None, max_length=255)

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    arrival_date: Optional[date] = None
    departure_date: Optional[date] = None


class DestinationInDBBase(DestinationBase):
    id: int
    trip_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Destination(DestinationInDBBase):
    pass


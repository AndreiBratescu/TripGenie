from typing import List, Optional

from sqlalchemy.orm import Session

from backend.app.models.trip import Trip
from backend.app.schemas.trip import TripCreate, TripUpdate


def get_trip(db: Session, trip_id: int) -> Optional[Trip]:
    return db.query(Trip).filter(Trip.id == trip_id).first()


def get_trips(db: Session, skip: int = 0, limit: int = 100) -> List[Trip]:
    return db.query(Trip).offset(skip).limit(limit).all()


def create_trip(db: Session, trip_in: TripCreate) -> Trip:
    trip = Trip(**trip_in.model_copy().dict())
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


def update_trip(db: Session, trip: Trip, trip_in: TripUpdate) -> Trip:
    data = trip_in.model_copy(exclude_unset=True).dict()
    for field, value in data.items():
        setattr(trip, field, value)
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


def delete_trip(db: Session, trip: Trip) -> None:
    db.delete(trip)
    db.commit()


from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.api.deps import get_db
from backend.app.schemas.trip import Trip, TripCreate, TripUpdate
from backend.app.services import trip_service

router = APIRouter(prefix="/trips", tags=["trips"])


@router.get("/", response_model=List[Trip])
def list_trips(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> List[Trip]:
    return trip_service.get_trips(db, skip=skip, limit=limit)


@router.get("/{trip_id}", response_model=Trip)
def get_trip(trip_id: int, db: Session = Depends(get_db)) -> Trip:
    trip = trip_service.get_trip(db, trip_id=trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )
    return trip


@router.post("/", response_model=Trip, status_code=status.HTTP_201_CREATED)
def create_trip(trip_in: TripCreate, db: Session = Depends(get_db)) -> Trip:
    return trip_service.create_trip(db, trip_in=trip_in)


@router.put("/{trip_id}", response_model=Trip)
def update_trip(trip_id: int, trip_in: TripUpdate, db: Session = Depends(get_db)) -> Trip:
    trip = trip_service.get_trip(db, trip_id=trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )
    return trip_service.update_trip(db, trip=trip, trip_in=trip_in)


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(trip_id: int, db: Session = Depends(get_db)) -> None:
    trip = trip_service.get_trip(db, trip_id=trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )
    trip_service.delete_trip(db, trip=trip)
    return None


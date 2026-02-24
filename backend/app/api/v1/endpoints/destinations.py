from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.api.deps import get_db
from backend.app.schemas.destination import Destination
from backend.app.services import destination_service, trip_service

router = APIRouter(prefix="/trips/{trip_id}/destinations", tags=["destinations"])


@router.get("/", response_model=List[Destination])
def list_destinations_for_trip(
    trip_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> List[Destination]:
    trip = trip_service.get_trip(db, trip_id=trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )

    return destination_service.get_destinations_for_trip(
        db,
        trip_id=trip_id,
        skip=skip,
        limit=limit,
    )


@router.delete("/{destination_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_destination_for_trip(
    trip_id: int,
    destination_id: int,
    db: Session = Depends(get_db),
) -> None:
    trip = trip_service.get_trip(db, trip_id=trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )

    destination = destination_service.get_destination(db, destination_id=destination_id)
    if not destination or destination.trip_id != trip_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found for this trip",
        )

    destination_service.delete_destination(db, destination=destination)
    return None


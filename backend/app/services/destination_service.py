from typing import List, Optional

from sqlalchemy.orm import Session

from backend.app.models.destination import Destination


def get_destination(db: Session, destination_id: int) -> Optional[Destination]:
    return db.query(Destination).filter(Destination.id == destination_id).first()


def get_destinations_for_trip(
    db: Session,
    trip_id: int,
    skip: int = 0,
    limit: int = 100,
) -> List[Destination]:
    return (
        db.query(Destination)
        .filter(Destination.trip_id == trip_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def delete_destination(db: Session, destination: Destination) -> None:
    db.delete(destination)
    db.commit()


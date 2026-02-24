from typing import Any, List, Optional

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


def create_destinations_from_ai_output(
    db: Session,
    trip_id: int,
    ai_destinations: List[dict[str, Any]],
) -> List[Destination]:
    created: List[Destination] = []

    for item in ai_destinations:
        destination = Destination(
            trip_id=trip_id,
            name=item.get("name", "Unknown destination"),
            description=item.get("description"),
            country=item.get("country"),
            city=item.get("city"),
            # The AI may return extra keys like `estimated_cost`, `best_season`,
            # or `matching_interests` which we currently ignore at persistence time.
        )
        db.add(destination)
        created.append(destination)

    db.commit()

    for destination in created:
        db.refresh(destination)

    return created


from backend.app.db.session import Base, engine
from backend.app.models import trip  # noqa: F401


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()


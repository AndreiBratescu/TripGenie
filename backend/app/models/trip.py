from datetime import datetime, date

from sqlalchemy import Column, Date, DateTime, Float, Integer, String, Text, func

from backend.app.db.session import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    budget = Column(Float, nullable=True)
    season = Column(String(50), nullable=True)
    interests = Column(String(255), nullable=True)  # comma-separated list for simplicity

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


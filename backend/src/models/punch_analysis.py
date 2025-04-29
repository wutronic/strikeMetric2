from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func, Enum
from sqlalchemy.orm import relationship
from .base import Base
import enum

class PunchType(enum.Enum):
    JAB = "jab"
    CROSS = "cross"
    HOOK = "hook"
    UPPERCUT = "uppercut"

class PunchAnalysis(Base):
    __tablename__ = "punch_analyses"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    punch_type = Column(Enum(PunchType), nullable=False)
    speed = Column(Float)
    force = Column(Float)
    accuracy = Column(Float)
    notes = Column(String(500))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="punch_analyses")

    def __repr__(self):
        return f"<PunchAnalysis user_id={self.user_id} type={self.punch_type}>" 
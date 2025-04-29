from .base import BaseModel
from .user import User
from .punch_analysis import PunchAnalysis

__all__ = [
    'BaseModel',
    'User',
    'PunchAnalysis'
]

# Create all tables
BaseModel.metadata.create_all(bind=engine) 
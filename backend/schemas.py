from pydantic import BaseModel
from datetime import date

# For validating user input when request hits the api, not DB
class LogCreate(BaseModel):
    date: date
    service: str
    amount: float

class LogResponse(BaseModel):
    id: int
    date: date
    service: str
    amount: float

# This tells Pydantic to read from SQLAlchemy objects
    class Config:
        orm_mode = True

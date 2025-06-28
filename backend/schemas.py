from pydantic import BaseModel
from datetime import date

class LogCreate(BaseModel):
    date: date
    service: str
    amount: float
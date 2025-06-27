from pydantic import BaseModel
from datetime import date

class LogCeate(BaseModel):
    date: date
    service: str
    amount: float
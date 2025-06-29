from pydantic import BaseModel
from datetime import date

# For validating user input when request hits the api, not DB
class LogCreate(BaseModel):
    date: date
    service: str
    amount: float
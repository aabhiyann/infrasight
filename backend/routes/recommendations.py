from fastapi import APIRouter, Query
from typing import Optional
from ml_utils import generate_recommendations

router = APIRouter()

@router.post("/recommendations")
def get_recommendations(max_budget: Optional[float] = Query(None, description="Max budget per service")):
    return generate_recommendations(max_budget=max_budget)

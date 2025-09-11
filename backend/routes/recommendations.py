from fastapi import APIRouter, Query
from typing import Optional
from ml_utils import generate_recommendations

router = APIRouter()

@router.post("/recommendations")
def get_recommendations(
    max_budget: Optional[float] = Query(None, description="Max budget per service"),
    service: Optional[str] = Query(None, description="Filter by service name"),
):
    result = generate_recommendations(max_budget=max_budget)
    if service:
        filtered = [r for r in result.get("recommendations", []) if r.get("service") == service]
        result["recommendations"] = filtered
    return result



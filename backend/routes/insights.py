from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import date, timedelta
import random
from pydantic import BaseModel

router = APIRouter()


class RecommendationRequest(BaseModel):
    service: Optional[str] = None
    max_budget: Optional[float] = None

# recommendations to reduce cost (basic/static). Kept under a different path to avoid conflict
@router.post("/recommendations/basic")
def get_basic_recommendations(request: RecommendationRequest):
    try:
        tips = []
        tips.append("Enable AWS Budgets to track overspending in real time.")

        if request.service:
            service = request.service.lower()
            if service == "amazon ec2":
                tips.append("Consider using Spot Instances or scheduling EC2 shutdowns.")
            elif service == "amazon s3":
                tips.append("Move infrequently accessed S3 objects to Glacier storage.")
            elif service == "amazon rds":
                tips.append("Switch to reserved RDS instances for long-term savings.")

        if request.max_budget and request.max_budget < 50:
            tips.append("Your budget is low — consider removing idle resources or moving to serverless.")

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error generating recommendations: {str(e)}")

    return {"recommendations": tips}
        


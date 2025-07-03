from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import date, timedelta
import random
from pydantic import BaseModel

router = APIRouter()

# modify this later to forecast from any start_date, not just today 
@router.get("/forecast")
def forecast_costs(days: Optional[int] = 7):
    try:
        days = int(days)
        if days <= 0 or days > 60:
            raise ValueError("days must be between 1 and 60")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    forecast = []
    base_date = date.today()
    base_cost = 2.0

    for i in range(days):
        day = base_date + timedelta(days=i)
        cost = round(base_cost + random.uniform(-0.3, 0.5), 2)
        forecast.append({
            "date": day.isoformat(),
            "predicted_cost": cost
        })

    return {"forecast": forecast}

class RecommendationRequest(BaseModel):
    service: Optional[str] = None
    max_budget: Optional[float] = None

# recommendations to reduce cose. Change this later to actual function
@router.post("/recommendations")
def get_recommendations(request: RecommendationRequest):
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
        


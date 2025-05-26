from fastapi import FastAPI
import json
from pathlib import Path


app = FastAPI()

@app.get("/api/cost")
def get_formatted_cost_data():
    # Load the mock JSON file
    file_path = Path(__file__).parent / "aws" / "mock_cost_data.json"
    with open(file_path, "r") as f:
        raw_data = json.load(f)

    # Extract and format the data
    formatted_data = []

    for day in raw_data['ResultsByTime']:
        date = day['TimePeriod']['Start']
        for group in day["Groups"]:
            service = group["Keys"][0]
            amount = float(group["Metrics"]["UnblendedCost"]["Amount"])
            formatted_data.append({
                "date": date,
                "service": service,
                "amount": amount
            })

    return formatted_data

# Filter logic
from pydantic import BaseModel
from typing import Optional
from datetime import date, timedelta

# Define expected response body
class CostFilter(BaseModel):
    service: Optional[str] = None
    min_amount: Optional[float] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

@app.post("/api/filter")
def filter_costs(filter: CostFilter):
    file_path = Path(__file__).parent / "aws" / "mock_cost_data.json"
    with open(file_path, "r") as f:
        raw_data = json.load(f)

    filtered_data = []

    for day in raw_data["ResultsByTime"]:
        date_str = day["TimePeriod"]["Start"]
        day_date = date.fromisoformat(date_str)

        # If user gave a date range, apply it
        if filter.start_date and day_date < filter.start_date:
            continue
        if filter.end_date and day_date > filter.end_date:
            continue

        for group in day["Groups"]:
            service = group["Keys"][0]
            amount = float(group["Metrics"]["UnblendedCost"]["Amount"])

            # Apply filters only if they're provided
            if filter.service and service != filter.service:
                continue
            if filter.min_amount and amount < filter.min_amount:
                continue

            filtered_data.append({
                "date": date_str,
                "service": service,
                "amount": round(amount, 2)
            })

    return filtered_data

import random
from typing import Optional

# modify this later to forecast from any start_date, not just today 
@app.get("/api/forecast")
def forecast_costs(days: Optional[int] = 7):
    # Funciton to return a mock list of predicted AWS costs for the next few days
    forecast = []
    base_date = date.today()
    base_cost = 2.0 # base staring cost

    for i in range(days):
        day = base_date + timedelta(days = i)
        #  adding some mock fake trend/recommendations
        cost = round(base_cost + random.uniform(-0.3, 0.5), 2)
        forecast.append(
            {
                "date": day.isoformat(),
                "predicted_cost": cost
            }
        )
    
    return forecast
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
from datetime import datetime

# Define expected response body
class CostFilter(BaseModel):
    service: str
    min_amount: float

@app.post("/api/filter")
def filter_costs(filter: CostFilter):
    # Load the mock JSON file
    file_path = Path(__file__).parent / "aws" / "mock_cost_data.json"
    with open(file_path, "r") as f:
        raw_data = json.load(f)

    # Extract and filter the data
    filtered_data = []

    for day in raw_data["ResultsByTime"]:
        date = day["TimePeriod"]["Start"]
        for group in day["Groups"]:
            service = group["Keys"][0]
            amount = float(group["Metrics"]["UnblendedCost"]["Amount"])
            if service == filter.service and amount >= filter.min_amount:
                filtered_data.append({
                    "date": date,
                    "service": service,
                    "amount": round(amount, 2)
                })

    return filtered_data
from fastapi import APIRouter, HTTPException, Query
import json
from pathlib import Path
from pydantic import BaseModel
from typing import Optional
from datetime import date

router = APIRouter()


def load_cost_data():
    file_path = Path(__file__).parent / "aws" / "mock_cost_data.json"
    with open(file_path, "r") as f:
        return json.load(f)

# Cost function
# 1. get the cost data
# 2. format the cost data
# 3. return the cost data

@router.get("/mock-data")
async def get_mock_data():
    return {
        "message": "Mock data retrieved successfully"
    }


@router.get("/api/cost")
def get_formatted_cost_data():
    try:
        raw_data = load_cost_data()
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Mock cost data file not found.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Cost data is not valid JSON.")

    formatted_data = []

    try:
        for day in raw_data["ResultsByTime"]:
            date = day["TimePeriod"]["Start"]
            for group in day["Groups"]:
                service = group["Keys"][0]
                amount = float(group["Metrics"]["UnblendedCost"]["Amount"])
                formatted_data.append({
                    "date": date,
                    "service": service,
                    "amount": round(amount, 2)
                })

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing cost data: {str(e)}")

    return {"cost_data": formatted_data}

# Filter logic
# Define expected response body
class CostFilter(BaseModel):
    service: Optional[str] = None
    min_amount: Optional[float] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

@router.post("/api/filter")
def filter_costs(
    filter: CostFilter,
    limit: Optional[int] = Query(None, gt=0),
    sort_by: Optional[str] = Query(None, regex="^(amount|date)$")
):
    try:
        raw_data = load_cost_data()
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Mock cost data file not found.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Cost data is not valid JSON.")

    filtered_data = []

    try:
        for day in raw_data["ResultsByTime"]:
            date_str = day["TimePeriod"]["Start"]
            day_date = date.fromisoformat(date_str)

            if filter.start_date and day_date < filter.start_date:
                continue
            if filter.end_date and day_date > filter.end_date:
                continue

            for group in day["Groups"]:
                service = group["Keys"][0]
                amount = float(group["Metrics"]["UnblendedCost"]["Amount"])

                if filter.service and service != filter.service:
                    continue
                if filter.min_amount and amount < filter.min_amount:
                    continue

                filtered_data.append({
                    "date": date_str,
                    "service": service,
                    "amount": round(amount, 2)
                })

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error filtering cost data: {str(e)}")
    
    # Sorting
    if sort_by == "amount":
        filtered_data.sort(key=lambda x: x["amount"], reverse=True)
    elif sort_by == "date":
        filtered_data.sort(key=lambda x: x["date"])  # ISO format sorts fine

    # Limit filtering
    if limit:
        filtered_data = filtered_data[:limit]

    return {"filtered_results": filtered_data}



@router.get("/api/services")
def get_unique_services():
    try:
        raw_data = load_cost_data()
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Mock cost data file not found.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Cost data is not valid JSON.")
    
    services = set()

    try:
        for day in raw_data["ResultsByTime"]:
            for group in day["Groups"]:
                service = group["Keys"][0]
                services.add(service)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting services: {str(e)}")

    return {"services": sorted(list(services))}

# route to get summary
@router.get('/api/summary')
def get_service_summary():
    try:
        raw_data = load_cost_data()
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Mock cost data not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Cost data is not valid JSON.")
    
    summary = {}

    try:
        for day in raw_data["ResultsByTime"]:
            for group in day["Groups"]:
                service = group["Keys"][0]
                amount = float(group["Metrics"]["UnblendedCost"]["Amount"])

                # Add to the running total for each service
                if service not in summary:
                    summary[service] = 0
                summary[service] += amount
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error generating summary: {str(e)}")
    
    # Rounding amounts to display 
    rounded_summary = {k: round(v, 2) for k, v in summary.items()}
    return {"summary": rounded_summary}


# route for top service
class DateRange(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None

@router.post("/api/top-service")
def get_top_service(date_range: DateRange):
    try:
        raw_data = load_cost_data()
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Mock cost data file not found.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Cost Data is not valid JSON.")
    
    totals = {}

    try:
        for day in raw_data["ResultsByTime"]:
            date_str = day["TimePeriod"]["Start"]
            day_date = date.fromisoformat(date_str)

            # Date filtering logic
            if date_range.start_date and day_date < date_range.start_date:
                continue
            if date_range.end_date and day_date > date_range.end_date:
                continue

            for group in day["Groups"]:
                service = group["Keys"][0]
                amount = float(group["Metrics"]["UnblendedCost"]["Amount"])

                if service not in totals:
                    totals[service] = 0
                totals[service] += amount
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculating top service: {str(e)}")
    
    if not totals:
        return {"message": "No data found in given range"}
    
    top_service = max(totals.items(), key=lambda x: x[1])
    return {"top-service": top_service[0], "total-amount": round(top_service[1], 2)}
    
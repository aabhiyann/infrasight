import json
from pathlib import Path
import pandas as pd
from fastapi import HTTPException

def load_mock_cost_data() -> dict:
    file_path = Path(__file__).parents[1]/ "aws" / "mock_cost_data.json"

    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException("Mock cost data file not found")
    except json.JSONDecodeError:
        raise ValueError("Cost data is not valid JSON")


def load_mock_cost_data_flat() -> pd.DataFrame:
    """
    Returns flattened AWS cost data as a DataFrame with date, service, amount columns.
    
    Performs data cleaning:
    - Flattens nested AWS cost structure
    - Converts dates to datetime
    - Removes zero/negative amounts
    - Sorts by date
    """
    raw_data = load_mock_cost_data()
    records = []

    for day in raw_data.get("ResultsByTime", []):
        date_str = day["TimePeriod"]["Start"]
        for group in day.get("Groups", []):
            service = group["Keys"][0]
            amount = float(group["Metrics"]["UnblendedCost"]["Amount"])
            
            # Skip zero or negative amounts (data cleaning)
            if amount > 0:
                records.append({
                    "date": date_str,
                    "service": service,
                    "amount": amount
                })

    if not records:
        # Return empty DataFrame with correct structure
        return pd.DataFrame(columns=["date", "service", "amount"])

    df = pd.DataFrame(records)
    df['date'] = pd.to_datetime(df['date'])
    
    # Sort by date for consistent ordering
    df = df.sort_values('date').reset_index(drop=True)
    
    return df

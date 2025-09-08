import json
from pathlib import Path

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
    # Returns flattened AWS cost data as a DataFrame with date, service, amount columns.
    raw_data = load_mock_cost_data()
    records = []

    for day in raw_data.get("ResultsByTime", []):
        date = day["TimePeriod"]["Start"]
        for group in day["Groups"]:
            service = group["Keys"][0]
            amount = float(group["Metrics"]["UnblendedCost"]["Amount"])
            records.append({
                "date": date,
                "service": service,
                "amount": amount
            })

    df = pd.DataFrame(records)
    df['date'] = pd.to_datetime(df['date'])
    return df

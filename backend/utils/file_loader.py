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
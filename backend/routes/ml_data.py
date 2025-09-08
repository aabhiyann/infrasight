from fastapi import APIRouter
from utils.file_loader import load_mock_cost_data_flat

router = APIRouter()

@router.get("/ml/cleaned-costs")
def get_cleaned_cost_data():
    """
    Returns cleaned AWS cost data in flat format:
    [
      { "date": "2024-01-01", "service": "Amazon EC2", "amount": 12.34 },
      ...
    ]
    """
    df = load_mock_cost_data_flat()
    return df.to_dict(orient="records")  # return as list of dicts

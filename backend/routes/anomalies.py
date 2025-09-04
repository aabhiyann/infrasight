from fastapi import APIRouter
from utils.file_loader import load_mock_cost_data
from ml_utils import detect_anomalies

router = APIRouter()

@router.get("/anomalies")
async def get_anomalies(z_threshold: float = 2.0):
    """
    Detect anomalies in AWS cost data using z-score method.
    Query param: z_threshold (default=2.0)
    """
    data = load_mock_cost_data()
    anomalies = detect_anomalies(data, z_threshold=z_threshold)
    return anomalies

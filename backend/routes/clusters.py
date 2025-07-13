from fastapi import APIRouter, HTTPException
from pathlib import Path
import json
from ml_utils import cluster_costs
from utils.file_loader import load_mock_cost_data

router = APIRouter()

@router.get("/clusters")
def get_clusters():
    try:
        # Load mock AWS data for testing
        raw_data = load_mock_cost_data()
        result = cluster_costs(raw_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
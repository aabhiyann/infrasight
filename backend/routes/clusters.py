from fastapi import APIRouter, HTTPException
from pathlib import Path
import json
from ml_utils import cluster_costs

router = APIRouter()

@router.get("/clusters")
def get_clusters():
    try:
        # Load mock AWS data for testing
        file_path = 
from fastapi import APIRouter, HTTPException, Query
from pathlib import Path
import json
from ml_utils import cluster_costs
from utils.file_loader import load_cost_data, get_data_source_info
from typing import Optional

router = APIRouter()

@router.get("/clusters")
def get_clusters(source: Optional[str] = Query(None, description="Data source: 'mock', 'real', or None for auto-detect")):
    """
    Get cost clustering analysis from specified data source.
    
    Args:
        source: Optional data source override ('mock', 'real', or None for auto-detect)
    """
    try:
        # Load cost data from specified source or auto-detect
        raw_data = load_cost_data(source)
        result = cluster_costs(raw_data)
        
        # Add data source info to response
        data_source_info = get_data_source_info()
        result["data_source"] = data_source_info["current_source"]
        result["data_source_info"] = data_source_info
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
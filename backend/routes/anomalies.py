from fastapi import APIRouter, HTTPException, Query
from typing import Dict, List, Any, Optional
from utils.file_loader import load_cost_data, get_data_source_info
from ml_utils import detect_anomalies
from schemas import AnomalyResponse, AnomalySummaryResponse

router = APIRouter()

@router.get("/anomalies", response_model=AnomalyResponse)
async def get_anomalies(
    z_threshold: float = 2.0,
    source: Optional[str] = Query(None, description="Data source: 'mock', 'real', or None for auto-detect")
):
    """
    Detect anomalies in AWS cost data using z-score method.
    
    Args:
        z_threshold: Z-score threshold for anomaly detection (default=2.0)
        source: Optional data source override ('mock', 'real', or None for auto-detect)
        
    Returns:
        Dictionary containing:
        - anomalies: Dict of service -> list of anomaly records
        - summary: Summary statistics
        - threshold_used: The z-threshold used for detection
    """
    try:
        # Load cost data from specified source or auto-detect
        data = load_cost_data(source)
        
        # Detect anomalies
        anomalies = detect_anomalies(data, z_threshold=z_threshold)
        
        # Calculate summary statistics
        total_anomalies = sum(len(points) for points in anomalies.values())
        services_with_anomalies = len(anomalies)
        
        # Flatten anomalies for easier frontend consumption
        flattened_anomalies = []
        for service, points in anomalies.items():
            for point in points:
                flattened_anomalies.append({
                    "service": service,
                    "date": point["date"],
                    "amount": point["amount"],
                    "z_score": point["z_score"]
                })
        
        # Add data source info to response
        data_source_info = get_data_source_info()
        
        return {
            "anomalies": anomalies,
            "flattened_anomalies": flattened_anomalies,
            "summary": {
                "total_anomalies": total_anomalies,
                "services_affected": services_with_anomalies,
                "services": list(anomalies.keys())
            },
            "threshold_used": z_threshold,
            "data_source": data_source_info["current_source"],
            "data_source_info": data_source_info,
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting anomalies: {str(e)}")

@router.get("/anomalies/summary", response_model=AnomalySummaryResponse)
async def get_anomalies_summary():
    """
    Get a summary of anomalies across different threshold levels.
    """
    try:
        data = load_mock_cost_data()
        thresholds = [0.5, 1.0, 1.5, 2.0, 2.5]
        
        summary = {}
        for threshold in thresholds:
            anomalies = detect_anomalies(data, z_threshold=threshold)
            total_anomalies = sum(len(points) for points in anomalies.values())
            summary[f"threshold_{threshold}"] = {
                "total_anomalies": total_anomalies,
                "services_affected": len(anomalies),
                "services": list(anomalies.keys())
            }
        
        return {
            "threshold_summary": summary,
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")

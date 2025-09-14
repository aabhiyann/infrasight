from fastapi import APIRouter, HTTPException, Query
from typing import Dict, List, Any, Optional
from datetime import date
from utils.file_loader import load_cost_data, load_cost_data_flat, get_data_source_info
from ml_utils import detect_anomalies
from schemas import AnomalyResponse, AnomalySummaryResponse
import pandas as pd

router = APIRouter()

@router.get("/anomalies", response_model=AnomalyResponse)
async def get_anomalies(
    z_threshold: float = 2.0,
    source: Optional[str] = Query(None, description="Data source: 'mock', 'real', or None for auto-detect"),
    start_date: Optional[date] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date filter (YYYY-MM-DD)"),
    service: Optional[str] = Query(None, description="Filter by specific service")
):
    """
    Detect anomalies in AWS cost data using z-score method.
    
    Args:
        z_threshold: Z-score threshold for anomaly detection (default=2.0)
        source: Optional data source override ('mock', 'real', or None for auto-detect)
        start_date: Optional start date filter (YYYY-MM-DD)
        end_date: Optional end date filter (YYYY-MM-DD)
        service: Optional service filter
        
    Returns:
        Dictionary containing:
        - anomalies: Dict of service -> list of anomaly records
        - summary: Summary statistics
        - threshold_used: The z-threshold used for detection
    """
    try:
        # Load cost data from specified source or auto-detect
        if start_date or end_date or service:
            # Use flat data format for filtering
            df = load_cost_data_flat(source)
            
            # Apply date filters
            if start_date:
                df = df[df['date'] >= pd.to_datetime(start_date)]
            if end_date:
                df = df[df['date'] <= pd.to_datetime(end_date)]
            if service:
                df = df[df['service'] == service]
            
            # Convert back to the format expected by detect_anomalies
            data = {"ResultsByTime": []}
            for _, row in df.iterrows():
                date_str = row['date'].strftime('%Y-%m-%d')
                
                # Find or create the day entry
                day_entry = None
                for day in data["ResultsByTime"]:
                    if day["TimePeriod"]["Start"] == date_str:
                        day_entry = day
                        break
                
                if not day_entry:
                    day_entry = {
                        "TimePeriod": {"Start": date_str, "End": date_str},
                        "Groups": []
                    }
                    data["ResultsByTime"].append(day_entry)
                
                # Add the service group
                day_entry["Groups"].append({
                    "Keys": [row['service']],
                    "Metrics": {
                        "UnblendedCost": {
                            "Amount": str(row['amount']),
                            "Unit": "USD"
                        }
                    }
                })
        else:
            # Use original method for full dataset
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

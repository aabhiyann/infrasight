from fastapi import APIRouter, HTTPException, Query
from typing import Dict, List, Any, Optional
from utils.file_loader import load_cost_data, get_data_source_info
from ml_utils import forecast_costs
from schemas import ForecastResponse

router = APIRouter()

def convert_aws_data_to_flat_format(raw_data: dict) -> List[Dict]:
    """Convert AWS Cost Explorer format to flat list format for forecasting."""
    data = []
    for day in raw_data.get("ResultsByTime", []):
        date_str = day["TimePeriod"]["Start"]
        for group in day["Groups"]:
            service = group["Keys"][0]
            amount = float(group["Metrics"]["UnblendedCost"]["Amount"])
            data.append({
                "date": date_str,
                "service": service,
                "amount": amount
            })
    return data

@router.get("/forecast", response_model=ForecastResponse)
async def get_cost_forecast(
    n_days: int = 7, 
    service: Optional[str] = None,
    source: Optional[str] = Query(None, description="Data source: 'mock', 'real', or None for auto-detect")
):
    """
    Advanced AWS cost forecasting with service-level predictions and confidence intervals.
    
    Args:
        n_days: Number of days to forecast (default=7, max=30)
        service: Optional service name to forecast only that service
        source: Optional data source override ('mock', 'real', or None for auto-detect)
        
    Returns:
        ForecastResponse with:
        - service_forecasts: Per-service predictions with confidence intervals
        - total_forecast: Aggregated total cost predictions
        - summary: Forecast summary statistics
    """
    try:
        # Validate inputs
        if n_days < 1 or n_days > 30:
            raise HTTPException(
                status_code=400, 
                detail="n_days must be between 1 and 30"
            )
        
        # Load cost data from specified source or auto-detect
        raw_data = load_cost_data(source)
        data = convert_aws_data_to_flat_format(raw_data)
        
        # Filter by service if specified
        if service:
            data = [record for record in data if record.get('service') == service]
            if not data:
                raise HTTPException(
                    status_code=404, 
                    detail=f"Service '{service}' not found in data"
                )
        
        # Generate forecast
        forecast_result = forecast_costs(data, n_days=n_days)
        
        # Add data source info and status
        data_source_info = get_data_source_info()
        forecast_result["data_source"] = data_source_info["current_source"]
        forecast_result["data_source_info"] = data_source_info
        forecast_result["status"] = "success"
        
        return forecast_result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating forecast: {str(e)}"
        )


@router.get("/forecast/services")
async def get_available_services(
    source: Optional[str] = Query(None, description="Data source: 'mock', 'real', or None for auto-detect")
) -> Dict[str, Any]:
    """
    Get list of available services for forecasting.
    """
    try:
        raw_data = load_cost_data(source)
        data = convert_aws_data_to_flat_format(raw_data)
        services = list(set(record.get('service') for record in data if record.get('service')))
        services.sort()
        
        # Add data source info
        data_source_info = get_data_source_info()
        
        return {
            "services": services,
            "total_services": len(services),
            "data_source": data_source_info["current_source"],
            "data_source_info": data_source_info,
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error getting services: {str(e)}"
        )

@router.get("/forecast/compare")
async def compare_forecast_methods(
    n_days: int = 7,
    source: Optional[str] = Query(None, description="Data source: 'mock', 'real', or None for auto-detect")
) -> Dict[str, Any]:
    """
    Compare legacy vs advanced forecasting methods.
    """
    try:
        if n_days < 1 or n_days > 30:
            raise HTTPException(
                status_code=400, 
                detail="n_days must be between 1 and 30"
            )
        
        raw_data = load_cost_data(source)
        data = convert_aws_data_to_flat_format(raw_data)
        
        # Get forecast
        forecast_result = forecast_costs(data, n_days=n_days)
        
        # Calculate total cost
        total_cost = sum(pred['predicted_cost'] for pred in forecast_result['total_forecast'])
        
        # Add data source info
        data_source_info = get_data_source_info()
        
        return {
            "forecast": {
                "total_cost": round(total_cost, 2),
                "daily_predictions": forecast_result['total_forecast'],
                "service_breakdown": forecast_result['service_forecasts'],
                "summary": forecast_result['summary']
            },
            "data_source": data_source_info["current_source"],
            "data_source_info": data_source_info,
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error comparing forecasts: {str(e)}"
        )

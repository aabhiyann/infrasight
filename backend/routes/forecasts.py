from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any, Optional
from utils.file_loader import load_mock_cost_data
from ml_utils import forecast_costs_advanced, forecast_costs
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
async def get_cost_forecast(n_days: int = 7, service: Optional[str] = None):
    """
    Advanced AWS cost forecasting with service-level predictions and confidence intervals.
    
    Args:
        n_days: Number of days to forecast (default=7, max=30)
        service: Optional service name to forecast only that service
        
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
        
        # Load mock data (AWS Cost Explorer format)
        raw_data = load_mock_cost_data()
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
        forecast_result = forecast_costs_advanced(data, n_days=n_days)
        
        # Add status
        forecast_result["status"] = "success"
        
        return forecast_result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating forecast: {str(e)}"
        )

@router.get("/forecast/legacy")
async def get_cost_forecast_legacy(n_days: int = 7) -> List[Dict[str, float]]:
    """
    Legacy forecasting endpoint - simple total cost prediction.
    Use /forecast for advanced predictions with confidence intervals.
    """
    try:
        if n_days < 1 or n_days > 30:
            raise HTTPException(
                status_code=400, 
                detail="n_days must be between 1 and 30"
            )
        
        raw_data = load_mock_cost_data()
        data = convert_aws_data_to_flat_format(raw_data)
        return forecast_costs(data, n_days=n_days)
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating legacy forecast: {str(e)}"
        )

@router.get("/forecast/services")
async def get_available_services() -> Dict[str, List[str]]:
    """
    Get list of available services for forecasting.
    """
    try:
        raw_data = load_mock_cost_data()
        data = convert_aws_data_to_flat_format(raw_data)
        services = list(set(record.get('service') for record in data if record.get('service')))
        services.sort()
        
        return {
            "services": services,
            "total_services": len(services),
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error getting services: {str(e)}"
        )

@router.get("/forecast/compare")
async def compare_forecast_methods(n_days: int = 7) -> Dict[str, Any]:
    """
    Compare legacy vs advanced forecasting methods.
    """
    try:
        if n_days < 1 or n_days > 30:
            raise HTTPException(
                status_code=400, 
                detail="n_days must be between 1 and 30"
            )
        
        raw_data = load_mock_cost_data()
        data = convert_aws_data_to_flat_format(raw_data)
        
        # Get both forecasts
        legacy_forecast = forecast_costs(data, n_days=n_days)
        advanced_forecast = forecast_costs_advanced(data, n_days=n_days)
        
        # Calculate total costs for comparison
        legacy_total = sum(pred['predicted_cost'] for pred in legacy_forecast)
        advanced_total = sum(pred['predicted_cost'] for pred in advanced_forecast['total_forecast'])
        
        return {
            "legacy_forecast": {
                "total_cost": round(legacy_total, 2),
                "daily_predictions": legacy_forecast
            },
            "advanced_forecast": {
                "total_cost": round(advanced_total, 2),
                "daily_predictions": advanced_forecast['total_forecast'],
                "service_breakdown": advanced_forecast['service_forecasts']
            },
            "comparison": {
                "difference": round(advanced_total - legacy_total, 2),
                "percentage_difference": round(((advanced_total - legacy_total) / legacy_total) * 100, 2) if legacy_total > 0 else 0
            },
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error comparing forecasts: {str(e)}"
        )

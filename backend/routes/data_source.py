from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from utils.file_loader import get_data_source_info, load_cost_data, load_cost_data_flat
from aws.cost_fetcher import test_aws_connection

router = APIRouter()

@router.get("/data-source/status")
def get_data_source_status() -> Dict[str, Any]:
    """
    Get comprehensive information about the current data source configuration.
    
    Returns:
        Dictionary containing:
        - current_source: Current data source being used
        - environment_config: Environment variable settings
        - aws_connection: AWS connection status (if using real data)
        - available_sources: List of available data sources
    """
    return get_data_source_info()

@router.get("/data-source/test-connection")
def test_data_source_connection() -> Dict[str, Any]:
    """
    Test the connection to the configured data source.
    
    Returns:
        Dictionary containing connection test results
    """
    data_source_info = get_data_source_info()
    current_source = data_source_info["current_source"]
    
    result = {
        "current_source": current_source,
        "test_results": {}
    }
    
    if current_source == "real":
        # Test AWS connection
        aws_test = test_aws_connection()
        result["test_results"]["aws"] = aws_test
        
        if aws_test["status"] == "success":
            # Test data fetching
            try:
                test_data = load_cost_data("real")
                result["test_results"]["data_fetch"] = {
                    "status": "success",
                    "message": f"Successfully fetched {len(test_data.get('ResultsByTime', []))} days of data",
                    "sample_services": []
                }
                
                # Get sample services from first day
                if test_data.get("ResultsByTime"):
                    first_day = test_data["ResultsByTime"][0]
                    services = [group["Keys"][0] for group in first_day.get("Groups", [])]
                    result["test_results"]["data_fetch"]["sample_services"] = services[:5]
                    
            except Exception as e:
                result["test_results"]["data_fetch"] = {
                    "status": "error",
                    "message": f"Failed to fetch data: {str(e)}"
                }
    else:
        # Test mock data
        try:
            test_data = load_cost_data("mock")
            result["test_results"]["mock_data"] = {
                "status": "success",
                "message": f"Successfully loaded mock data with {len(test_data.get('ResultsByTime', []))} days",
                "sample_services": []
            }
            
            # Get sample services from first day
            if test_data.get("ResultsByTime"):
                first_day = test_data["ResultsByTime"][0]
                services = [group["Keys"][0] for group in first_day.get("Groups", [])]
                result["test_results"]["mock_data"]["sample_services"] = services[:5]
                
        except Exception as e:
            result["test_results"]["mock_data"] = {
                "status": "error",
                "message": f"Failed to load mock data: {str(e)}"
            }
    
    return result

@router.get("/data-source/sample-data")
def get_sample_data(days: int = 1) -> Dict[str, Any]:
    """
    Get a sample of cost data from the current data source.
    
    Args:
        days: Number of days to sample (max 7 for real data)
        
    Returns:
        Sample cost data with metadata
    """
    if days > 7:
        days = 7
    
    data_source_info = get_data_source_info()
    current_source = data_source_info["current_source"]
    
    try:
        if current_source == "real":
            # For real data, limit to last 7 days for sample
            from datetime import datetime, timedelta
            end_date = datetime.now().strftime('%Y-%m-%d')
            start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
            
            from aws.cost_fetcher import fetch_aws_cost_data
            raw_data = fetch_aws_cost_data(start_date, end_date)
            df = load_cost_data_flat("real")
        else:
            raw_data = load_cost_data("mock")
            df = load_cost_data_flat("mock")
        
        # Get summary statistics
        summary = {
            "total_records": len(df),
            "date_range": {
                "start": df['date'].min().strftime('%Y-%m-%d') if len(df) > 0 else None,
                "end": df['date'].max().strftime('%Y-%m-%d') if len(df) > 0 else None
            },
            "services": sorted(df['service'].unique().tolist()) if len(df) > 0 else [],
            "total_amount": round(df['amount'].sum(), 2) if len(df) > 0 else 0,
            "average_amount": round(df['amount'].mean(), 2) if len(df) > 0 else 0
        }
        
        # Get sample records (first 10)
        sample_records = df.head(10).to_dict(orient="records")
        for record in sample_records:
            record['date'] = record['date'].strftime('%Y-%m-%d')
        
        return {
            "data_source": current_source,
            "sample_records": sample_records,
            "summary": summary,
            "raw_data_structure": {
                "results_by_time_count": len(raw_data.get("ResultsByTime", [])),
                "first_day_sample": raw_data.get("ResultsByTime", [{}])[0] if raw_data.get("ResultsByTime") else {}
            },
            "data_source_info": data_source_info
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting sample data: {str(e)}"
        )

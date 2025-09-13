import json
import os
from pathlib import Path
import pandas as pd
from fastapi import HTTPException
from typing import Dict, Union
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def load_mock_cost_data() -> dict:
    """Load mock AWS cost data from JSON file."""
    file_path = Path(__file__).parents[1]/ "aws" / "mock_cost_data.json"

    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Mock cost data file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Cost data is not valid JSON")

def load_mock_cost_data_flat() -> pd.DataFrame:
    """Load mock AWS cost data and return as flat DataFrame."""
    try:
        raw_data = load_mock_cost_data()
        return convert_aws_data_to_flat_format(raw_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading mock data: {str(e)}")

def convert_aws_data_to_flat_format(raw_data: dict) -> pd.DataFrame:
    """Convert AWS Cost Explorer format to flat DataFrame."""
    records = []
    for day in raw_data.get("ResultsByTime", []):
        date_str = day["TimePeriod"]["Start"]
        for group in day["Groups"]:
            service = group["Keys"][0]
            amount = float(group["Metrics"]["UnblendedCost"]["Amount"])
            records.append({
                "date": pd.to_datetime(date_str),
                "service": service,
                "amount": amount
            })
    
    return pd.DataFrame(records)

def get_data_source() -> str:
    """Determine whether to use real or mock data based on environment variable."""
    use_real_data = os.getenv("USE_REAL_DATA", "false").lower() in ("true", "1", "yes")
    return "real" if use_real_data else "mock"

def load_cost_data(source: str = None) -> dict:
    """
    Load cost data from specified source or auto-detect based on environment.
    
    Args:
        source: "mock", "real", or None (auto-detect from USE_REAL_DATA env var)
        
    Returns:
        Raw cost data in AWS Cost Explorer format
    """
    if source is None:
        source = get_data_source()
    
    if source == "real":
        try:
            # Import here to avoid circular imports and handle missing boto3 gracefully
            from aws.cost_fetcher import fetch_aws_cost_data
            return fetch_aws_cost_data()
        except ImportError:
            raise HTTPException(
                status_code=500, 
                detail="boto3 not installed. Install with: pip install boto3"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to fetch real AWS data: {str(e)}"
            )
    else:
        return load_mock_cost_data()

def load_cost_data_flat(source: str = None) -> pd.DataFrame:
    """
    Load cost data in flat DataFrame format from specified source.
    
    Args:
        source: "mock", "real", or None (auto-detect from USE_REAL_DATA env var)
        
    Returns:
        DataFrame with columns: date, service, amount
    """
    if source is None:
        source = get_data_source()
    
    if source == "real":
        try:
            from aws.cost_fetcher import fetch_aws_cost_data_flat
            return fetch_aws_cost_data_flat()
        except ImportError:
            raise HTTPException(
                status_code=500, 
                detail="boto3 not installed. Install with: pip install boto3"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to fetch real AWS data: {str(e)}"
            )
    else:
        return load_mock_cost_data_flat()

def get_data_source_info() -> Dict:
    """Get information about the current data source configuration."""
    current_source = get_data_source()
    
    info = {
        "current_source": current_source,
        "use_real_data_env": os.getenv("USE_REAL_DATA", "false"),
        "available_sources": ["mock", "real"]
    }
    
    if current_source == "real":
        try:
            from aws.cost_fetcher import test_aws_connection
            connection_info = test_aws_connection()
            info["aws_connection"] = connection_info
        except ImportError:
            info["aws_connection"] = {
                "status": "error",
                "message": "boto3 not installed"
            }
        except Exception as e:
            info["aws_connection"] = {
                "status": "error", 
                "message": str(e)
            }
    
    return info

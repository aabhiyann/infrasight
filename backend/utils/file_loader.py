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
    """Force mock data only to prevent AWS charges."""
    # Always return mock to prevent any AWS API calls
    return "mock"

def load_cost_data(source: str = None) -> dict:
    """
    Load cost data - ALWAYS uses mock data to prevent AWS charges.
    
    Args:
        source: Ignored - always uses mock data for safety
        
    Returns:
        Mock cost data in AWS Cost Explorer format
    """
    # Always use mock data regardless of source parameter to prevent AWS charges
    if source == "real":
        print("WARNING: Real AWS data requested but blocked to prevent charges. Using mock data.")
    
    return load_mock_cost_data()

def load_cost_data_flat(source: str = None) -> pd.DataFrame:
    """
    Load cost data in flat DataFrame format - ALWAYS uses mock data to prevent AWS charges.
    
    Args:
        source: Ignored - always uses mock data for safety
        
    Returns:
        DataFrame with columns: date, service, amount (from mock data)
    """
    # Always use mock data regardless of source parameter to prevent AWS charges
    if source == "real":
        print("WARNING: Real AWS data requested but blocked to prevent charges. Using mock data.")
    
    return load_mock_cost_data_flat()

def get_data_source_info() -> Dict:
    """Get information about the current data source configuration."""
    return {
        "current_source": "mock",
        "use_real_data_env": "false",
        "available_sources": ["mock"],
        "aws_connection": {
            "status": "disabled",
            "message": "AWS access disabled to prevent charges"
        }
    }

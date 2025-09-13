import boto3
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import pandas as pd

# Load secrets from .env file
load_dotenv()

def get_cost_explorer_client():
    """Create and return a Cost Explorer client with proper error handling."""
    try:
        client = boto3.client(
            'ce',  # ce = Cost Explorer
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID") or os.getenv("AWS_ACCESS_KEY"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY") or os.getenv("AWS_SECRET_KEY"),
            region_name=os.getenv("AWS_REGION", "us-east-1")
        )
        return client
    except Exception as e:
        raise Exception(f"Failed to create AWS Cost Explorer client: {str(e)}")

def fetch_aws_cost_data(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    granularity: str = 'DAILY',
    metrics: List[str] = None,
    group_by: List[Dict] = None
) -> Dict:
    """
    Fetch AWS cost data using the Cost Explorer API.
    
    Args:
        start_date: Start date in YYYY-MM-DD format (defaults to 30 days ago)
        end_date: End date in YYYY-MM-DD format (defaults to today)
        granularity: DAILY, MONTHLY, or HOURLY
        metrics: List of metrics to retrieve (defaults to ['UnblendedCost'])
        group_by: List of group-by dimensions (defaults to service grouping)
        
    Returns:
        Raw AWS Cost Explorer API response
    """
    if metrics is None:
        metrics = ['UnblendedCost']
    
    if group_by is None:
        group_by = [{
            'Type': 'DIMENSION',
            'Key': 'SERVICE'
        }]
    
    # Set default date range if not provided
    if not end_date:
        end_date = datetime.now().strftime('%Y-%m-%d')
    
    if not start_date:
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
    
    try:
        client = get_cost_explorer_client()
        
        response = client.get_cost_and_usage(
            TimePeriod={
                'Start': start_date,
                'End': end_date
            },
            Granularity=granularity,
            Metrics=metrics,
            GroupBy=group_by
        )
        
        return response
        
    except Exception as e:
        raise Exception(f"Failed to fetch AWS cost data: {str(e)}")

def fetch_aws_cost_data_flat(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    granularity: str = 'DAILY'
) -> pd.DataFrame:
    """
    Fetch AWS cost data and return it in flat DataFrame format.
    
    Args:
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format  
        granularity: DAILY, MONTHLY, or HOURLY
        
    Returns:
        DataFrame with columns: date, service, amount
    """
    try:
        raw_data = fetch_aws_cost_data(start_date, end_date, granularity)
        
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
        
        df = pd.DataFrame(records)
        return df
        
    except Exception as e:
        raise Exception(f"Failed to fetch and format AWS cost data: {str(e)}")

def test_aws_connection() -> Dict:
    """
    Test AWS connection and return basic info.
    
    Returns:
        Dictionary with connection status and basic account info
    """
    try:
        client = get_cost_explorer_client()
        
        # Try to get dimension values to test connection
        response = client.get_dimension_values(
            TimePeriod={
                'Start': (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'),
                'End': datetime.now().strftime('%Y-%m-%d')
            },
            Dimension='SERVICE',
            SearchString='',
            MaxResults=5
        )
        
        return {
            "status": "success",
            "message": "AWS Cost Explorer connection successful",
            "available_services": len(response.get('DimensionValues', [])),
            "region": os.getenv("AWS_REGION", "us-east-1")
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"AWS connection failed: {str(e)}",
            "error_type": type(e).__name__
        }

# For backward compatibility and testing
if __name__ == "__main__":
    print("Testing AWS Cost Explorer connection...")
    
    # Test connection
    connection_test = test_aws_connection()
    print(f"Connection test: {connection_test}")
    
    if connection_test["status"] == "success":
        print("\nFetching recent cost data...")
        try:
            # Fetch last 7 days of data
            df = fetch_aws_cost_data_flat()
            print(f"Successfully fetched {len(df)} cost records")
            print(f"Date range: {df['date'].min()} to {df['date'].max()}")
            print(f"Services: {df['service'].nunique()} unique services")
            print(f"Total cost: ${df['amount'].sum():.2f}")
            
            # Show sample data
            print("\nSample data:")
            print(df.head())
            
        except Exception as e:
            print(f"Error fetching cost data: {str(e)}")
    else:
        print("Cannot fetch data due to connection issues")
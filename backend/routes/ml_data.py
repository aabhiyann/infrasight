from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import date
from utils.file_loader import load_mock_cost_data_flat
import pandas as pd

router = APIRouter()

@router.get("/ml/cleaned-costs")
def get_cleaned_cost_data(
    service: Optional[str] = Query(None, description="Filter by specific service"),
    start_date: Optional[date] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date filter (YYYY-MM-DD)"),
    min_amount: Optional[float] = Query(None, description="Minimum amount filter"),
    max_amount: Optional[float] = Query(None, description="Maximum amount filter"),
    sort_by: Optional[str] = Query("date", description="Sort by: date, amount, service"),
    sort_order: Optional[str] = Query("asc", description="Sort order: asc, desc"),
    limit: Optional[int] = Query(None, description="Limit number of results")
):
    """
    Returns cleaned AWS cost data in flat format with optional filtering and sorting.
    
    Example response:
    [
      { "date": "2024-01-01", "service": "Amazon EC2", "amount": 12.34 },
      ...
    ]
    """
    try:
        # Load and clean the data
        df = load_mock_cost_data_flat()
        
        # Apply filters
        if service:
            df = df[df['service'] == service]
        
        if start_date:
            df = df[df['date'] >= pd.to_datetime(start_date)]
        
        if end_date:
            df = df[df['date'] <= pd.to_datetime(end_date)]
        
        if min_amount is not None:
            df = df[df['amount'] >= min_amount]
        
        if max_amount is not None:
            df = df[df['amount'] <= max_amount]
        
        # Sort data
        if sort_by in ['date', 'amount', 'service']:
            ascending = sort_order.lower() == 'asc'
            df = df.sort_values(by=sort_by, ascending=ascending)
        
        # Apply limit
        if limit and limit > 0:
            df = df.head(limit)
        
        # Convert to list of dicts and format dates
        result = df.to_dict(orient="records")
        
        # Format dates as strings for JSON serialization
        for record in result:
            record['date'] = record['date'].strftime('%Y-%m-%d')
        
        return {
            "data": result,
            "summary": {
                "total_records": len(result),
                "date_range": {
                    "start": df['date'].min().strftime('%Y-%m-%d') if len(df) > 0 else None,
                    "end": df['date'].max().strftime('%Y-%m-%d') if len(df) > 0 else None
                },
                "services": sorted(df['service'].unique().tolist()) if len(df) > 0 else [],
                "total_amount": round(df['amount'].sum(), 2) if len(df) > 0 else 0,
                "average_amount": round(df['amount'].mean(), 2) if len(df) > 0 else 0
            },
            "filters_applied": {
                "service": service,
                "start_date": start_date.isoformat() if start_date else None,
                "end_date": end_date.isoformat() if end_date else None,
                "min_amount": min_amount,
                "max_amount": max_amount,
                "sort_by": sort_by,
                "sort_order": sort_order,
                "limit": limit
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing cleaned cost data: {str(e)}")

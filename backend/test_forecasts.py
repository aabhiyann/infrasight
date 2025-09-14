#!/usr/bin/env python3
"""
Test script to demonstrate the new advanced forecasting functionality.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.file_loader import load_mock_cost_data
from ml_utils import forecast_costs, preprocess_cost_data

def test_forecasting():
    """Test the new forecasting functionality."""
    
    print("Testing Advanced AWS Cost Forecasting")
    print("=" * 50)
    
    # Load mock data (AWS Cost Explorer format)
    print("Loading mock cost data...")
    raw_data = load_mock_cost_data()
    
    # Convert to flat format for forecasting
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
    
    print(f"   Loaded {len(data)} cost records")
    
    # Show available services
    services = list(set(record.get('service') for record in data if record.get('service')))
    print(f"   Available services: {', '.join(services)}")
    print()
    
    # Test advanced forecasting
    print("Advanced Forecasting (7 days)")
    print("-" * 30)
    
    advanced_result = forecast_costs(data, n_days=7)
    
    print(f"Summary:")
    summary = advanced_result['summary']
    print(f"   Total forecast cost: ${summary['total_forecast_cost']}")
    print(f"   Average daily cost: ${summary['average_daily_cost']}")
    print(f"   Services forecasted: {summary['services_forecasted']}")
    print(f"   Services: {', '.join(summary['services'])}")
    print()
    
    # Show service-level forecasts
    print("Service-Level Forecasts:")
    for service, predictions in advanced_result['service_forecasts'].items():
        print(f"\n   {service}:")
        for pred in predictions[:3]:  # Show first 3 days
            print(f"     {pred['date']}: ${pred['predicted_cost']:.2f} "
                  f"(±${pred['confidence_interval']:.2f})")
        if len(predictions) > 3:
            print(f"     ... and {len(predictions) - 3} more days")
    
    print()
    
    # Show total forecast with confidence intervals
    print("Total Cost Forecast (with confidence intervals):")
    for pred in advanced_result['total_forecast'][:5]:  # Show first 5 days
        print(f"   {pred['date']}: ${pred['predicted_cost']:.2f} "
              f"(${pred['confidence_lower']:.2f} - ${pred['confidence_upper']:.2f})")
    
    if len(advanced_result['total_forecast']) > 5:
        print(f"   ... and {len(advanced_result['total_forecast']) - 5} more days")
    
    print()
    
    # Show total forecast
    print("Total Forecast Summary:")
    print("-" * 30)
    
    total_cost = sum(pred['predicted_cost'] for pred in advanced_result['total_forecast'])
    print(f"   Total forecast cost: ${total_cost:.2f}")
    print(f"   Average daily cost: ${total_cost/7:.2f}")
    
    print()
    print("Forecasting test completed!")
    print()
    print("Key Improvements:")
    print("   - Service-level predictions")
    print("   - Confidence intervals")
    print("   - Basic seasonality (weekend detection)")
    print("   - Better error handling")
    print("   - Comprehensive summary statistics")

if __name__ == "__main__":
    test_forecasting()

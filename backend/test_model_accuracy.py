#!/usr/bin/env python3
"""
Test script to evaluate if linear regression is accurate enough for our use case.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.file_loader import load_mock_cost_data
import pandas as pd
import numpy as np

def test_model_accuracy():
    """Test how accurate our linear regression model is."""
    
    print("-- Testing Linear Regression Accuracy --")
    print("=" * 50)
    
    # Load data
    raw_data = load_mock_cost_data()
    
    # Convert to flat format
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
    
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    
    print(f"-- Data Summary: --")
    print(f"Total records: {len(data)}")
    print(f"Date range: {df['date'].min()} to {df['date'].max()}")
    print(f"Services: {', '.join(df['service'].unique())}")
    print()
    
    # Test accuracy for each service
    services = df['service'].unique()
    
    for service in services:
        print(f"Testing {service}:")
        
        service_data = df[df['service'] == service].copy()
        service_data = service_data.groupby('date')['amount'].sum().reset_index()
        service_data = service_data.sort_values('date')
        
        if len(service_data) < 4:
            print(f" Not enough data (need at least 4 days)")
            continue
        
        # Use first 80% for training, last 20% for testing
        split_point = int(len(service_data) * 0.8)
        train_data = service_data[:split_point]
        test_data = service_data[split_point:]
        
        # Create features
        train_data['day_number'] = (train_data['date'] - train_data['date'].min()).dt.days
        train_data['is_weekend'] = (train_data['date'].dt.dayofweek >= 5).astype(int)
        
        # Train simple linear regression
        from sklearn.linear_model import LinearRegression
        from sklearn.metrics import mean_absolute_error, mean_squared_error
        
        X_train = train_data[['day_number', 'is_weekend']]
        y_train = train_data['amount']
        
        model = LinearRegression()
        model.fit(X_train, y_train)
        
        # Test on remaining data
        test_data['day_number'] = (test_data['date'] - train_data['date'].min()).dt.days
        test_data['is_weekend'] = (test_data['date'].dt.dayofweek >= 5).astype(int)
        
        X_test = test_data[['day_number', 'is_weekend']]
        y_test = test_data['amount']
        
        predictions = model.predict(X_test)
        
        # Calculate accuracy metrics
        mae = mean_absolute_error(y_test, predictions)
        mse = mean_squared_error(y_test, predictions)
        rmse = np.sqrt(mse)
        
        # Calculate percentage error
        avg_actual = y_test.mean()
        percentage_error = (mae / avg_actual) * 100 if avg_actual > 0 else 0
        
        print(f"   Mean Absolute Error: ${mae:.3f}")
        print(f"   Root Mean Square Error: ${rmse:.3f}")
        print(f"   Percentage Error: {percentage_error:.1f}%")
        
        # Determine if accuracy is good enough
        if percentage_error < 10:
            print(f"   Excellent accuracy (< 10% error)")
        elif percentage_error < 20:
            print(f"   Good accuracy (< 20% error)")
        elif percentage_error < 30:
            print(f"   Acceptable accuracy (< 30% error)")
        else:
            print(f"   Poor accuracy (> 30% error) - consider upgrading model")
        
        print()
    
    print("Overall Assessment:")
    print("   If most services show < 20% error, linear regression is good enough!")
    print("   If many services show > 30% error, consider upgrading to ARIMA or Prophet.")
    print()
    print("Remember: For 7-day forecasts, even 20% error might be acceptable")
    print("   since it's better than no prediction at all!")

if __name__ == "__main__":
    test_model_accuracy()

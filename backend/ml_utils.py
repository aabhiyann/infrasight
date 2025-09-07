import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from typing import List, Dict, Tuple
from datetime import timedelta
import warnings
warnings.filterwarnings('ignore')
from utils.file_loader import load_cost_data


# Format raw cost data into a Pandas DataFrame
def preprocess_cost_data(raw_data: Dict) -> pd.DataFrame:
    records = []

    # Flatten the nested AWS cost format into rows
    for day in raw_data.get("ResultsByTime", []):
        date_str = day["TimePeriod"]["Start"]
        for group in day["Groups"]:
            service = group["Keys"][0]
            amount = float(group["Metrics"]["UnblendedCost"]["Amount"])
            records.append({
                "date": date_str,
                "service": service,
                "amount": amount
            })

    df = pd.DataFrame(records)

    # Pivot: rows = dates, columns = services, values = amount
    pivot_df = df.pivot(index="date", columns="service", values="amount").fillna(0)
    return pivot_df

# Perform clustering
def cluster_costs(raw_data: Dict, n_clusters: int = 3) -> Dict:
    pivot_df = preprocess_cost_data(raw_data)

    # Use KMeans clustering on the cost vectors
    model = KMeans(n_clusters=n_clusters, random_state=42)
    model.fit(pivot_df.T)  # transpose: services as rows

    labels = model.labels_

    # Map cluster IDs to services
    cluster_map = {}
    for service, label in zip(pivot_df.columns, labels):
        cluster_map.setdefault(f"Cluster {label}", []).append(service)

    return {
        "clusters": cluster_map,
        "service_vectors": pivot_df.T.to_dict()
    }

# Detecting anomalies using z-score
def detect_anomalies(raw_data: Dict, z_threshold: float = 2.0) -> Dict[str, List[Dict]]:
    # TODO: Add a check to ensure the raw_data is not empty
    """
    For each AWS service, detect days with anomalous cost behavior.
    Flags both high and low anomalies using z-score method.

    Returns:
        A dictionary: service_name -> list of anomaly records (date, amount, z-score)
    """
    pivot_df = preprocess_cost_data(raw_data) # rows = dates, columns = services

    anomalies = {}

    for service in pivot_df.columns:
        values = pivot_df[service]
        mean = values.mean()
        std = values.std()

        # Avoid division by zero (eg. if all values are the same)
        if std == 0 :
            continue

        z_scores = (values - mean) / std

        # Print the z-scores for each service (todo: remove this later{just for checking})
        # print("\nSample Z-Scores Table:\n")
        # print(f"\nZ-Scores for {service}:")
        # for date, z in z_scores.items():
        #    print(f"{date}: z-score = {z:.2f}")
        # print()  


        # Find anomalies where |z| > threshold
        for date, z in z_scores.items():
            if abs(z) >= z_threshold:
                anomalies.setdefault(service, []).append({
                    "date": date,
                    "amount": float(pivot_df.loc[date, service]),
                    "z_score": round(float(z), 2)
                })

    return anomalies


def forecast_costs(data: List[Dict], n_days: int = 7) -> Dict[str, List[Dict]]:
    """
    AWS cost forecasting with service-level predictions and confidence intervals.
    
    Args:
        data: List of cost records (from mock file or real source)
        n_days: How many future days to forecast (default = 7)
        
    Returns:
        Dictionary with:
        - service_forecasts: Per-service predictions with confidence intervals
        - total_forecast: Aggregated total cost predictions
        - summary: Forecast summary statistics
    """
    
    # Convert raw data to DataFrame
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    
    # Get unique services
    services = df['service'].unique()
    
    service_forecasts = {}
    total_predictions = []
    
    # Forecast each service individually
    for service in services:
        service_data = df[df['service'] == service].copy()
        
        # Group by date and sum (in case multiple records per day)
        daily_costs = service_data.groupby('date')['amount'].sum().reset_index()
        daily_costs = daily_costs.sort_values('date')
        
        # Skip if not enough data points
        if len(daily_costs) < 3:
            continue
            
        # Create features: day number and basic seasonality
        daily_costs['day_number'] = (daily_costs['date'] - daily_costs['date'].min()).dt.days
        daily_costs['day_of_week'] = daily_costs['date'].dt.dayofweek  # 0=Monday, 6=Sunday
        daily_costs['is_weekend'] = (daily_costs['day_of_week'] >= 5).astype(int)
        
        # Prepare features
        X = daily_costs[['day_number', 'is_weekend']]
        y = daily_costs['amount']
        
        # Train model
        model = LinearRegression()
        model.fit(X, y)
        
        # Calculate confidence intervals using cross-validation
        predictions = model.predict(X)
        mse = mean_squared_error(y, predictions)
        std_error = np.sqrt(mse)
        
        # Generate future predictions
        last_date = daily_costs['date'].max()
        last_day = daily_costs['day_number'].max()
        
        future_predictions = []
        for i in range(1, n_days + 1):
            future_date = last_date + timedelta(days=i)
            future_day = last_day + i
            future_is_weekend = 1 if future_date.weekday() >= 5 else 0
            
            # Predict
            pred = model.predict([[future_day, future_is_weekend]])[0]
            
            # Confidence interval (±1.96 * std_error for 95% confidence)
            confidence_interval = 1.96 * std_error
            
            future_predictions.append({
                "date": future_date.strftime("%Y-%m-%d"),
                "predicted_cost": round(pred, 2),
                "confidence_lower": round(max(0, pred - confidence_interval), 2),
                "confidence_upper": round(pred + confidence_interval, 2),
                "confidence_interval": round(confidence_interval, 2)
            })
        
        service_forecasts[service] = future_predictions
    
    # Calculate total forecast by summing all services
    if service_forecasts:
        # Get all future dates
        all_dates = set()
        for service_preds in service_forecasts.values():
            for pred in service_preds:
                all_dates.add(pred['date'])
        
        all_dates = sorted(list(all_dates))
        
        for date in all_dates:
            total_pred = 0
            total_lower = 0
            total_upper = 0
            
            for service_preds in service_forecasts.values():
                for pred in service_preds:
                    if pred['date'] == date:
                        total_pred += pred['predicted_cost']
                        total_lower += pred['confidence_lower']
                        total_upper += pred['confidence_upper']
                        break
            
            total_predictions.append({
                "date": date,
                "predicted_cost": round(total_pred, 2),
                "confidence_lower": round(total_lower, 2),
                "confidence_upper": round(total_upper, 2),
                "confidence_interval": round((total_upper - total_lower) / 2, 2)
            })
    
    # Calculate summary statistics
    if total_predictions:
        total_forecast_cost = sum(pred['predicted_cost'] for pred in total_predictions)
        avg_daily_cost = total_forecast_cost / len(total_predictions)
        
        summary = {
            "total_forecast_cost": round(total_forecast_cost, 2),
            "average_daily_cost": round(avg_daily_cost, 2),
            "forecast_period_days": n_days,
            "services_forecasted": len(service_forecasts),
            "services": list(service_forecasts.keys())
        }
    else:
        summary = {
            "total_forecast_cost": 0,
            "average_daily_cost": 0,
            "forecast_period_days": n_days,
            "services_forecasted": 0,
            "services": []
        }
    
    return {
        "service_forecasts": service_forecasts,
        "total_forecast": total_predictions,
        "summary": summary
    }

def generate_recommendations(max_budget: float = None, n_clusters: int = 3) -> dict:
    raw_data = load_cost_data()
    df = pd.DataFrame(raw_data)

    # Pivot Data (rows = date, columns = service, values = cost) 
    pivot = df.pivot(index="date", columns="service", values="amount").fillna(0)

    # Compute total cost per service
    total_costs = pivot.sum().sort_values(ascending=False)

    # Anomaly Detection
    z_scores = (total_costs - total_costs.mean()) / total_costs.std()
    anomalies = z_scores[z_scores > 1.4].index.tolist()

    # Clustering
    service_features = pivot.T  # rows = service, cols = days
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(service_features)

    # Build recommendations 
    recommendations = []
    for i, service in enumerate(service_features.index):
        service_total = total_costs[service]
        is_anomalous = service in anomalies
        cluster = int(cluster_labels[i])

        reasons = []
        if is_anomalous:
            reasons.append("cost spike detected")
        if max_budget and service_total > max_budget:
            reasons.append(f"cost exceeds budget, which is: (${max_budget})")
        if not reasons:
            reasons.append("within normal usage")

        recommendations.append({
            "service": service,
            "total_cost": round(service_total, 2),
            "cluster": cluster,
            "anomaly": is_anomalous,
            "status": "Action Recommended" if is_anomalous or (max_budget and service_total > max_budget) else "OK! (everything is fine)",
            "insights": reasons
        })

    return {
        "recommendations": sorted(recommendations, key=lambda r: -r["total_cost"]),
        "total_services": len(recommendations),
        "status": "success"
    }
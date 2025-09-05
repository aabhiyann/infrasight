import pandas as pd
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
from typing import List, Dict
from sklearn.linear_model import LinearRegression


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


def forecast_costs(data: List[Dict], n_days: int = 7) -> List[Dict[str, float]]:
    """
    Forecast AWS cost for the next n_days using linear regression.
    
    Args:
        data: List of cost records (from mock file or real source)
        n_days: How many future days to forecast (default = 7)
        
    Returns:
        List of predicted daily costs, each with:
        - date: str (YYYY-MM-DD)
        - predicted_cost: float
    """
    
    # Convert raw data to DataFrame
    df = pd.DataFrame(data)
    
    # Convert date string to datetime object
    df['date'] = pd.to_datetime(df['date'])

    #Group by date and sum costs (in case multiple services per day)
    daily_totals = df.groupby('date')['amount'].sum().reset_index()

    # Create a "day number" column (0, 1, 2, ...)
    daily_totals['day_number'] = (daily_totals['date'] - daily_totals['date'].min()).dt.days

    # Prepare X and y for regression
    X = daily_totals[['day_number']]  # 2D input for sklearn
    y = daily_totals['amount']        # Target: cost

    # Train linear regression model
    model = LinearRegression()
    model.fit(X, y)

    # Forecast next n_days
    last_day = daily_totals['day_number'].max()
    future_days = list(range(last_day + 1, last_day + 1 + n_days))

    predictions = model.predict([[day] for day in future_days])

    # Build result list with future dates
    last_date = daily_totals['date'].max()
    results = []
    for i, pred in enumerate(predictions):
        forecast_date = last_date + timedelta(days=i+1)
        results.append({
            "date": forecast_date.strftime("%Y-%m-%d"),
            "predicted_cost": round(pred, 2)
        })

    return results





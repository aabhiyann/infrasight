import pandas as pd
from sklearn.cluster import KMeans
from datetime import datetime
from typing import List, Dict

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

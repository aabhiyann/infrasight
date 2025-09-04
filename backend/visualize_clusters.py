import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.cm as cm
import numpy as np
from utils.file_loader import load_mock_cost_data
from ml_utils import detect_anomalies

def plot_anomalies(z_threshold: float = 2.0):
    # Step 1: Load mock AWS cost data
    raw_data = load_mock_cost_data()

    # Step 2: Run anomaly detection using z-scores
    anomalies = detect_anomalies(raw_data, z_threshold=z_threshold)

    # Step 3: Flatten anomaly data into a single list for plotting
    records = []
    for service, points in anomalies.items():
        for point in points:
            records.append({
                "service": service,
                "date": point["date"],
                "amount": point["amount"],
                "z_score": point["z_score"]
            })

    if not records:
        print("✅ No anomalies detected at z-threshold:", z_threshold)
        return

    # Step 4: Convert to DataFrame
    df = pd.DataFrame(records)
    df["date"] = pd.to_datetime(df["date"])

    # Step 5: Assign colors by service
    services = df["service"].unique()
    cmap = plt.get_cmap("tab10")
    color_map = {svc: cmap(i % 10) for i, svc in enumerate(services)}

    # Step 6: Plot anomaly points
    plt.figure(figsize=(12, 6))
    for service in services:
        svc_df = df[df["service"] == service]
        plt.scatter(
            svc_df["date"],
            svc_df["amount"],
            label=service,
            color=color_map[service],
            s=np.abs(svc_df["z_score"]) * 30 + 30,
            alpha=0.7,
            edgecolors="black"
        )

    plt.title(f"AWS Cost Anomalies (z ≥ {z_threshold})")
    plt.xlabel("Date")
    plt.ylabel("Cost ($)")
    plt.xticks(rotation=45)
    plt.grid(True)
    plt.legend(loc="upper left", bbox_to_anchor=(1.01, 1))
    plt.tight_layout()
    plt.savefig("anomaly_plot.png", dpi=300)
    plt.show()

# Run directly
if __name__ == "__main__":
    plot_anomalies(z_threshold=2.0)

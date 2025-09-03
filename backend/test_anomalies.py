from utils.file_loader import load_mock_cost_data
from ml_utils import detect_anomalies

# Step 1: Load AWS cost data
data = load_mock_cost_data()

# Step 2: Run anomaly detection
anomalies = detect_anomalies(data, z_threshold=2.0)

# Step 3: Print the results
print("\n🚨 Detected Anomalies:")
if not anomalies:
    print("✅ No anomalies found in the dataset!")
else:
    for service, records in anomalies.items():
        print(f"\n🔍 {service}")
        for record in records:
            print(f"  🗓️ {record['date']} | 💰 ${record['amount']} | z-score: {record['z_score']}")

from utils.file_loader import load_mock_cost_data
from ml_utils import detect_anomalies

# Load mock data
data = load_mock_cost_data()

# Run anomaly detection
anomalies = detect_anomalies(data, z_threshold=2.0)

# Print results
print("\n🚨 Detected Anomalies:")
for service, records in anomalies.items():
    print(f"\n🔍 {service}")
    for record in records:
        print(f"  🗓️ {record['date']} | 💰 ${record['amount']} | z-score: {record['z_score']}")

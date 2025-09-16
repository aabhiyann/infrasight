import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.file_loader import load_mock_cost_data
from ml_utils import detect_anomalies

# Load AWS cost data
data = load_mock_cost_data()

# Run anomaly detection
anomalies = detect_anomalies(data, z_threshold=2.0)

# Step 3: Print the results
print("\nDetected Anomalies:")
if not anomalies:
    print("No anomalies found in the dataset!")
else:
    for service, records in anomalies.items():
        print(f"\n {service}")
        for record in records:
            print(f"  {record['date']} |  ${record['amount']} | z-score: {record['z_score']}")

import requests
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime

# === CONFIG ===
API_URL = "http://localhost:8000/api/forecast"  # Main forecasting endpoint

N_DAYS = 7
SERVICE = None  # Or set to a specific service like "AmazonEC2"

# === FETCH DATA ===
params = {"n_days": N_DAYS}
if SERVICE:
    params["service"] = SERVICE

response = requests.get(API_URL, params=params)

if response.status_code != 200:
    print(f"Error fetching forecast: {response.status_code}")
    print(response.json())
    exit()

data = response.json()
print("DEBUG: Full API Response:")
print(data)

forecast = data["total_forecast"]

# === PARSE DATES AND VALUES ===
dates = [datetime.strptime(point["date"], "%Y-%m-%d") for point in forecast]
predicted = [point["predicted_cost"] for point in forecast]
lower = [point["confidence_lower"] for point in forecast]
upper = [point["confidence_upper"] for point in forecast]

# === PLOT ===
plt.figure(figsize=(10, 6))
plt.plot(dates, predicted, label="Predicted Cost", color="blue", marker="o")
plt.fill_between(dates, lower, upper, color="blue", alpha=0.2, label="95% Confidence Interval")

plt.title("Forecasted AWS Costs (Next 7 Days)")
plt.xlabel("Date")
plt.ylabel("Cost ($)")
plt.grid(True)
plt.legend()
plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
plt.gcf().autofmt_xdate()

# === SAVE ===
plt.tight_layout()
plt.savefig("forecast_plot.png")
print("Forecast plot saved as forecast_plot.png")

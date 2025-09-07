import requests
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime
import numpy as np

# === CONFIG ===
API_URL = "http://localhost:8000/api/forecast"
SERVICES_URL = "http://localhost:8000/api/forecast/services"

N_DAYS = 7
SERVICE = None  # Set to specific service name or None for all services

# === FETCH AVAILABLE SERVICES ===
print("Fetching available services...")
services_response = requests.get(SERVICES_URL)
if services_response.status_code != 200:
    print(f"Error fetching services: {services_response.status_code}")
    exit()

available_services = services_response.json()["services"]
print(f"Available services: {available_services}")

# === FETCH FORECAST DATA ===
print(f"Fetching forecast data for {N_DAYS} days...")
params = {"n_days": N_DAYS}
if SERVICE:
    params["service"] = SERVICE

response = requests.get(API_URL, params=params)

if response.status_code != 200:
    print(f"Error fetching forecast: {response.status_code}")
    print(response.json())
    exit()

data = response.json()

# === PARSE DATA ===
service_forecasts = data.get("service_forecasts", {})
total_forecast = data.get("total_forecast", [])
summary = data.get("summary", {})

print(f"Forecast data received:")
print(f"   - Services forecasted: {summary.get('services_forecasted', 0)}")
print(f"   - Total forecast cost: ${summary.get('total_forecast_cost', 0):.2f}")
print(f"   - Average daily cost: ${summary.get('average_daily_cost', 0):.2f}")

# === CREATE VISUALIZATION ===
if SERVICE:
    # Single service visualization
    if SERVICE in service_forecasts:
        forecast_data = service_forecasts[SERVICE]
        
        dates = [datetime.strptime(point["date"], "%Y-%m-%d") for point in forecast_data]
        predicted = [point["predicted_cost"] for point in forecast_data]
        lower = [point["confidence_lower"] for point in forecast_data]
        upper = [point["confidence_upper"] for point in forecast_data]
        
        plt.figure(figsize=(12, 6))
        plt.plot(dates, predicted, label=f"{SERVICE} Predicted Cost", color="blue", marker="o", linewidth=2)
        plt.fill_between(dates, lower, upper, color="blue", alpha=0.2, label="95% Confidence Interval")
        
        plt.title(f"{SERVICE} Cost Forecast (Next {N_DAYS} Days)", fontsize=14, fontweight='bold')
        plt.xlabel("Date", fontsize=12)
        plt.ylabel("Cost ($)", fontsize=12)
        plt.grid(True, alpha=0.3)
        plt.legend()
        plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
        plt.gcf().autofmt_xdate()
        
        # Add summary text
        total_cost = sum(predicted)
        avg_cost = total_cost / len(predicted)
        plt.text(0.02, 0.98, f"Total Forecast: ${total_cost:.2f}\nAvg Daily: ${avg_cost:.2f}", 
                transform=plt.gca().transAxes, verticalalignment='top',
                bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))
        
        plt.tight_layout()
        plt.savefig(f"forecast_{SERVICE.lower().replace(' ', '_')}.png", dpi=300, bbox_inches='tight')
        print(f"{SERVICE} forecast plot saved as forecast_{SERVICE.lower().replace(' ', '_')}.png")
        
    else:
        print(f"Service '{SERVICE}' not found in forecast data")
        
else:
    # Multi-service visualization
    if not service_forecasts:
        print("No service forecast data available")
        exit()
    
    # Create subplots for each service
    n_services = len(service_forecasts)
    n_cols = min(3, n_services)  # Max 3 columns
    n_rows = (n_services + n_cols - 1) // n_cols
    
    fig, axes = plt.subplots(n_rows, n_cols, figsize=(5*n_cols, 4*n_rows))
    if n_services == 1:
        axes = [axes]
    elif n_rows == 1:
        axes = axes.reshape(1, -1)
    
    colors = plt.cm.Set3(np.linspace(0, 1, n_services))
    
    for idx, (service, forecast_data) in enumerate(service_forecasts.items()):
        row = idx // n_cols
        col = idx % n_cols
        ax = axes[row, col] if n_rows > 1 else axes[col]
        
        dates = [datetime.strptime(point["date"], "%Y-%m-%d") for point in forecast_data]
        predicted = [point["predicted_cost"] for point in forecast_data]
        lower = [point["confidence_lower"] for point in forecast_data]
        upper = [point["confidence_upper"] for point in forecast_data]
        
        ax.plot(dates, predicted, label=f"{service} Predicted", color=colors[idx], marker="o", linewidth=2)
        ax.fill_between(dates, lower, upper, color=colors[idx], alpha=0.2, label="95% CI")
        
        ax.set_title(f"{service}", fontweight='bold')
        ax.set_xlabel("Date")
        ax.set_ylabel("Cost ($)")
        ax.grid(True, alpha=0.3)
        ax.xaxis.set_major_formatter(mdates.DateFormatter('%m-%d'))
        ax.tick_params(axis='x', rotation=45)
        
        # Add summary
        total_cost = sum(predicted)
        avg_cost = total_cost / len(predicted)
        ax.text(0.02, 0.98, f"Total: ${total_cost:.1f}\nAvg: ${avg_cost:.1f}", 
                transform=ax.transAxes, verticalalignment='top', fontsize=8,
                bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
    
    # Hide empty subplots
    for idx in range(n_services, n_rows * n_cols):
        row = idx // n_cols
        col = idx % n_cols
        if n_rows > 1:
            axes[row, col].set_visible(False)
        else:
            axes[col].set_visible(False)
    
    plt.suptitle(f"AWS Service Cost Forecasts (Next {N_DAYS} Days)", fontsize=16, fontweight='bold')
    plt.tight_layout()
    plt.savefig("service_forecasts.png", dpi=300, bbox_inches='tight')
    print("Multi-service forecast plot saved as service_forecasts.png")
    
    # Also create a total forecast plot
    if total_forecast:
        plt.figure(figsize=(12, 6))
        dates = [datetime.strptime(point["date"], "%Y-%m-%d") for point in total_forecast]
        predicted = [point["predicted_cost"] for point in total_forecast]
        lower = [point["confidence_lower"] for point in total_forecast]
        upper = [point["confidence_upper"] for point in total_forecast]
        
        plt.plot(dates, predicted, label="Total Predicted Cost", color="red", marker="o", linewidth=3)
        plt.fill_between(dates, lower, upper, color="red", alpha=0.2, label="95% Confidence Interval")
        
        plt.title(f"Total AWS Cost Forecast (Next {N_DAYS} Days)", fontsize=14, fontweight='bold')
        plt.xlabel("Date", fontsize=12)
        plt.ylabel("Cost ($)", fontsize=12)
        plt.grid(True, alpha=0.3)
        plt.legend()
        plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
        plt.gcf().autofmt_xdate()
        
        # Add summary text
        total_cost = sum(predicted)
        avg_cost = total_cost / len(predicted)
        plt.text(0.02, 0.98, f"Total Forecast: ${total_cost:.2f}\nAvg Daily: ${avg_cost:.2f}\nServices: {summary.get('services_forecasted', 0)}", 
                transform=plt.gca().transAxes, verticalalignment='top',
                bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.8))
        
        plt.tight_layout()
        plt.savefig("total_forecast.png", dpi=300, bbox_inches='tight')
        print("Total forecast plot saved as total_forecast.png")

print("\nVisualization complete!")

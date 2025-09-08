import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from datetime import datetime, timedelta

from utils.file_loader import load_mock_cost_data_flat

plt.style.use('seaborn-v0_8')  # Modern, clean look
sns.set_palette("husl")  # Colorful but professional palette

print("AWS Cost Data Visualization - Professor Mode")
print("=" * 60)

# 📊 Step 1: Load the cleaned flat AWS cost data
print("\nStep 1: Loading Cleaned Data")
print("-" * 30)
df = load_mock_cost_data_flat()

# Ensure 'date' column is in datetime format for plotting
df['date'] = pd.to_datetime(df['date'])

print(f"Loaded {len(df)} cost records")
print(f"ate range: {df['date'].min().strftime('%Y-%m-%d')} to {df['date'].max().strftime('%Y-%m-%d')}")
print(f"Services: {', '.join(df['service'].unique())}")
print(f"Total cost: ${df['amount'].sum():.2f}")

# Create output folder for visualizations
output_dir = "visualizations"
os.makedirs(output_dir, exist_ok=True)  # won't raise error if folder exists
print(f"Output directory: {output_dir}/")


# 📊 Step 2: Create Pivot Table (Cost per Service per Day)
print("\nStep 2: Creating Pivot Table")
print("-" * 30)


# This gives us a matrix: rows = dates, columns = AWS services, values = $ amount
pivot_df = df.pivot_table(
    index="date",           # What goes on the rows (y-axis)
    columns="service",      # What goes on the columns (x-axis)
    values="amount",        # What values to put in the cells
    aggfunc="sum",          # How to combine multiple values (sum if same service appears multiple times per day)
    fill_value=0            # What to put in empty cells (0 for no cost)
)

print(f"Pivot table shape: {pivot_df.shape} (rows=dates, columns=services)")
print(f"Services in pivot: {list(pivot_df.columns)}")

# Save to CSV for external inspection or debugging
pivot_csv_path = os.path.join(output_dir, "pivot_table.csv")
pivot_df.to_csv(pivot_csv_path)
print(f"Saved pivot table to: {pivot_csv_path}")


# 📈 Step 3: Time Series Line Plot (Total Cost Over Time)
print("\nStep 3: Creating Time Series Plot")
print("-" * 30)

# Aggregate all services to see total daily AWS spend
total_cost_by_day = df.groupby("date")["amount"].sum()
print(f"Calculated daily totals for {len(total_cost_by_day)} days")
print(f"Daily cost range: ${total_cost_by_day.min():.2f} - ${total_cost_by_day.max():.2f}")

plt.figure(figsize=(12, 6))
total_cost_by_day.plot(
    marker='o',           # Add dots at each data point
    color='steelblue',    # Professional blue color
    linewidth=2,          # Thicker line for visibility
    markersize=6          # Slightly larger dots
)

plt.title("Total AWS Cost Over Time", fontsize=16, fontweight='bold', pad=20)
plt.xlabel("Date", fontsize=12)
plt.ylabel("Total Cost ($)", fontsize=12)
plt.grid(True, linestyle='--', alpha=0.6)

# Add some statistics as text
avg_cost = total_cost_by_day.mean()
plt.axhline(y=avg_cost, color='red', linestyle=':', alpha=0.7, label=f'Average: ${avg_cost:.2f}')
plt.legend()

plt.tight_layout()

# Save plot
line_plot_path = os.path.join(output_dir, "total_cost_over_time.png")
plt.savefig(line_plot_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Saved time series plot to: {line_plot_path}")


# 🔥 Step 4: Heatmap (Service Usage Over Time)
print("\nStep 4: Creating Heatmap")
print("-" * 30)

plt.figure(figsize=(14, 8))

# Transpose the pivot table: rows=services, columns=dates
heatmap_data = pivot_df.T
print(f"Heatmap data shape: {heatmap_data.shape} (services x dates)")

sns.heatmap(
    heatmap_data,                       # Our data matrix
    cmap="YlGnBu",                      # Yellow-Green-Blue color scale (professional)
    linewidths=0.5,                     # Thin lines between cells
    linecolor='white',                  # White lines for clean separation
    cbar_kws={'label': 'Cost ($)'},     # Color bar label
    annot=False                          # Don't show numbers in cells (too cluttered)
)

plt.title("AWS Service Cost Heatmap (per Day)", fontsize=16, fontweight='bold', pad=20)
plt.xlabel("Date", fontsize=12)
plt.ylabel("Service", fontsize=12)
plt.xticks(rotation=45, ha='right')     # Rotate date labels for readability
plt.tight_layout()

# Save heatmap
heatmap_path = os.path.join(output_dir, "service_cost_heatmap.png")
plt.savefig(heatmap_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Saved heatmap to: {heatmap_path}")

# 📊 Step 5: Service Comparison Bar Chart
print("\nStep 5: Creating Service Comparison")
print("-" * 30)


# Calculate total cost per service
service_totals = df.groupby('service')['amount'].sum().sort_values(ascending=False)
print(f"Calculated totals for {len(service_totals)} services")

plt.figure(figsize=(10, 6))
colors = plt.cm.Set3(np.linspace(0, 1, len(service_totals)))  # Colorful bars
bars = plt.bar(range(len(service_totals)), service_totals.values, color=colors)

plt.title("Total Cost by AWS Service", fontsize=16, fontweight='bold', pad=20)
plt.xlabel("Service", fontsize=12)
plt.ylabel("Total Cost ($)", fontsize=12)
plt.xticks(range(len(service_totals)), service_totals.index, rotation=45, ha='right')

# Add value labels on top of bars
for i, (bar, value) in enumerate(zip(bars, service_totals.values)):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(service_totals)*0.01,
             f'${value:.2f}', ha='center', va='bottom', fontweight='bold')

plt.tight_layout()

# Save bar chart
bar_chart_path = os.path.join(output_dir, "service_comparison.png")
plt.savefig(bar_chart_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Saved service comparison to: {bar_chart_path}")

# 📈 Step 6: Multi-Service Time Series
print("\nStep 6: Creating Multi-Service Time Series")
print("-" * 30)

plt.figure(figsize=(14, 8))

# Plot each service as a separate line
for service in pivot_df.columns:
    plt.plot(pivot_df.index, pivot_df[service], 
             marker='o', linewidth=2, label=service, markersize=4)

plt.title("AWS Service Costs Over Time", fontsize=16, fontweight='bold', pad=20)
plt.xlabel("Date", fontsize=12)
plt.ylabel("Cost ($)", fontsize=12)
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')  # Legend outside plot
plt.grid(True, linestyle='--', alpha=0.6)
plt.xticks(rotation=45)

plt.tight_layout()

# Save multi-line plot
multiline_path = os.path.join(output_dir, "multi_service_timeline.png")
plt.savefig(multiline_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Saved multi-service timeline to: {multiline_path}")


print("\nVISUALIZATION COMPLETE!")
print("=" * 60)
print("Generated Files:")
print(f"   Pivot table (CSV):     {pivot_csv_path}")
print(f"   Time series plot:      {line_plot_path}")
print(f"   Service heatmap:       {heatmap_path}")
print(f"   Service comparison:    {bar_chart_path}")
print(f"   Multi-service timeline: {multiline_path}")


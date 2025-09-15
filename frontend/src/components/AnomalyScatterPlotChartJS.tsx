import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface AnomalyPoint {
  date: string;
  service: string;
  amount: number;
  z_score: number;
}

interface AnomalyScatterPlotProps {
  anomalies: AnomalyPoint[];
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

function getSeverityLabel(z: number): string {
  if (z >= 3) return "High";
  if (z >= 2.5) return "Medium-High";
  if (z >= 2) return "Medium";
  return "Low";
}

const AnomalyScatterPlotChartJS = ({ anomalies }: AnomalyScatterPlotProps) => {
  const [viewMode, setViewMode] = useState<"cost" | "service">("cost");

  // Debug logging
  console.log("AnomalyScatterPlotChartJS - anomalies:", anomalies);
  console.log(
    "AnomalyScatterPlotChartJS - anomalies length:",
    anomalies.length
  );

  // Handle empty data
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="mt-2">
        <div className="chart-header">
          <h3>Detected Anomalies</h3>
        </div>
        <div
          style={{ height: 400, width: "100%" }}
          className="d-flex items-center justify-center"
        >
          <p>No anomaly data available</p>
        </div>
      </div>
    );
  }

  const formattedData = anomalies.map((a) => ({
    ...a,
    dateLabel: formatDate(a.date),
    serviceLabel:
      a.service.length > 12 ? a.service.slice(0, 12) + "..." : a.service,
  }));

  // Categorize anomalies by severity for different colors
  const highSeverityData = formattedData
    .filter((item) => item.z_score >= 3)
    .map((item) => ({
      x: viewMode === "cost" ? item.date : item.date,
      y: viewMode === "cost" ? item.amount : item.serviceLabel,
      z_score: item.z_score,
      service: item.service,
      amount: item.amount,
      dateLabel: item.dateLabel,
    }));

  const mediumHighData = formattedData
    .filter((item) => item.z_score >= 2.5 && item.z_score < 3)
    .map((item) => ({
      x: viewMode === "cost" ? item.date : item.date,
      y: viewMode === "cost" ? item.amount : item.serviceLabel,
      z_score: item.z_score,
      service: item.service,
      amount: item.amount,
      dateLabel: item.dateLabel,
    }));

  const mediumData = formattedData
    .filter((item) => item.z_score >= 2 && item.z_score < 2.5)
    .map((item) => ({
      x: viewMode === "cost" ? item.date : item.date,
      y: viewMode === "cost" ? item.amount : item.serviceLabel,
      z_score: item.z_score,
      service: item.service,
      amount: item.amount,
      dateLabel: item.dateLabel,
    }));

  const lowData = formattedData
    .filter((item) => item.z_score < 2)
    .map((item) => ({
      x: viewMode === "cost" ? item.date : item.date,
      y: viewMode === "cost" ? item.amount : item.serviceLabel,
      z_score: item.z_score,
      service: item.service,
      amount: item.amount,
      dateLabel: item.dateLabel,
    }));

  const chartData = {
    datasets: [
      {
        label: "High Severity (Z ≥ 3.0)",
        data: highSeverityData,
        backgroundColor: "var(--color-danger)",
        borderColor: "var(--color-danger)",
        pointRadius: 8,
        pointHoverRadius: 10,
      },
      {
        label: "Medium-High Severity (2.5 ≤ Z < 3.0)",
        data: mediumHighData,
        backgroundColor: "var(--color-warning)",
        borderColor: "var(--color-warning)",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Medium Severity (2.0 ≤ Z < 2.5)",
        data: mediumData,
        backgroundColor: "var(--amber-600)",
        borderColor: "var(--amber-600)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Low Severity (Z < 2.0)",
        data: lowData,
        backgroundColor: "var(--brand-400)",
        borderColor: "var(--brand-400)",
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 12,
          },
          color: "var(--color-text)",
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "var(--color-surface)",
        titleColor: "var(--color-text)",
        bodyColor: "var(--color-text)",
        borderColor: "var(--color-border)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function (context: any) {
            const point = context.raw;
            return [
              `Service: ${point.service}`,
              `Date: ${point.dateLabel}`,
              `Cost: $${point.amount.toFixed(2)}`,
              `Z-Score: ${point.z_score.toFixed(2)}`,
              `Severity: ${getSeverityLabel(point.z_score)}`,
            ];
          },
          title: function () {
            return `Anomaly Details`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          displayFormats: {
            day: "MMM DD",
            month: "MMM YYYY",
          },
        },
        title: {
          display: true,
          text: "Date",
          color: "var(--color-text)",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "var(--color-border)",
          drawBorder: false,
        },
        ticks: {
          color: "var(--color-muted)",
          font: {
            size: 11,
          },
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: viewMode === "cost" ? "Cost ($)" : "Service",
          color: "var(--color-text)",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "var(--color-border)",
          drawBorder: false,
        },
        ticks: {
          color: "var(--color-muted)",
          font: {
            size: 11,
          },
          beginAtZero: viewMode === "cost",
          callback: function (value: any) {
            if (viewMode === "cost") {
              return `$${value.toFixed(0)}`;
            }
            return value;
          },
        },
      },
    },
    interaction: {
      intersect: false,
    },
  };

  return (
    <div className="mt-2">
      <div className="chart-header">
        <h3>Detected Anomalies</h3>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "cost" ? "active" : ""}`}
            onClick={() => setViewMode("cost")}
          >
            Cost vs Date
          </button>
          <button
            className={`toggle-btn ${viewMode === "service" ? "active" : ""}`}
            onClick={() => setViewMode("service")}
          >
            Service vs Date
          </button>
        </div>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <Scatter data={chartData} options={options} />
      </div>
      <div className="chart-footer">
        <div className="legend-items">
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "var(--color-danger)" }}
            ></div>
            <span>High (Z ≥ 3.0)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "var(--color-warning)" }}
            ></div>
            <span>Medium-High (Z ≥ 2.5)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "var(--amber-600)" }}
            ></div>
            <span>Medium (Z ≥ 2.0)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "var(--brand-400)" }}
            ></div>
            <span>Low (Z &lt; 2.0)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyScatterPlotChartJS;

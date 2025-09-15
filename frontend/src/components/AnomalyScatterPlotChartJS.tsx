import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import ChartContainer from "./ChartContainer";
import { useThemeAwareChartStyles } from "../hooks/useThemeAwareChartStyles";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
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
  const { chartStyles: themeStyles } = useThemeAwareChartStyles();

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
      x: viewMode === "cost" ? item.dateLabel : item.dateLabel,
      y: viewMode === "cost" ? item.amount : item.serviceLabel,
      z_score: item.z_score,
      service: item.service,
      amount: item.amount,
      dateLabel: item.dateLabel,
    }));

  const mediumHighData = formattedData
    .filter((item) => item.z_score >= 2.5 && item.z_score < 3)
    .map((item) => ({
      x: viewMode === "cost" ? item.dateLabel : item.dateLabel,
      y: viewMode === "cost" ? item.amount : item.serviceLabel,
      z_score: item.z_score,
      service: item.service,
      amount: item.amount,
      dateLabel: item.dateLabel,
    }));

  const mediumData = formattedData
    .filter((item) => item.z_score >= 2 && item.z_score < 2.5)
    .map((item) => ({
      x: viewMode === "cost" ? item.dateLabel : item.dateLabel,
      y: viewMode === "cost" ? item.amount : item.serviceLabel,
      z_score: item.z_score,
      service: item.service,
      amount: item.amount,
      dateLabel: item.dateLabel,
    }));

  const lowData = formattedData
    .filter((item) => item.z_score < 2)
    .map((item) => ({
      x: viewMode === "cost" ? item.dateLabel : item.dateLabel,
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
        backgroundColor: themeStyles.danger,
        borderColor: themeStyles.backgroundColor,
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: themeStyles.danger,
        pointHoverBorderColor: themeStyles.backgroundColor,
        pointHoverBorderWidth: 3,
      },
      {
        label: "Medium-High Severity (2.5 ≤ Z < 3.0)",
        data: mediumHighData,
        backgroundColor: themeStyles.warning,
        borderColor: themeStyles.backgroundColor,
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: themeStyles.warning,
        pointHoverBorderColor: themeStyles.backgroundColor,
        pointHoverBorderWidth: 3,
      },
      {
        label: "Medium Severity (2.0 ≤ Z < 2.5)",
        data: mediumData,
        backgroundColor: themeStyles.accent,
        borderColor: themeStyles.backgroundColor,
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: themeStyles.accent,
        pointHoverBorderColor: themeStyles.backgroundColor,
        pointHoverBorderWidth: 3,
      },
      {
        label: "Low Severity (Z < 2.0)",
        data: lowData,
        backgroundColor: themeStyles.primary,
        borderColor: themeStyles.backgroundColor,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: themeStyles.primary,
        pointHoverBorderColor: themeStyles.backgroundColor,
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: themeStyles.animation.duration,
      easing: themeStyles.animation.easing,
    },
    plugins: {
      legend: {
        display: true,
        position: themeStyles.legendPosition,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 24,
          font: {
            size: themeStyles.legendItemStyle.fontSize,
            weight: themeStyles.legendItemStyle.fontWeight,
            family: themeStyles.legendItemStyle.fontFamily,
          },
          color: themeStyles.legendItemStyle.color,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        ...themeStyles.tooltipStyle,
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
        type: "category" as const,
        title: {
          display: true,
          text: "Date",
          color: themeStyles.textColor,
          font: {
            size: themeStyles.fontSize.title,
            weight: themeStyles.fontWeight.semibold,
            family: themeStyles.fontFamily,
          },
          padding: 16,
        },
        grid: {
          color: themeStyles.gridColor,
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          color: themeStyles.mutedTextColor,
          font: {
            size: themeStyles.fontSize.axis,
            weight: themeStyles.fontWeight.normal,
            family: themeStyles.fontFamily,
          },
          maxTicksLimit: 8,
          padding: 8,
        },
      },
      y: {
        title: {
          display: true,
          text: viewMode === "cost" ? "Cost ($)" : "Service",
          color: themeStyles.textColor,
          font: {
            size: themeStyles.fontSize.title,
            weight: themeStyles.fontWeight.semibold,
            family: themeStyles.fontFamily,
          },
          padding: 16,
        },
        grid: {
          color: themeStyles.gridColor,
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          color: themeStyles.mutedTextColor,
          font: {
            size: themeStyles.fontSize.axis,
            weight: themeStyles.fontWeight.normal,
            family: themeStyles.fontFamily,
          },
          beginAtZero: viewMode === "cost",
          padding: 8,
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
    elements: {
      point: {
        hoverBorderWidth: 3,
        hoverRadius: 12,
      },
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
      <ChartContainer height={400}>
        <Scatter data={chartData} options={options} />
      </ChartContainer>
      <div className="chart-footer">
        <div className="legend-items">
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: themeStyles.danger }}
            ></div>
            <span>High (Z ≥ 3.0)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: themeStyles.warning }}
            ></div>
            <span>Medium-High (Z ≥ 2.5)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: themeStyles.accent }}
            ></div>
            <span>Medium (Z ≥ 2.0)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: themeStyles.primary }}
            ></div>
            <span>Low (Z &lt; 2.0)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyScatterPlotChartJS;

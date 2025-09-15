import React from "react";
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
import type { Anomaly } from "../api/anomalyApi";
import {
  defaultChartConfig,
  formatCurrency,
  type BaseChartProps,
} from "./chartConfig";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface AnomalyChartProps extends BaseChartProps {
  data: Anomaly[];
}

const AnomalyChartChartJS = ({
  data,
  height = 400,
  showGrid = defaultChartConfig.showGrid,
  currencyFormat = defaultChartConfig.currencyFormat,
}: AnomalyChartProps) => {
  if (data.length === 0) {
    return (
      <div className="text-center p-2xl">
        <h3>No Anomalies Detected</h3>
        <p>No cost anomalies found in the current dataset.</p>
      </div>
    );
  }

  // Transform data for Chart.js scatter plot
  const scatterData = data.map((anomaly) => ({
    x: anomaly.date,
    y: anomaly.amount,
    z_score: anomaly.z_score,
    service: anomaly.service,
  }));

  // Categorize anomalies by severity for different colors
  const highSeverityData = scatterData.filter((item) => item.z_score >= 3);
  const mediumHighData = scatterData.filter(
    (item) => item.z_score >= 2.5 && item.z_score < 3
  );
  const mediumData = scatterData.filter(
    (item) => item.z_score >= 2 && item.z_score < 2.5
  );
  const lowData = scatterData.filter((item) => item.z_score < 2);

  const chartData = {
    datasets: [
      {
        label: "High Severity (Z ≥ 3.0)",
        data: highSeverityData,
        backgroundColor: "#dc2626",
        borderColor: "#dc2626",
        pointRadius: 8,
        pointHoverRadius: 10,
      },
      {
        label: "Medium-High Severity (2.5 ≤ Z < 3.0)",
        data: mediumHighData,
        backgroundColor: "#ea580c",
        borderColor: "#ea580c",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Medium Severity (2.0 ≤ Z < 2.5)",
        data: mediumData,
        backgroundColor: "#d97706",
        borderColor: "#d97706",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Low Severity (Z < 2.0)",
        data: lowData,
        backgroundColor: "#2563eb",
        borderColor: "#2563eb",
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
      },
      title: {
        display: false, // We'll handle titles in the parent component
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const point = context.raw;
            return [
              `Service: ${point.service}`,
              `Amount: ${currencyFormat ? formatCurrency(point.y) : point.y}`,
              `Z-Score: ${point.z_score.toFixed(2)}`,
            ];
          },
          title: function (context: any) {
            const date = new Date(context[0].raw.x);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "2-digit",
            });
          },
        },
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          parser: "YYYY-MM-DD",
          displayFormats: {
            day: "MMM DD",
            month: "MMM YYYY",
          },
        },
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: "Cost ($)",
        },
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return currencyFormat ? formatCurrency(value) : value;
          },
        },
      },
    },
    interaction: {
      intersect: false,
    },
  };

  return (
    <div>
      <h3>Cost Anomalies Detected ({data.length} total)</h3>
      <div style={{ height: height, width: "100%" }}>
        <Scatter data={chartData} options={options} />
      </div>

      {/* Summary Table */}
      <div className="mt-2xl">
        <h4>Anomaly Details</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Z-Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((anomaly, index) => (
              <tr key={index}>
                <td>{anomaly.date}</td>
                <td>{anomaly.service}</td>
                <td>${anomaly.amount.toFixed(2)}</td>
                <td>{anomaly.z_score.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnomalyChartChartJS;

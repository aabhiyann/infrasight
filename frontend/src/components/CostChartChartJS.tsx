import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { CostRecord } from "../api/costApi";
import { useAnomalyApi, type Anomaly } from "../api/anomalyApi";
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
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CostChartProps extends BaseChartProps {
  data: CostRecord[];
  serviceFilter?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

const CostChartChartJS = ({
  data,
  serviceFilter,
  dateRange,
  height = defaultChartConfig.height,
  showGrid = defaultChartConfig.showGrid,
  showLegend = defaultChartConfig.showLegend,
  currencyFormat = defaultChartConfig.currencyFormat,
}: CostChartProps) => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const { fetchAnomalies } = useAnomalyApi();

  // Fetch anomalies when date range changes
  useEffect(() => {
    if (dateRange) {
      fetchAnomalies(2.0, {
        start_date: dateRange.start.toISOString().split("T")[0],
        end_date: dateRange.end.toISOString().split("T")[0],
      })
        .then(setAnomalies)
        .catch(() => setAnomalies([]));
    } else {
      fetchAnomalies()
        .then(setAnomalies)
        .catch(() => setAnomalies([]));
    }
  }, [dateRange, fetchAnomalies]);

  // Filter data by service if specified
  const filteredSource = serviceFilter
    ? data.filter((entry) => entry.service === serviceFilter)
    : data;

  // Transform raw data into total cost per day
  const dailyTotals = filteredSource.reduce(
    (acc: Record<string, number>, entry) => {
      acc[entry.date] = (acc[entry.date] || 0) + entry.amount;
      return acc;
    },
    {}
  );

  // Create chart data with dates and costs
  const chartData = Object.entries(dailyTotals)
    .map(([date, total]) => ({
      date,
      total,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Filter anomalies by service if specified
  const filteredAnomalies = anomalies.filter((a) =>
    serviceFilter ? a.service === serviceFilter : true
  );

  // Categorize anomalies by severity
  const highSeverityAnomalies = filteredAnomalies
    .filter((a) => a.z_score >= 3)
    .map((a) => ({ x: a.date, y: a.amount, z_score: a.z_score }));

  const mediumHighAnomalies = filteredAnomalies
    .filter((a) => a.z_score >= 2.5 && a.z_score < 3)
    .map((a) => ({ x: a.date, y: a.amount, z_score: a.z_score }));

  const mediumAnomalies = filteredAnomalies
    .filter((a) => a.z_score >= 2 && a.z_score < 2.5)
    .map((a) => ({ x: a.date, y: a.amount, z_score: a.z_score }));

  const lowAnomalies = filteredAnomalies
    .filter((a) => a.z_score < 2)
    .map((a) => ({ x: a.date, y: a.amount, z_score: a.z_score }));

  // Prepare Chart.js data format
  const chartJSData = {
    labels: chartData.map((item) => item.date),
    datasets: [
      // Main cost line
      {
        label: "Daily Cost",
        data: chartData.map((item) => item.total),
        borderColor: "var(--color-secondary)",
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      // High severity anomalies
      {
        label: "High Severity Anomalies",
        data: highSeverityAnomalies,
        backgroundColor: "#dc2626",
        borderColor: "#dc2626",
        pointRadius: 8,
        pointHoverRadius: 10,
        showLine: false,
        pointStyle: "circle",
      },
      // Medium-high severity anomalies
      {
        label: "Medium-High Severity Anomalies",
        data: mediumHighAnomalies,
        backgroundColor: "#ea580c",
        borderColor: "#ea580c",
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false,
        pointStyle: "circle",
      },
      // Medium severity anomalies
      {
        label: "Medium Severity Anomalies",
        data: mediumAnomalies,
        backgroundColor: "#d97706",
        borderColor: "#d97706",
        pointRadius: 4,
        pointHoverRadius: 6,
        showLine: false,
        pointStyle: "circle",
      },
      // Low severity anomalies
      {
        label: "Low Severity Anomalies",
        data: lowAnomalies,
        backgroundColor: "#2563eb",
        borderColor: "#2563eb",
        pointRadius: 3,
        pointHoverRadius: 5,
        showLine: false,
        pointStyle: "circle",
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: "top" as const,
      },
      title: {
        display: false, // We'll handle titles in the parent component
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            
            if (label.includes("Anomalies")) {
              return `${label}: ${currencyFormat ? formatCurrency(value) : value} (Z-Score: ${context.raw.z_score?.toFixed(2) || "N/A"})`;
            }
            return `${label}: ${currencyFormat ? formatCurrency(value) : value}`;
          },
          title: function (context: any) {
            const date = new Date(context[0].label);
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
        display: true,
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          maxTicksLimit: 10,
          callback: function (value: any, index: any) {
            const date = new Date(this.getLabelForValue(value));
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          },
        },
      },
      y: {
        display: true,
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
      mode: "index" as const,
      intersect: false,
    },
  };

  return (
    <div style={{ height: height, width: "100%" }}>
      <Line data={chartJSData} options={options} />
    </div>
  );
};

export default CostChartChartJS;

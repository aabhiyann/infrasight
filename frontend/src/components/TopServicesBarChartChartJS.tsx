import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { CostRecord } from "../api/costApi";
import {
  defaultChartConfig,
  formatCurrency,
  type BaseChartProps,
} from "./chartConfig";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopServicesBarChartProps extends BaseChartProps {
  costData: CostRecord[];
  hideTitle?: boolean;
}

const TopServicesBarChartChartJS = ({
  costData,
  hideTitle,
  height = defaultChartConfig.height,
  showGrid = defaultChartConfig.showGrid,
  showLegend = defaultChartConfig.showLegend,
  currencyFormat = defaultChartConfig.currencyFormat,
}: TopServicesBarChartProps) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter data for current month
  const monthCosts = costData.filter((record) => {
    const d = new Date(record.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Calculate service totals
  const serviceTotals = new Map<string, number>();
  for (const r of monthCosts) {
    const prev = serviceTotals.get(r.service) || 0;
    serviceTotals.set(r.service, prev + (r.amount || 0));
  }

  // Get top 5 services
  const topServices = Array.from(serviceTotals.entries())
    .map(([service, total]) => ({ service, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  if (topServices.length === 0) {
    return (
      <div>
        {!hideTitle && <h3>Top 5 Services This Month (by Total Cost)</h3>}
        <p>No data available for this month.</p>
      </div>
    );
  }

  // Prepare Chart.js data format
  const chartData = {
    labels: topServices.map((item) => item.service),
    datasets: [
      {
        label: "Total Cost",
        data: topServices.map((item) => item.total),
        backgroundColor: "var(--brand-500)",
        borderColor: "var(--brand-500)",
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  // Chart.js options - styled to match your design system
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: "top" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "rect",
          padding: 20,
          font: {
            size: 12,
          },
          color: "var(--color-text)",
        },
      },
      title: {
        display: false, // We'll handle titles in the parent component
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
            const value = context.parsed.y;
            return `Total Cost: ${
              currencyFormat ? formatCurrency(value) : value
            }`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Service",
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
          maxRotation: 30,
          minRotation: 0,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Cost ($)",
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
          beginAtZero: true,
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
      {!hideTitle && <h3>Top 5 Services This Month (by Total Cost)</h3>}
      <div style={{ height: height, width: "100%" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TopServicesBarChartChartJS;

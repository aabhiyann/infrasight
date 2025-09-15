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
        borderColor: "var(--brand-600)",
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: "var(--brand-600)",
        hoverBorderColor: "var(--brand-700)",
        hoverBorderWidth: 3,
      },
    ],
  };

  // Chart.js options - styled to match your design system
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeInOutQuart" as const,
    },
    plugins: {
      legend: {
        display: showLegend,
        position: "top" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "rect",
          padding: 24,
          font: {
            size: 13,
            weight: "normal" as const,
            family:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
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
        cornerRadius: 12,
        displayColors: true,
        padding: 16,
        titleFont: {
          size: 14,
          weight: "600" as const,
          family:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        },
        bodyFont: {
          size: 13,
          weight: "400" as const,
          family:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
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
            size: 13,
            weight: "bold" as const,
            family:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
          },
          padding: 16,
        },
        grid: {
          color: "var(--color-border)",
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          color: "var(--color-muted)",
          font: {
            size: 12,
            weight: "normal" as const,
            family:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
          },
          maxRotation: 30,
          minRotation: 0,
          padding: 8,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Cost ($)",
          color: "var(--color-text)",
          font: {
            size: 13,
            weight: "bold" as const,
            family:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
          },
          padding: 16,
        },
        grid: {
          color: "var(--color-border)",
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          color: "var(--color-muted)",
          font: {
            size: 12,
            weight: "normal" as const,
            family:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
          },
          beginAtZero: true,
          padding: 8,
          callback: function (value: any) {
            return currencyFormat ? formatCurrency(value) : value;
          },
        },
      },
    },
    interaction: {
      intersect: false,
    },
    elements: {
      bar: {
        hoverBorderWidth: 3,
        hoverBorderRadius: 8,
      },
    },
  };

  return (
    <div>
      {!hideTitle && <h3>Top 5 Services This Month (by Total Cost)</h3>}
      <div
        style={{
          height: height,
          width: "100%",
          background: "var(--color-surface)",
          borderRadius: "12px",
          padding: "1rem",
          boxShadow:
            "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid var(--color-border)",
        }}
      >
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TopServicesBarChartChartJS;

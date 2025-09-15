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
  chartStyles,
  type BaseChartProps,
} from "./chartConfig";
import ChartContainer from "./ChartContainer";

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
        backgroundColor: "#0070b8",
        borderColor: "#0052b6",
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: "#0052b6",
        hoverBorderColor: "#004486",
        hoverBorderWidth: 3,
      },
    ],
  };

  // Chart.js options - styled to match unified design system
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: chartStyles.animation.duration,
      easing: chartStyles.animation.easing,
    },
    plugins: {
      legend: {
        display: showLegend,
        position: chartStyles.legendPosition,
        labels: {
          usePointStyle: true,
          pointStyle: "rect",
          padding: 24,
          font: {
            size: chartStyles.legendItemStyle.fontSize,
            weight: chartStyles.legendItemStyle.fontWeight,
            family: chartStyles.legendItemStyle.fontFamily,
          },
          color: chartStyles.legendItemStyle.color,
        },
      },
      title: {
        display: false, // We'll handle titles in the parent component
      },
      tooltip: {
        ...chartStyles.tooltipStyle,
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
          color: chartStyles.textColor,
          font: {
            size: chartStyles.fontSize.title,
            weight: chartStyles.fontWeight.semibold,
            family: chartStyles.fontFamily,
          },
          padding: 16,
        },
        grid: {
          color: chartStyles.gridColor,
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          color: chartStyles.mutedTextColor,
          font: {
            size: chartStyles.fontSize.axis,
            weight: chartStyles.fontWeight.normal,
            family: chartStyles.fontFamily,
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
          color: chartStyles.textColor,
          font: {
            size: chartStyles.fontSize.title,
            weight: chartStyles.fontWeight.semibold,
            family: chartStyles.fontFamily,
          },
          padding: 16,
        },
        grid: {
          color: chartStyles.gridColor,
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          color: chartStyles.mutedTextColor,
          font: {
            size: chartStyles.fontSize.axis,
            weight: chartStyles.fontWeight.normal,
            family: chartStyles.fontFamily,
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
      <ChartContainer height={height}>
        <Bar data={chartData} options={options} />
      </ChartContainer>
    </div>
  );
};

export default TopServicesBarChartChartJS;

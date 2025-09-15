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
import ChartContainer from "./ChartContainer";
import { useThemeAwareChartStyles } from "../hooks/useThemeAwareChartStyles";
import { canvasBackgroundPlugin } from "./chartConfig";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  canvasBackgroundPlugin
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
  const { chartStyles: themeStyles } = useThemeAwareChartStyles();
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
        backgroundColor: themeStyles.primary,
        borderColor: themeStyles.secondary,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: themeStyles.secondary,
        hoverBorderColor: themeStyles.secondary,
        hoverBorderWidth: 3,
      },
    ],
  };

  // Chart.js options - styled to match unified design system
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: themeStyles.animation.duration,
      easing: themeStyles.animation.easing,
    },
    plugins: {
      legend: {
        display: showLegend,
        position: themeStyles.legendPosition,
        labels: {
          usePointStyle: true,
          pointStyle: "rect",
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
        display: false, // We'll handle titles in the parent component
      },
      tooltip: {
        ...themeStyles.tooltipStyle,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            return `Total Cost: ${
              currencyFormat ? formatCurrency(value) : value
            }`;
          },
        },
      },
      canvasBackgroundColor: {
        color: themeStyles.backgroundColor,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Service",
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

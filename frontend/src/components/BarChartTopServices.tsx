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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartTopServicesProps extends BaseChartProps {
  data: CostRecord[];
}

const BarChartTopServices = ({
  data,
  hideTitle,
  height = defaultChartConfig.height,
  currencyFormat = defaultChartConfig.currencyFormat,
}: BarChartTopServicesProps) => {
  const { chartStyles: themeStyles } = useThemeAwareChartStyles();

  // Step 1: Aggregate total cost per service
  const totals: Record<string, number> = {};
  data.forEach((item) => {
    totals[item.service] = (totals[item.service] || 0) + item.amount;
  });

  // Step 2: Convert to array and sort by total cost descending
  const sortedData = Object.entries(totals)
    .map(([service, total]) => ({ service, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10); // Top 10 services

  // Transform data for Chart.js horizontal bar chart with enhanced styling
  const chartData = {
    labels: sortedData.map((item) => item.service),
    datasets: [
      {
        label: "Total Cost",
        data: sortedData.map((item) => item.total),
        backgroundColor: themeStyles.gradients.primary,
        borderColor: themeStyles.primary,
        borderWidth: 0,
        borderRadius: {
          topRight: 8,
          bottomRight: 8,
          topLeft: 4,
          bottomLeft: 4,
        },
        borderSkipped: false,
        barThickness: 24,
        maxBarThickness: 32,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const, // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: themeStyles.animation.duration,
      easing: themeStyles.animation.easing,
    },
    plugins: {
      legend: {
        display: false, // Hide legend for single dataset
      },
      title: {
        display: false,
      },
      tooltip: {
        ...themeStyles.tooltipStyle,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.x;
            return `Total Cost: ${
              currencyFormat ? formatCurrency(value) : value
            }`;
          },
          title: function (context: any) {
            return `Service: ${context[0].label}`;
          },
        },
      },
    },
    scales: {
      x: {
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
        beginAtZero: true,
        ticks: {
          color: themeStyles.mutedTextColor,
          font: {
            size: themeStyles.fontSize.axis,
            weight: themeStyles.fontWeight.normal,
            family: themeStyles.fontFamily,
          },
          padding: 8,
          callback: function (value: any) {
            return currencyFormat ? formatCurrency(value) : value;
          },
        },
      },
      y: {
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
          padding: 8,
          maxTicksLimit: 10,
        },
      },
    },
    interaction: {
      intersect: false,
    },
  };

  return (
    <ChartContainer height={height}>
      {!hideTitle && <h3>Top 10 Services by Total Cost</h3>}
      <Bar data={chartData} options={options} />
    </ChartContainer>
  );
};

export default BarChartTopServices;

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ForecastPoint } from "../api/forecastApi";
import {
  defaultChartConfig,
  formatCurrency,
  formatDate,
  type BaseChartProps,
} from "./chartConfig";
import { useThemeAwareChartStyles } from "../hooks/useThemeAwareChartStyles";
import { canvasBackgroundPlugin } from "./chartConfig";
import ChartContainer from "./ChartContainer";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  canvasBackgroundPlugin
);

interface ForecastChartProps extends BaseChartProps {
  data: ForecastPoint[];
  service: string;
}

function ForecastChart({
  data,
  service,
  hideTitle,
  height = defaultChartConfig.height,
  showLegend = defaultChartConfig.showLegend,
  currencyFormat = defaultChartConfig.currencyFormat,
}: ForecastChartProps) {
  // Get theme-aware chart styles
  const { chartStyles: themeStyles } = useThemeAwareChartStyles();

  // Transform data for Chart.js with enhanced styling
  const chartData = {
    labels: data.map((point) => point.date),
    datasets: [
      {
        label: "Predicted Cost",
        data: data.map((point) => point.predicted_cost),
        borderColor: themeStyles.primary,
        backgroundColor: themeStyles.colorVariants.primary.alpha20,
        borderWidth: 4,
        fill: false,
        tension: 0.3,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: themeStyles.primary,
        pointBorderColor: themeStyles.backgroundColor,
        pointBorderWidth: 3,
        pointHoverBackgroundColor: themeStyles.primary,
        pointHoverBorderColor: themeStyles.backgroundColor,
        pointHoverBorderWidth: 4,
      },
      {
        label: "Upper Bound",
        data: data.map((point) => point.upper_bound),
        borderColor: themeStyles.warning,
        backgroundColor: themeStyles.colorVariants.accent.alpha10,
        borderWidth: 3,
        borderDash: [6, 3],
        fill: false,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: themeStyles.warning,
        pointBorderColor: themeStyles.backgroundColor,
        pointBorderWidth: 2,
        pointHoverBackgroundColor: themeStyles.warning,
        pointHoverBorderColor: themeStyles.backgroundColor,
        pointHoverBorderWidth: 3,
      },
      {
        label: "Lower Bound",
        data: data.map((point) => point.lower_bound),
        borderColor: themeStyles.success,
        backgroundColor: themeStyles.colorVariants.secondary.alpha10,
        borderWidth: 3,
        borderDash: [6, 3],
        fill: false,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: themeStyles.success,
        pointBorderColor: themeStyles.backgroundColor,
        pointBorderWidth: 2,
        pointHoverBackgroundColor: themeStyles.success,
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
      delay: themeStyles.animation.delay,
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: {
        display: showLegend,
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
          generateLabels: function (chart: any) {
            const datasets = chart.data.datasets;
            return datasets.map((dataset: any, index: number) => ({
              text: dataset.label,
              fillStyle: dataset.borderColor,
              strokeStyle: dataset.borderColor,
              lineWidth: dataset.borderWidth,
              pointStyle: index === 0 ? "circle" : "line", // Solid circle for main line, line for bounds
              hidden: !chart.isDatasetVisible(index),
              datasetIndex: index,
            }));
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        ...themeStyles.tooltipStyle,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${
              currencyFormat ? formatCurrency(value) : value
            }`;
          },
          title: function (context: any) {
            return `Date: ${formatDate(context[0].label)}`;
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
          borderDash: themeStyles.gridStyle.borderDash,
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
          callback: function (value: any) {
            return formatDate(data[value]?.date || value);
          },
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
          borderDash: themeStyles.gridStyle.borderDash,
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
    },
  };

  return (
    <ChartContainer height={height}>
      {!hideTitle && <h3>{service}</h3>}
      <Line data={chartData} options={options} />
    </ChartContainer>
  );
}

export default ForecastChart;

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
  chartStyles,
  type BaseChartProps,
} from "./chartConfig";
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
  TimeScale
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
  // Transform data for Chart.js with enhanced styling
  const chartData = {
    labels: data.map((point) => point.date),
    datasets: [
      {
        label: "Predicted Cost",
        data: data.map((point) => point.predicted_cost),
        borderColor: chartStyles.primary,
        backgroundColor: chartStyles.colorVariants.primary.alpha20,
        borderWidth: 3,
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: chartStyles.primary,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: chartStyles.primary,
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 3,
      },
      {
        label: "Upper Bound",
        data: data.map((point) => point.upper_bound),
        borderColor: chartStyles.warning,
        backgroundColor: chartStyles.colorVariants.accent.alpha10,
        borderWidth: 2,
        borderDash: [8, 4],
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBackgroundColor: chartStyles.warning,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
      },
      {
        label: "Lower Bound",
        data: data.map((point) => point.lower_bound),
        borderColor: chartStyles.success,
        backgroundColor: chartStyles.colorVariants.secondary.alpha10,
        borderWidth: 2,
        borderDash: [8, 4],
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBackgroundColor: chartStyles.success,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: chartStyles.animation.duration,
      easing: chartStyles.animation.easing,
      delay: chartStyles.animation.delay,
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    plugins: {
      legend: {
        display: showLegend,
        position: chartStyles.legendPosition,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
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
        display: false,
      },
      tooltip: {
        ...chartStyles.tooltipStyle,
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
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Date",
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
          borderDash: chartStyles.gridStyle.borderDash,
        },
        ticks: {
          color: chartStyles.mutedTextColor,
          font: {
            size: chartStyles.fontSize.axis,
            weight: chartStyles.fontWeight.normal,
            family: chartStyles.fontFamily,
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
          borderDash: chartStyles.gridStyle.borderDash,
        },
        beginAtZero: true,
        ticks: {
          color: chartStyles.mutedTextColor,
          font: {
            size: chartStyles.fontSize.axis,
            weight: chartStyles.fontWeight.normal,
            family: chartStyles.fontFamily,
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

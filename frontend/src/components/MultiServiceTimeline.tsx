import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { CostRecord } from "../api/costApi";
import {
  defaultChartConfig,
  formatCurrency,
  formatDate,
  type BaseChartProps,
} from "./chartConfig";
import ChartContainer from "./ChartContainer";
import { useThemeAwareChartStyles } from "../hooks/useThemeAwareChartStyles";
import { canvasBackgroundPlugin } from "./chartConfig";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  canvasBackgroundPlugin
);

interface MultiServiceTimelineProps extends BaseChartProps {
  data: CostRecord[];
}

const MultiServiceTimeline = ({
  data,
  height = 400,
  showLegend = defaultChartConfig.showLegend,
  currencyFormat = defaultChartConfig.currencyFormat,
}: MultiServiceTimelineProps) => {
  const { chartStyles: themeStyles } = useThemeAwareChartStyles();

  // Step 1: Create pivot table - dates as rows, services as columns
  const pivotData: Record<string, Record<string, number>> = {};

  data.forEach(({ date, service, amount }) => {
    if (!pivotData[date]) {
      pivotData[date] = {};
    }
    pivotData[date][service] = (pivotData[date][service] || 0) + amount;
  });

  // Step 2: Convert to sorted array format for Chart.js
  const sortedData = Object.entries(pivotData).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );

  // Step 3: Get unique services for datasets
  const services = Array.from(new Set(data.map((item) => item.service))).sort();

  // Step 4: Generate enhanced colors for each service using sophisticated palette
  const serviceColors = [
    themeStyles.primary,
    themeStyles.colors[1], // Teal
    themeStyles.colors[2], // Amber
    themeStyles.colors[3], // Rose
    themeStyles.colors[4], // Slate
    themeStyles.secondary,
    themeStyles.colorVariants.secondary.light,
    themeStyles.colorVariants.accent.light,
    themeStyles.success,
    themeStyles.warning,
  ];

  // Step 5: Transform data for Chart.js
  const chartData = {
    labels: sortedData.map(([date]) => date),
    datasets: services.map((service, index) => ({
      label: service,
      data: sortedData.map(([, services]) => services[service] || 0),
      borderColor: serviceColors[index % serviceColors.length],
      backgroundColor: serviceColors[index % serviceColors.length] + "30", // Enhanced transparency
      borderWidth: 3,
      fill: false,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 7,
      pointBackgroundColor: serviceColors[index % serviceColors.length],
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      pointHoverBackgroundColor: serviceColors[index % serviceColors.length],
      pointHoverBorderColor: "#ffffff",
      pointHoverBorderWidth: 3,
    })),
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
        display: showLegend,
        position: themeStyles.legendPosition,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
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
        mode: "index" as const,
        intersect: false,
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
            return formatDate(sortedData[value]?.[0] || value);
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
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  };

  return (
    <ChartContainer height={height}>
      <h3>AWS Service Costs Over Time</h3>
      <Line data={chartData} options={options} />
    </ChartContainer>
  );
};

export default MultiServiceTimeline;

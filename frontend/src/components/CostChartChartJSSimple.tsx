import { useEffect, useState } from "react";
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
import ChartContainer from "./ChartContainer";
import { useThemeAwareChartStyles } from "../hooks/useThemeAwareChartStyles";

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

const CostChartChartJSSimple = ({
  data,
  serviceFilter,
  dateRange,
  height = defaultChartConfig.height,
  showLegend = defaultChartConfig.showLegend,
  currencyFormat = defaultChartConfig.currencyFormat,
}: CostChartProps) => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const { fetchAnomalies } = useAnomalyApi();
  const { chartStyles: themeStyles } = useThemeAwareChartStyles();

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

  // Create a map of anomalies by date for easy lookup
  const anomaliesByDate = new Map<string, Anomaly[]>();
  filteredAnomalies.forEach((anomaly) => {
    if (!anomaliesByDate.has(anomaly.date)) {
      anomaliesByDate.set(anomaly.date, []);
    }
    anomaliesByDate.get(anomaly.date)!.push(anomaly);
  });

  // Prepare Chart.js data format
  const chartJSData = {
    labels: chartData.map((item) => item.date),
    datasets: [
      {
        label: "Daily Cost",
        data: chartData.map((item) => {
          const dayAnomalies = anomaliesByDate.get(item.date) || [];
          const hasHighSeverity = dayAnomalies.some((a) => a.z_score >= 3);
          const hasMediumSeverity = dayAnomalies.some(
            (a) => a.z_score >= 2 && a.z_score < 3
          );
          const hasLowSeverity = dayAnomalies.some((a) => a.z_score < 2);

          return {
            x: item.date,
            y: item.total,
            hasAnomaly: dayAnomalies.length > 0,
            anomalyCount: dayAnomalies.length,
            hasHighSeverity,
            hasMediumSeverity,
            hasLowSeverity,
            anomalies: dayAnomalies,
          };
        }),
        borderColor: themeStyles.primary,
        backgroundColor: themeStyles.colorVariants.primary.alpha10,
        borderWidth: 3,
        fill: true,
        tension: 0.2,
        pointRadius: (context: any) => {
          const dataPoint = context.parsed;
          if (dataPoint.hasHighSeverity) return 8;
          if (dataPoint.hasMediumSeverity) return 6;
          if (dataPoint.hasLowSeverity) return 4;
          return 3;
        },
        pointHoverRadius: (context: any) => {
          const dataPoint = context.parsed;
          if (dataPoint.hasHighSeverity) return 10;
          if (dataPoint.hasMediumSeverity) return 8;
          if (dataPoint.hasLowSeverity) return 6;
          return 5;
        },
        pointBackgroundColor: (context: any) => {
          const dataPoint = context.parsed;
          if (dataPoint.hasHighSeverity) return themeStyles.danger;
          if (dataPoint.hasMediumSeverity) return themeStyles.accent;
          if (dataPoint.hasLowSeverity) return themeStyles.primary;
          return themeStyles.primary;
        },
        pointBorderColor: (context: any) => {
          const dataPoint = context.parsed;
          if (dataPoint.hasHighSeverity) return themeStyles.danger;
          if (dataPoint.hasMediumSeverity) return themeStyles.accent;
          if (dataPoint.hasLowSeverity) return themeStyles.primary;
          return themeStyles.primary;
        },
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
          pointStyle: "circle",
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
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        ...themeStyles.tooltipStyle,
        callbacks: {
          label: function (context: any) {
            const dataPoint = context.parsed;
            const label = context.dataset.label || "";
            const value = dataPoint.y;

            if (dataPoint.hasAnomaly) {
              return [
                `${label}: ${currencyFormat ? formatCurrency(value) : value}`,
                `Warning: ${dataPoint.anomalyCount} anomaly(ies) detected`,
                dataPoint.hasHighSeverity ? "High severity" : "",
                dataPoint.hasMediumSeverity ? "🟡 Medium severity" : "",
                dataPoint.hasLowSeverity ? "Low severity" : "",
              ].filter(Boolean);
            }
            return `${label}: ${
              currencyFormat ? formatCurrency(value) : value
            }`;
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
            const date = new Date(value);
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
      mode: "index" as const,
      intersect: false,
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
        hoverRadius: 8,
      },
      line: {
        tension: 0.2,
      },
    },
  };

  return (
    <ChartContainer height={height}>
      <Line data={chartJSData} options={options} />
    </ChartContainer>
  );
};

export default CostChartChartJSSimple;

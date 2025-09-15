import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import type { Anomaly } from "../api/anomalyApi";
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
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface AnomalyChartProps extends BaseChartProps {
  data: Anomaly[];
}

const AnomalyChartChartJS = ({
  data,
  height = 400,
  currencyFormat = defaultChartConfig.currencyFormat,
}: AnomalyChartProps) => {
  if (data.length === 0) {
    return (
      <div className="text-center p-2xl">
        <h3>No Anomalies Detected</h3>
        <p>No cost anomalies found in the current dataset.</p>
      </div>
    );
  }

  // Transform data for Chart.js scatter plot
  const scatterData = data.map((anomaly) => ({
    x: anomaly.date,
    y: anomaly.amount,
    z_score: anomaly.z_score,
    service: anomaly.service,
  }));

  // Categorize anomalies by severity for different colors
  const highSeverityData = scatterData.filter((item) => item.z_score >= 3);
  const mediumHighData = scatterData.filter(
    (item) => item.z_score >= 2.5 && item.z_score < 3
  );
  const mediumData = scatterData.filter(
    (item) => item.z_score >= 2 && item.z_score < 2.5
  );
  const lowData = scatterData.filter((item) => item.z_score < 2);

  const chartData = {
    datasets: [
      {
        label: "High Severity (Z ≥ 3.0)",
        data: highSeverityData,
        backgroundColor: "var(--color-danger)",
        borderColor: "var(--color-danger)",
        pointRadius: 8,
        pointHoverRadius: 10,
      },
      {
        label: "Medium-High Severity (2.5 ≤ Z < 3.0)",
        data: mediumHighData,
        backgroundColor: "var(--color-warning)",
        borderColor: "var(--color-warning)",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Medium Severity (2.0 ≤ Z < 2.5)",
        data: mediumData,
        backgroundColor: "var(--chart-3)",
        borderColor: "var(--chart-3)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Low Severity (Z < 2.0)",
        data: lowData,
        backgroundColor: "var(--chart-1)",
        borderColor: "var(--chart-1)",
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: chartStyles.animation.duration,
      easing: chartStyles.animation.easing,
    },
    plugins: {
      legend: {
        display: true,
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
        display: false, // We'll handle titles in the parent component
      },
      tooltip: chartStyles.tooltipStyle,
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          parser: "YYYY-MM-DD",
          displayFormats: {
            day: "MMM DD",
            month: "MMM YYYY",
          },
        },
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
        },
      },
      y: {
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
    interaction: {
      intersect: false,
    },
  };

  return (
    <div>
      <h3>Cost Anomalies Detected ({data.length} total)</h3>
      <ChartContainer height={height}>
        <Scatter data={chartData} options={options} />
      </ChartContainer>

      {/* Summary Table */}
      <div className="mt-2xl">
        <h4>Anomaly Details</h4>
        <div style={chartStyles.containerStyle}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Z-Score</th>
              </tr>
            </thead>
            <tbody>
              {data.map((anomaly, index) => (
                <tr key={index}>
                  <td>{anomaly.date}</td>
                  <td>{anomaly.service}</td>
                  <td>${anomaly.amount.toFixed(2)}</td>
                  <td>{anomaly.z_score.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnomalyChartChartJS;

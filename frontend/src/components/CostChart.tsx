import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Scatter,
} from "recharts";
import type { CostRecord } from "../api/costApi";
import { useAnomalyApi, type Anomaly } from "../api/anomalyApi";
import { useEffect, useState } from "react";
import {
  defaultChartConfig,
  formatCurrency,
  type BaseChartProps,
} from "./chartConfig";

interface CostChartProps extends BaseChartProps {
  data: CostRecord[];
  serviceFilter?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

const CostChart = ({
  data,
  serviceFilter,
  dateRange,
  height = defaultChartConfig.height,
  showGrid = defaultChartConfig.showGrid,
  showLegend = defaultChartConfig.showLegend,
  currencyFormat = defaultChartConfig.currencyFormat,
  dateTickAngle = defaultChartConfig.dateTickAngle,
}: CostChartProps) => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const { fetchAnomalies } = useAnomalyApi();

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
  // Optional service-level filtering for both line and markers
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

  const chartData = Object.entries(dailyTotals)
    .map(([date, total]) => ({
      date,
      total,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filteredAnomalies = anomalies.filter((a) =>
    serviceFilter ? a.service === serviceFilter : true
  );

  const highSeverityAnomalies = filteredAnomalies
    .filter((a) => a.z_score >= 3)
    .map((a) => ({ date: a.date, total: a.amount, z_score: a.z_score }));

  const mediumHighAnomalies = filteredAnomalies
    .filter((a) => a.z_score >= 2.5 && a.z_score < 3)
    .map((a) => ({ date: a.date, total: a.amount, z_score: a.z_score }));

  const mediumAnomalies = filteredAnomalies
    .filter((a) => a.z_score >= 2 && a.z_score < 2.5)
    .map((a) => ({ date: a.date, total: a.amount, z_score: a.z_score }));

  const lowAnomalies = filteredAnomalies
    .filter((a) => a.z_score < 2)
    .map((a) => ({ date: a.date, total: a.amount, z_score: a.z_score }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={defaultChartConfig.margin}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis
          dataKey="date"
          angle={dateTickAngle}
          textAnchor={dateTickAngle ? "end" : "middle"}
          height={dateTickAngle ? 60 : undefined}
          tickFormatter={(value) => {
            // Format date for better readability
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "2-digit",
            });
          }}
          interval="preserveStartEnd"
        />
        <YAxis />
        <Tooltip
          formatter={(v: number) =>
            currencyFormat ? formatCurrency(v) : String(v)
          }
          labelFormatter={(l) => `Date: ${l}`}
        />
        {showLegend && <Legend />}
        <Line
          type="monotone"
          dataKey="total"
          stroke="var(--color-secondary)"
          strokeWidth={2}
          dot
          connectNulls={false}
        />
        {/* High severity anomalies - red, large */}
        <Scatter
          data={highSeverityAnomalies}
          fill="#dc2626"
          shape="circle"
          r={8}
        />
        {/* Medium-high severity anomalies - orange, medium */}
        <Scatter
          data={mediumHighAnomalies}
          fill="#ea580c"
          shape="circle"
          r={6}
        />
        {/* Medium severity anomalies - amber, small */}
        <Scatter data={mediumAnomalies} fill="#d97706" shape="circle" r={4} />
        {/* Low severity anomalies - blue, smallest */}
        <Scatter data={lowAnomalies} fill="#2563eb" shape="circle" r={3} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CostChart;

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
import { fetchAnomalies, type Anomaly } from "../api/anomalyApi";
import { useEffect, useState } from "react";
import {
  defaultChartConfig,
  formatCurrency,
  type BaseChartProps,
} from "./chartConfig";

interface Props extends BaseChartProps {
  data: CostRecord[];
  serviceFilter?: string;
}

const CostChart = ({
  data,
  serviceFilter,
  height = defaultChartConfig.height,
  showGrid = defaultChartConfig.showGrid,
  showLegend = defaultChartConfig.showLegend,
  currencyFormat = defaultChartConfig.currencyFormat,
  dateTickAngle = defaultChartConfig.dateTickAngle,
}: Props) => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  useEffect(() => {
    fetchAnomalies()
      .then(setAnomalies)
      .catch(() => setAnomalies([]));
  }, []);
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
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const anomalyDots = anomalies
    .filter((a) => (serviceFilter ? a.service === serviceFilter : true))
    .map((a) => ({ date: a.date, total: a.amount }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={defaultChartConfig.margin}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis
          dataKey="date"
          angle={dateTickAngle}
          textAnchor={dateTickAngle ? "end" : "middle"}
          height={dateTickAngle ? 60 : undefined}
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
        />
        <Scatter
          data={anomalyDots}
          fill="var(--color-danger)"
          shape="triangle"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CostChart;

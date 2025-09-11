import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { CostRecord } from "../api/costApi";
import {
  defaultChartConfig,
  formatCurrency,
  type BaseChartProps,
} from "./chartConfig";

interface Props extends BaseChartProps {
  data: CostRecord[];
}

const CostChart = ({
  data,
  height = defaultChartConfig.height,
  showGrid = defaultChartConfig.showGrid,
  showLegend = defaultChartConfig.showLegend,
  currencyFormat = defaultChartConfig.currencyFormat,
  dateTickAngle = defaultChartConfig.dateTickAngle,
}: Props) => {
  // Transform raw data into total cost per day
  const dailyTotals = data.reduce((acc: Record<string, number>, entry) => {
    acc[entry.date] = (acc[entry.date] || 0) + entry.amount;
    return acc;
  }, {});

  const chartData = Object.entries(dailyTotals)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CostChart;

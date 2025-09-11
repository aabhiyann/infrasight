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
import type { ForecastPoint } from "../api/forecastApi";
import {
  defaultChartConfig,
  formatCurrency,
  type BaseChartProps,
} from "./chartConfig";

interface Props extends BaseChartProps {
  data: ForecastPoint[];
  service: string;
}

function ForecastChart({
  data,
  service,
  hideTitle,
  height = defaultChartConfig.height,
  showGrid = defaultChartConfig.showGrid,
  showLegend = defaultChartConfig.showLegend,
  currencyFormat = defaultChartConfig.currencyFormat,
  dateTickAngle = defaultChartConfig.dateTickAngle,
}: Props) {
  return (
    <div>
      {!hideTitle && <h3>{service}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={defaultChartConfig.margin}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis
            dataKey="date"
            angle={dateTickAngle}
            textAnchor={dateTickAngle ? "end" : "middle"}
            height={dateTickAngle ? 60 : undefined}
          />
          <YAxis />
          <Tooltip
            formatter={(value: number) =>
              currencyFormat ? formatCurrency(value) : String(value)
            }
            labelFormatter={(label) => `Date: ${label}`}
          />
          {showLegend && <Legend />}
          <Line
            type="monotone"
            dataKey="predicted_cost"
            stroke="var(--color-secondary)"
            name="Predicted"
          />
          <Line
            type="monotone"
            dataKey="upper_bound"
            stroke="var(--color-accent)"
            name="Upper Bound"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="lower_bound"
            stroke="var(--color-success)"
            name="Lower Bound"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ForecastChart;

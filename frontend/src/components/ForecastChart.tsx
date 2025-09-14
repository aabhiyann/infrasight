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
  chartStyles,
  type BaseChartProps,
} from "./chartConfig";

interface ForecastChartProps extends BaseChartProps {
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
}: ForecastChartProps) {
  return (
    <div>
      {!hideTitle && <h3>{service}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={defaultChartConfig.margin}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartStyles.gridColor}
            />
          )}
          <XAxis
            dataKey="date"
            angle={dateTickAngle}
            textAnchor={dateTickAngle ? "end" : "middle"}
            height={dateTickAngle ? 60 : undefined}
            tick={{ fill: chartStyles.textColor, fontSize: 12 }}
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
          <YAxis
            tick={{ fill: chartStyles.textColor, fontSize: 12 }}
            tickFormatter={currencyFormat ? formatCurrency : undefined}
          />
          <Tooltip
            formatter={(value: number) =>
              currencyFormat ? formatCurrency(value) : String(value)
            }
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              color: "var(--color-text)",
            }}
          />
          {showLegend && (
            <Legend
              verticalAlign={chartStyles.legendVerticalAlign}
              align={chartStyles.legendAlign}
              wrapperStyle={chartStyles.legendItemStyle}
            />
          )}
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

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
  formatDate,
  chartStyles,
  type BaseChartProps,
} from "./chartConfig";
import ChartContainer from "./ChartContainer";

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
    <ChartContainer height={height}>
      {!hideTitle && <h3>{service}</h3>}
      <ResponsiveContainer width="100%" height={height - 60}>
        {" "}
        {/* Account for container padding */}
        <LineChart data={data} margin={defaultChartConfig.margin}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartStyles.gridColor}
              strokeOpacity={chartStyles.gridOpacity}
            />
          )}
          <XAxis
            dataKey="date"
            angle={dateTickAngle}
            textAnchor={dateTickAngle ? "end" : "middle"}
            height={dateTickAngle ? 60 : undefined}
            tick={{
              fill: chartStyles.axisTextColor,
              fontSize: chartStyles.fontSize.axis,
              fontFamily: chartStyles.fontFamily,
            }}
            tickFormatter={(value: any) => formatDate(value)}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{
              fill: chartStyles.axisTextColor,
              fontSize: chartStyles.fontSize.axis,
              fontFamily: chartStyles.fontFamily,
            }}
            tickFormatter={currencyFormat ? formatCurrency : undefined}
          />
          <Tooltip
            formatter={(value: number) =>
              currencyFormat ? formatCurrency(value) : String(value)
            }
            labelFormatter={(label: any) => `Date: ${formatDate(label)}`}
            contentStyle={chartStyles.tooltipStyle}
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
            stroke={chartStyles.primary}
            strokeWidth={3}
            name="Predicted"
            dot={{ fill: chartStyles.primary, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: chartStyles.primary, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="upper_bound"
            stroke={chartStyles.warning}
            strokeWidth={2}
            name="Upper Bound"
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="lower_bound"
            stroke={chartStyles.success}
            strokeWidth={2}
            name="Lower Bound"
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default ForecastChart;

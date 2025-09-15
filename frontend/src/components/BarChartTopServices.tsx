import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CostRecord } from "../api/costApi";
import {
  defaultChartConfig,
  formatCurrency,
  chartStyles,
  type BaseChartProps,
} from "./chartConfig";
import ChartContainer from "./ChartContainer";

interface BarChartTopServicesProps extends BaseChartProps {
  data: CostRecord[];
}

const BarChartTopServices = ({
  data,
  hideTitle,
  height = defaultChartConfig.height,
  showGrid = defaultChartConfig.showGrid,
  currencyFormat = defaultChartConfig.currencyFormat,
}: BarChartTopServicesProps) => {
  // Step 1: Aggregate total cost per service
  const totals: Record<string, number> = {};
  data.forEach((item) => {
    totals[item.service] = (totals[item.service] || 0) + item.amount;
  });

  // Step 2: Convert to array and sort by total cost descending
  const chartData = Object.entries(totals)
    .map(([service, total]) => ({ service, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10); // Top 10 services

  return (
    <ChartContainer height={height}>
      {!hideTitle && <h3>Top 10 Services by Total Cost</h3>}
      <ResponsiveContainer width="100%" height={height - 60}>
        {" "}
        {/* Account for container padding */}
        <BarChart
          data={chartData}
          layout="vertical"
          margin={defaultChartConfig.margin}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartStyles.gridColor}
              strokeOpacity={chartStyles.gridOpacity}
            />
          )}
          <XAxis
            type="number"
            tick={{
              fill: chartStyles.axisTextColor,
              fontSize: chartStyles.fontSize.axis,
              fontFamily: chartStyles.fontFamily,
            }}
            tickFormatter={currencyFormat ? formatCurrency : undefined}
          />
          <YAxis
            type="category"
            dataKey="service"
            width={150}
            tick={{
              fill: chartStyles.axisTextColor,
              fontSize: chartStyles.fontSize.axis,
              fontFamily: chartStyles.fontFamily,
            }}
          />
          <Tooltip
            formatter={(value: number) => [
              currencyFormat ? formatCurrency(value) : value,
              "Total Cost",
            ]}
            labelFormatter={(label) => `Service: ${label}`}
            contentStyle={chartStyles.tooltipStyle}
          />
          <Bar
            dataKey="total"
            fill={chartStyles.primary}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default BarChartTopServices;

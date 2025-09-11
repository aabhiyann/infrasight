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

interface Props {
  data: CostRecord[];
}

const MultiServiceTimeline = ({ data }: Props) => {
  // Step 1: Create pivot table - dates as rows, services as columns
  const pivotData: Record<string, Record<string, number>> = {};

  data.forEach(({ date, service, amount }) => {
    if (!pivotData[date]) {
      pivotData[date] = {};
    }
    pivotData[date][service] = (pivotData[date][service] || 0) + amount;
  });

  // Step 2: Convert to array format for Recharts
  const chartData = Object.entries(pivotData)
    .map(([date, services]) => ({
      date,
      ...services, // Spread all services as properties
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Step 3: Get unique services for line colors
  const services = Array.from(new Set(data.map((item) => item.service))).sort();

  // Step 4: Generate colors for each service
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#00ff00",
    "#ff00ff",
    "#00ffff",
    "#ffff00",
    "#ff0000",
    "#0000ff",
  ];

  return (
    <div>
      <h3>AWS Service Costs Over Time</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => [
              `$${value.toFixed(2)}`,
              name,
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          {services.map((service, index) => (
            <Line
              key={service}
              type="monotone"
              dataKey={service}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiServiceTimeline;

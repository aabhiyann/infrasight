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

interface Props {
  data: ForecastPoint[];
  service: string;
  hideTitle?: boolean;
}

function ForecastChart({ data, service, hideTitle }: Props) {
  return (
    <div>
      {!hideTitle && <h3>{service}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="predicted_cost"
            stroke="var(--color-secondary)"
            name="Predicted"
          />
          <Line
            type="monotone"
            dataKey="lower_bound"
            stroke="var(--color-success)"
            strokeDasharray="5 5"
            name="Lower Bound"
          />
          <Line
            type="monotone"
            dataKey="upper_bound"
            stroke="var(--color-accent)"
            strokeDasharray="5 5"
            name="Upper Bound"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ForecastChart;

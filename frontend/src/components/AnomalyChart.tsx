import {
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
} from "recharts";
import type { Anomaly } from "../api/anomalyApi";
import {
  defaultChartConfig,
  formatCurrency,
  type BaseChartProps,
} from "./chartConfig";

interface Props extends BaseChartProps {
  data: Anomaly[];
}

const AnomalyChart = ({
  data,
  height = 400,
  showGrid = defaultChartConfig.showGrid,
  currencyFormat = defaultChartConfig.currencyFormat,
  dateTickAngle = -45,
}: Props) => {
  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h3>No Anomalies Detected</h3>
        <p>No cost anomalies found in the current dataset.</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Cost Anomalies Detected ({data.length} total)</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={defaultChartConfig.margin}>
          {showGrid && <CartesianGrid />}
          <XAxis
            dataKey="date"
            name="Date"
            angle={dateTickAngle}
            textAnchor={dateTickAngle ? "end" : "middle"}
            height={dateTickAngle ? 60 : undefined}
          />
          <YAxis dataKey="amount" name="Cost ($)" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value: number, name: string) => [
              currencyFormat ? formatCurrency(value) : String(value),
              name,
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Scatter
            name="Anomalies"
            data={data}
            fill="var(--color-danger)"
            r={6}
          />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Summary Table */}
      <div style={{ marginTop: "2rem" }}>
        <h4>Anomaly Details</h4>
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
  );
};

export default AnomalyChart;

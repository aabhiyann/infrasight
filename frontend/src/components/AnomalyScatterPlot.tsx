import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  Legend,
  ZAxis,
  Cell,
} from "recharts";

interface AnomalyPoint {
  date: string;
  service: string;
  amount: number;
  z_score: number;
}

interface Props {
  anomalies: AnomalyPoint[];
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

function getSeverityColor(z: number): string {
  if (z >= 3) return "#d32f2f"; // high - red
  if (z >= 2.5) return "#f57c00"; // medium-high - orange
  if (z >= 2) return "#fbc02d"; // medium - amber
  return "#1976d2"; // low - blue
}

const AnomalyScatterPlot = ({ anomalies }: Props) => {
  const formattedData = anomalies.map((a) => ({
    ...a,
    dateLabel: formatDate(a.date),
  }));

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Detected Anomalies</h3>
      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 0 }}>
          <CartesianGrid />
          <XAxis
            dataKey="dateLabel"
            name="Date"
            angle={-30}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis
            dataKey="amount"
            name="Cost ($)"
            tickFormatter={(v: number) => `$${v.toFixed(0)}`}
          />
          <ZAxis
            dataKey="z_score"
            type="number"
            name="Z-Score"
            range={[60, 280]}
          />
          <Tooltip
            formatter={(val: any, name: string) => {
              if (name === "amount")
                return [`$${(val as number).toFixed(2)}`, "Cost"];
              if (name === "z_score")
                return [(val as number).toFixed(2), "Z-Score"];
              return [val, name];
            }}
          />
          <Legend />
          <Scatter name="Anomaly" data={formattedData} shape="circle">
            {formattedData.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={getSeverityColor(entry.z_score)}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnomalyScatterPlot;

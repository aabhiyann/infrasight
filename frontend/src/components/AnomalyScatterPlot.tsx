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
import { useState } from "react";

interface AnomalyPoint {
  date: string;
  service: string;
  amount: number;
  z_score: number;
}

interface AnomalyScatterPlotProps {
  anomalies: AnomalyPoint[];
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

function getSeverityColor(z: number): string {
  if (z >= 3) return "var(--color-danger)"; // high - red
  if (z >= 2.5) return "var(--color-warning)"; // medium-high - orange
  if (z >= 2) return "var(--amber-600)"; // medium - amber
  return "var(--color-primary)"; // low - blue
}

const AnomalyScatterPlot = ({ anomalies }: AnomalyScatterPlotProps) => {
  const [viewMode, setViewMode] = useState<"cost" | "service">("cost");

  const formattedData = anomalies.map((a) => ({
    ...a,
    dateLabel: formatDate(a.date),
    serviceLabel:
      a.service.length > 12 ? a.service.slice(0, 12) + "..." : a.service,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <div className="tooltip-header">
            <strong>{data.service}</strong>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-item">
              <span className="tooltip-label">Date:</span>
              <span className="tooltip-value">{data.dateLabel}</span>
            </div>
            <div className="tooltip-item">
              <span className="tooltip-label">Cost:</span>
              <span className="tooltip-value">${data.amount.toFixed(2)}</span>
            </div>
            <div className="tooltip-item">
              <span className="tooltip-label">Z-Score:</span>
              <span className="tooltip-value">{data.z_score.toFixed(2)}</span>
            </div>
            <div className="tooltip-item">
              <span className="tooltip-label">Severity:</span>
              <span className="tooltip-value">
                {data.z_score >= 3
                  ? "High"
                  : data.z_score >= 2.5
                  ? "Medium-High"
                  : data.z_score >= 2
                  ? "Medium"
                  : "Low"}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-2">
      <div className="chart-header">
        <h3>Detected Anomalies</h3>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "cost" ? "active" : ""}`}
            onClick={() => setViewMode("cost")}
          >
            Cost vs Date
          </button>
          <button
            className={`toggle-btn ${viewMode === "service" ? "active" : ""}`}
            onClick={() => setViewMode("service")}
          >
            Service vs Date
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey={viewMode === "cost" ? "dateLabel" : "dateLabel"}
            name="Date"
            angle={-30}
            textAnchor="end"
            interval={0}
            height={60}
            tick={{ fontSize: 12 }}
            stroke="var(--color-text-secondary)"
          />
          <YAxis
            dataKey={viewMode === "cost" ? "amount" : "serviceLabel"}
            name={viewMode === "cost" ? "Cost ($)" : "Service"}
            tickFormatter={
              viewMode === "cost"
                ? (v: number) => `$${v.toFixed(0)}`
                : undefined
            }
            tick={{ fontSize: 12 }}
            stroke="var(--color-text-secondary)"
            width={viewMode === "service" ? 120 : 80}
          />
          <ZAxis
            dataKey="z_score"
            type="number"
            name="Z-Score"
            range={[60, 280]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Scatter
            name="Anomaly"
            data={formattedData}
            shape="circle"
            fill="var(--color-accent)"
          >
            {formattedData.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={getSeverityColor(entry.z_score)}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="chart-footer">
        <div className="legend-items">
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "var(--color-danger)" }}
            ></div>
            <span>High (Z ≥ 3.0)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "var(--color-warning)" }}
            ></div>
            <span>Medium-High (Z ≥ 2.5)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "var(--amber-600)" }}
            ></div>
            <span>Medium (Z ≥ 2.0)</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "var(--color-primary)" }}
            ></div>
            <span>Low (Z &lt; 2.0)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyScatterPlot;

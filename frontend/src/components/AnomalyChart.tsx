import React from "react";
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

interface Props {
  data: Anomaly[];
}

const AnomalyChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis dataKey="date" name="Date" />
        <YAxis dataKey="amount" name="Cost" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="Anomalies" data={data} fill="#ff0000" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default AnomalyChart;

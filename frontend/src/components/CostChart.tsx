import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CostRecord } from "../api/costApi";

interface Props {
  data: CostRecord[];
}

const CostChart: React.FC<Props> = ({ data }) => {
  // Transform raw data into total cost per day
  const dailyTotals = Object.values(
    data.reduce((acc: Record<string, number>, entry) => {
      const date = entry.date;
      acc[date] = (acc[date] || 0) + entry.amount;
      return acc;
    }, {})
  ).map((_, i) => ({
    date: Object.keys(
      data.reduce((acc: Record<string, number>, entry) => {
        const date = entry.date;
        acc[date] = (acc[date] || 0) + entry.amount;
        return acc;
      }, {})
    )[i],
    total: Object.values(
      data.reduce((acc: Record<string, number>, entry) => {
        const date = entry.date;
        acc[date] = (acc[date] || 0) + entry.amount;
        return acc;
      }, {})
    )[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={dailyTotals}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          strokeWidth={2}
          dot
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CostChart;

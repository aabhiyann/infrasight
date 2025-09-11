import React from "react";
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

interface Props {
  data: CostRecord[];
}

const BarChartTopServices: React.FC<Props> = ({ data }) => {
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
    <div>
      <h3>Top 10 Services by Total Cost</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="service" width={150} />
          <Tooltip />
          <Bar dataKey="total" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartTopServices;

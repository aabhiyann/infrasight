import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { CostRecord } from "../api/costApi";

interface Props {
  costData: CostRecord[];
}

const TopServicesBarChart = ({ costData }: Props) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthCosts = costData.filter((record) => {
    const d = new Date(record.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const serviceTotals = new Map<string, number>();
  for (const r of monthCosts) {
    const prev = serviceTotals.get(r.service) || 0;
    serviceTotals.set(r.service, prev + (r.amount || 0));
  }

  const topServices = Array.from(serviceTotals.entries())
    .map(([service, total]) => ({ service, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Top 5 Services This Month (by Total Cost)</h3>
      {topServices.length === 0 ? (
        <p>No data available for this month.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={topServices}
            margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="service"
              angle={-30}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="total" name="Total Cost" fill="var(--color-accent)" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TopServicesBarChart;

import type { CostRecord } from "../api/costApi";
import { Box, Text } from "./ui";

interface HeatmapServiceTrendsProps {
  data: CostRecord[];
}

const HeatmapServiceTrends = ({ data }: HeatmapServiceTrendsProps) => {
  // Step 1: Get unique dates and services
  const dates = Array.from(new Set(data.map((item) => item.date))).sort();
  const services = Array.from(new Set(data.map((item) => item.service))).sort();

  // Step 2: Create a lookup for quick access
  const lookup: Record<string, number> = {};
  data.forEach(({ date, service, amount }) => {
    lookup[`${service}-${date}`] = amount;
  });

  // Step 3: Generate color based on amount
  function getColor(value: number): string {
    if (value === 0 || isNaN(value)) return "#f1f5f9";
    if (value < 5) return "#cfe8ff";
    if (value < 15) return "#93c5fd";
    if (value < 30) return "#60a5fa";
    return "var(--color-primary)";
  }

  return (
    <Box className="overflow-x-auto mt-2xl">
      <Text as="h3" fontSize="lg" fontWeight="semibold" mb="lg">
        Cost Heatmap (Service × Date)
      </Text>
      <Box className="heatmap-container">
        <table className="heatmap-table">
          <thead>
            <tr>
              <th className="heatmap-sticky-header">Service</th>
              {dates.map((date) => (
                <th key={date} className="heatmap-date-header">
                  {date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service}>
                <td className="heatmap-sticky-cell">{service}</td>
                {dates.map((date) => {
                  const value = lookup[`${service}-${date}`] || 0;
                  return (
                    <td
                      key={`${service}-${date}`}
                      title={`$${value.toFixed(2)}`}
                      className="heatmap-cell"
                      style={{
                        backgroundColor: getColor(value),
                      }}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default HeatmapServiceTrends;

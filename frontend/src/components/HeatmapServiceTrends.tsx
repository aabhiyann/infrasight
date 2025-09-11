import type { CostRecord } from "../api/costApi";

interface Props {
  data: CostRecord[];
}

const HeatmapServiceTrends = ({ data }: Props) => {
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
    <div style={{ overflowX: "auto", marginTop: "2rem" }}>
      <h3>Cost Heatmap (Service × Date)</h3>
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ position: "sticky", left: 0, background: "var(--color-surface)" }}>
              Service
            </th>
            {dates.map((date) => (
              <th key={date} style={{ padding: "2px 4px", fontSize: "12px" }}>
                {date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service}>
              <td
                style={{
                  position: "sticky",
                  left: 0,
                  background: "var(--color-surface)",
                  fontWeight: "bold",
                  padding: "2px 4px",
                }}
              >
                {service}
              </td>
              {dates.map((date) => {
                const value = lookup[`${service}-${date}`] || 0;
                return (
                  <td
                    key={`${service}-${date}`}
                    title={`$${value.toFixed(2)}`}
                    style={{
                      backgroundColor: getColor(value),
                      width: "12px",
                      height: "12px",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HeatmapServiceTrends;

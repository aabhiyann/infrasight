import { ReactNode } from "react";

interface ChartCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

const ChartCard = ({ title, subtitle, children }: ChartCardProps) => {
  return (
    <div className="card">
      {title ? (
        <div style={{ marginBottom: "0.75rem" }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          {subtitle ? (
            <p style={{ margin: "0.25rem 0 0 0", color: "var(--color-muted)" }}>
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
};

export default ChartCard;



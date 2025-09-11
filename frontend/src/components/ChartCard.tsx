import type { ReactNode } from "react";
import Badge from "./Badge";

interface ChartCardProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "danger" | "info";
  children: ReactNode;
}

const ChartCard = ({
  title,
  subtitle,
  badge,
  badgeVariant = "default",
  children,
}: ChartCardProps) => {
  return (
    <div className="card">
      {title ? (
        <div className="card-header">
          <div>
            <h3 style={{ margin: 0 }}>{title}</h3>
            {subtitle ? (
              <p
                style={{ margin: "0.25rem 0 0 0", color: "var(--color-muted)" }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
          {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
        </div>
      ) : null}
      {children}
    </div>
  );
};

export default ChartCard;

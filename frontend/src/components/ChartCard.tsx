import type { ReactNode } from "react";
import Badge from "./Badge";
import { Text, Flex } from "./ui";
import { chartStyles } from "./chartConfig";

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
    <div className="card" style={chartStyles.containerStyle}>
      {title ? (
        <div className="card-header">
          <Flex justify="space-between" align="center">
            <div>
              <Text
                as="h3"
                fontSize="lg"
                fontWeight="semibold"
                mb={subtitle ? "xs" : "none"}
              >
                {title}
              </Text>
              {subtitle ? (
                <Text as="p" color="muted" fontSize="sm" mb="none">
                  {subtitle}
                </Text>
              ) : null}
            </div>
            {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
          </Flex>
        </div>
      ) : null}
      {children}
    </div>
  );
};

export default ChartCard;

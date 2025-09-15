import type { ReactNode } from "react";
import Badge from "./Badge";
import { Text, Flex } from "./ui";
import { chartStyles } from "./chartConfig";
import { useThemeAwareChartStyles } from "../hooks/useThemeAwareChartStyles";
import ChartErrorBoundary from "./ChartErrorBoundary";
import ChartSkeleton from "./ChartSkeleton";
import { RefreshCw, AlertCircle } from "lucide-react";

interface ChartCardProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "danger" | "info";
  children: ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  showSkeleton?: boolean;
}

const ChartCard = ({
  title,
  subtitle,
  badge,
  badgeVariant = "default",
  children,
  loading = false,
  error = null,
  onRetry,
  showSkeleton = true,
}: ChartCardProps) => {
  const { chartStyles: themeStyles } = useThemeAwareChartStyles();
  const renderContent = () => {
    if (loading && showSkeleton) {
      return <ChartSkeleton type="line" height={300} showLegend />;
    }

    if (error) {
      return (
        <div className="chart-error-state">
          <div className="error-content">
            <AlertCircle size={48} className="error-icon" />
            <h4>Chart Error</h4>
            <p>{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="btn btn-secondary d-flex items-center gap-sm"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            )}
          </div>
        </div>
      );
    }

    return children;
  };

  return (
    <div
      className="card"
      style={{
        ...chartStyles.containerStyle,
        ...themeStyles.containerStyle,
      }}
    >
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
      <ChartErrorBoundary>{renderContent()}</ChartErrorBoundary>
    </div>
  );
};

export default ChartCard;

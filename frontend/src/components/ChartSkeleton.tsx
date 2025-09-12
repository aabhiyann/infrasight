interface ChartSkeletonProps {
  type?: "line" | "bar" | "area" | "scatter" | "pie";
  height?: number;
  showLegend?: boolean;
  className?: string;
}

const ChartSkeleton = ({
  type = "line",
  height = 300,
  showLegend = false,
  className = "",
}: ChartSkeletonProps) => {
  const renderSkeleton = () => {
    switch (type) {
      case "line":
        return (
          <div className="chart-skeleton line-chart">
            <div className="skeleton-axis skeleton-y-axis" />
            <div className="skeleton-axis skeleton-x-axis" />
            <div className="skeleton-line">
              <div className="skeleton-line-segment" />
              <div className="skeleton-line-segment" />
              <div className="skeleton-line-segment" />
              <div className="skeleton-line-segment" />
              <div className="skeleton-line-segment" />
            </div>
            <div className="skeleton-dots">
              <div className="skeleton-dot" />
              <div className="skeleton-dot" />
              <div className="skeleton-dot" />
              <div className="skeleton-dot" />
              <div className="skeleton-dot" />
            </div>
          </div>
        );

      case "bar":
        return (
          <div className="chart-skeleton bar-chart">
            <div className="skeleton-axis skeleton-y-axis" />
            <div className="skeleton-axis skeleton-x-axis" />
            <div className="skeleton-bars">
              <div className="skeleton-bar" style={{ height: "60%" }} />
              <div className="skeleton-bar" style={{ height: "80%" }} />
              <div className="skeleton-bar" style={{ height: "45%" }} />
              <div className="skeleton-bar" style={{ height: "90%" }} />
              <div className="skeleton-bar" style={{ height: "70%" }} />
            </div>
          </div>
        );

      case "area":
        return (
          <div className="chart-skeleton area-chart">
            <div className="skeleton-axis skeleton-y-axis" />
            <div className="skeleton-axis skeleton-x-axis" />
            <div className="skeleton-area">
              <div className="skeleton-area-fill" />
            </div>
          </div>
        );

      case "scatter":
        return (
          <div className="chart-skeleton scatter-chart">
            <div className="skeleton-axis skeleton-y-axis" />
            <div className="skeleton-axis skeleton-x-axis" />
            <div className="skeleton-scatter">
              <div
                className="skeleton-scatter-dot"
                style={{ left: "20%", top: "30%" }}
              />
              <div
                className="skeleton-scatter-dot"
                style={{ left: "40%", top: "60%" }}
              />
              <div
                className="skeleton-scatter-dot"
                style={{ left: "60%", top: "20%" }}
              />
              <div
                className="skeleton-scatter-dot"
                style={{ left: "80%", top: "80%" }}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="chart-skeleton default">
            <div className="skeleton-content" />
          </div>
        );
    }
  };

  return (
    <div
      className={`chart-skeleton-container ${className}`}
      style={{ height: `${height}px` }}
    >
      {renderSkeleton()}
      {showLegend && (
        <div className="skeleton-legend">
          <div className="skeleton-legend-item" />
          <div className="skeleton-legend-item" />
          <div className="skeleton-legend-item" />
        </div>
      )}
    </div>
  );
};

export default ChartSkeleton;

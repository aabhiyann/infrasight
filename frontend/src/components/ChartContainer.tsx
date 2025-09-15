import React from "react";
import {
  getChartContainerStyle,
  type ChartContainerProps,
  chartStyles,
} from "./chartConfig";

/**
 * Enhanced chart container component with modern styling and hover effects
 * Provides consistent, sophisticated styling for all chart types.
 */
const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  height,
  className = "",
}) => {
  const containerStyle = getChartContainerStyle(height);

  return (
    <div
      className={`chart-container ${className}`}
      style={containerStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${chartStyles.hover.scale})`;
        e.currentTarget.style.boxShadow = chartStyles.hover.shadow;
        e.currentTarget.style.transition = `all ${chartStyles.hover.duration}ms ${chartStyles.hover.easing}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = chartStyles.containerStyle.boxShadow;
      }}
    >
      {/* Subtle gradient overlay for modern look */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
          borderRadius: "16px",
        }}
      />
      {children}
    </div>
  );
};

export default ChartContainer;

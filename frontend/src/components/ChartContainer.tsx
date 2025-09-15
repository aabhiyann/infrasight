import React, { useCallback, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      element.style.transform = `scale(${chartStyles.hover.scale})`;
      element.style.boxShadow = chartStyles.hover.shadow;
      element.style.transition = `all ${chartStyles.hover.duration}ms ${chartStyles.hover.easing}`;
    },
    []
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      element.style.transform = "scale(1)";
      element.style.boxShadow = chartStyles.containerStyle.boxShadow;
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className={`chart-container ${className}`}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label="Data visualization chart"
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

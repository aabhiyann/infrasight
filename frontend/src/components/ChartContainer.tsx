import React, { useCallback, useRef } from "react";
import {
  getChartContainerStyle,
  type ChartContainerProps,
} from "./chartConfig";
import { useThemeAwareChartStyles } from "../hooks/useThemeAwareChartStyles";

/**
 * Enhanced chart container component with modern styling and hover effects
 * Provides consistent, sophisticated styling for all chart types.
 */
const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  height,
  className = "",
}) => {
  const { chartStyles: themeStyles } = useThemeAwareChartStyles();
  // Base container sizing, then override visual styling with theme-aware values
  const baseContainerStyle = getChartContainerStyle(height);
  const containerStyle = {
    ...themeStyles.containerStyle,
    height: baseContainerStyle.height,
    width: baseContainerStyle.width,
  } as React.CSSProperties;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      element.style.transform = `scale(${themeStyles.hover.scale})`;
      element.style.boxShadow = themeStyles.hover.shadow;
      element.style.transition = `all ${themeStyles.hover.duration}ms ${themeStyles.hover.easing}`;
    },
    []
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      element.style.transform = "scale(1)";
      element.style.boxShadow = themeStyles.containerStyle.boxShadow;
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
      {/* Theme-aware gradient overlay for modern look */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            themeStyles.backgroundColor === "#ffffff"
              ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
          borderRadius: "16px",
        }}
      />
      {children}
    </div>
  );
};

export default ChartContainer;

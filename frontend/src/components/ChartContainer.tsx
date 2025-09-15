import React from "react";
import {
  getChartContainerStyle,
  type ChartContainerProps,
} from "./chartConfig";

/**
 * Unified chart container component that provides consistent styling
 * for all chart types (Chart.js, Recharts, etc.)
 */
const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  height,
  className = "",
}) => {
  const containerStyle = getChartContainerStyle(height);

  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  );
};

export default ChartContainer;

import React from "react";
import { Line } from "react-chartjs-2";
import { ChartRegistry } from "./chartRegistry";
import {
  COMMON_CHART_OPTIONS,
  AXIS_TITLES,
  ANIMATION,
  LEGEND_CONFIG,
  TOOLTIP_CONFIG,
  createFontConfig,
  createScaleTitle,
  createGridConfig,
  createTickConfig,
  createTooltipCallbacks,
  formatDateForChart,
} from "./sharedChartConfig";
import { useThemeAwareChartStyles } from "../../hooks/useThemeAwareChartStyles";
import ChartContainer from "../ChartContainer";

interface ExampleChartProps {
  data: any;
  height?: number;
  currencyFormat?: boolean;
}

/**
 * Example of how to use shared chart utilities
 * Demonstrates DRY principle in action
 */
const ExampleRefactoredChart: React.FC<ExampleChartProps> = ({
  data,
  height,
  currencyFormat = false,
}) => {
  // Ensure Chart.js is registered
  ChartRegistry.register();

  // Get theme-aware styles
  const { chartStyles: themeStyles } = useThemeAwareChartStyles();

  // Build options using shared utilities
  const options = {
    ...COMMON_CHART_OPTIONS,
    animation: {
      duration: ANIMATION.duration,
      easing: ANIMATION.easing,
    },
    plugins: {
      legend: {
        display: true,
        position: themeStyles.legendPosition,
        labels: {
          ...LEGEND_CONFIG,
          pointStyle: "circle" as const,
          font: createFontConfig(
            themeStyles.legendItemStyle.fontSize,
            "normal"
          ),
          color: themeStyles.legendItemStyle.color,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        ...TOOLTIP_CONFIG,
        ...themeStyles.tooltipStyle,
        callbacks: createTooltipCallbacks(currencyFormat),
      },
      canvasBackgroundColor: {
        color: themeStyles.backgroundColor,
      },
    },
    scales: {
      x: {
        ...createScaleTitle(AXIS_TITLES.X, themeStyles.textColor),
        grid: createGridConfig(themeStyles.gridColor),
        ticks: createTickConfig(themeStyles.mutedTextColor, formatDateForChart),
      },
      y: {
        ...createScaleTitle(AXIS_TITLES.Y, themeStyles.textColor),
        grid: createGridConfig(themeStyles.gridColor),
        beginAtZero: true,
        ticks: createTickConfig(themeStyles.mutedTextColor),
      },
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
        hoverRadius: 8,
      },
      line: {
        tension: 0.2,
      },
    },
  };

  return (
    <ChartContainer height={height}>
      <Line data={data} options={options} />
    </ChartContainer>
  );
};

export default ExampleRefactoredChart;

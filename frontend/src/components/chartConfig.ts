export type ChartMargin = {
  top: number;
  right: number;
  left: number;
  bottom: number;
};

export interface BaseChartProps {
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  currencyFormat?: boolean;
  dateTickAngle?: number; // degrees (e.g., 0, -30, -45)
  hideTitle?: boolean; // when title is rendered by parent card
}

export const defaultChartConfig: Required<Omit<BaseChartProps, "hideTitle">> & {
  margin: ChartMargin;
} = {
  height: 400, // Increased for better visibility
  showGrid: true,
  showLegend: true,
  currencyFormat: true,
  dateTickAngle: -45, // Standardized angle for better readability
  margin: { top: 20, right: 30, left: 60, bottom: 60 }, // More space for labels
};

// Unified chart styling system - used by ALL chart libraries
export const chartStyles = {
  // Color palette - consistent across all charts
  colors: [
    "var(--chart-1)", // Primary brand color
    "var(--chart-2)", // Teal
    "var(--chart-3)", // Amber
    "var(--chart-4)", // Blue variant
    "var(--chart-5)", // Pink variant
  ],

  // Semantic colors
  primary: "var(--chart-1)",
  secondary: "var(--chart-2)",
  accent: "var(--chart-3)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  danger: "var(--color-danger)",

  // Grid and borders
  gridColor: "var(--color-border)",
  gridOpacity: 0.5,

  // Text colors
  textColor: "var(--color-text)",
  mutedTextColor: "var(--color-muted)",
  axisTextColor: "var(--color-text)",

  // Background colors
  backgroundColor: "var(--color-surface)",
  tooltipBackground: "var(--color-surface)",

  // Typography
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  fontSize: {
    axis: 12,
    legend: 13,
    tooltip: 13,
    title: 14,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Legend configuration
  legendPosition: "top" as const,
  legendAlign: "center" as const,
  legendVerticalAlign: "top" as const,
  legendItemStyle: {
    fontSize: 13,
    fontWeight: 400,
    color: "var(--color-text)",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  },

  // Container styling
  containerStyle: {
    background: "var(--color-surface)",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid var(--color-border)",
  },

  // Animation settings
  animation: {
    duration: 1200,
    easing: "easeInOutQuart" as const,
  },

  // Tooltip styling
  tooltipStyle: {
    backgroundColor: "var(--color-surface)",
    titleColor: "var(--color-text)",
    bodyColor: "var(--color-text)",
    borderColor: "var(--color-border)",
    borderWidth: 1,
    cornerRadius: 12,
    displayColors: true,
    padding: 16,
    titleFont: {
      size: 14,
      weight: 600,
      family:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    },
    bodyFont: {
      size: 13,
      weight: 400,
      family:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    },
  },
};

// Utility functions for consistent formatting
export const formatCurrency = (value: number): string =>
  `$${Number(value).toFixed(2)}`;

export const formatDate = (value: string | Date): string => {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
};

export const formatDateShort = (value: string | Date): string => {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Chart container wrapper component props
export interface ChartContainerProps {
  children: React.ReactNode;
  height?: number;
  className?: string;
}

export const getChartContainerStyle = (height?: number) => ({
  height: height || defaultChartConfig.height,
  width: "100%",
  ...chartStyles.containerStyle,
});

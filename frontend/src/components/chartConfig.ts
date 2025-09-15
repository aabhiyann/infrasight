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
  // Enhanced color palette - sophisticated and modern
  colors: [
    "var(--brand-500)", // Primary blue
    "var(--teal-600)", // Sophisticated teal
    "var(--amber-600)", // Warm amber
    "var(--rose-500)", // Elegant rose
    "var(--slate-800)", // Professional slate
  ],

  // Enhanced semantic colors with depth
  primary: "var(--brand-500)",
  secondary: "var(--brand-600)",
  accent: "var(--brand-400)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  danger: "var(--color-danger)",

  // Gradient definitions for modern look
  gradients: {
    primary:
      "linear-gradient(135deg, var(--brand-500) 0%, var(--brand-600) 100%)",
    secondary: "linear-gradient(135deg, var(--teal-600) 0%, #2d7a6b 100%)",
    accent: "linear-gradient(135deg, var(--amber-600) 0%, #d97706 100%)",
    danger: "linear-gradient(135deg, var(--color-danger) 0%, #dc2626 100%)",
    success: "linear-gradient(135deg, var(--color-success) 0%, #059669 100%)",
  },

  // Enhanced color variants with transparency
  colorVariants: {
    primary: {
      light: "var(--brand-400)",
      main: "var(--brand-500)",
      dark: "var(--brand-600)",
      alpha10: "rgba(0, 112, 184, 0.1)",
      alpha20: "rgba(0, 112, 184, 0.2)",
      alpha30: "rgba(0, 112, 184, 0.3)",
    },
    secondary: {
      light: "var(--teal-600)",
      main: "#2d7a6b",
      dark: "#1f5f54",
      alpha10: "rgba(56, 131, 123, 0.1)",
      alpha20: "rgba(56, 131, 123, 0.2)",
      alpha30: "rgba(56, 131, 123, 0.3)",
    },
    accent: {
      light: "var(--amber-600)",
      main: "#d97706",
      dark: "#b45309",
      alpha10: "rgba(225, 158, 32, 0.1)",
      alpha20: "rgba(225, 158, 32, 0.2)",
      alpha30: "rgba(225, 158, 32, 0.3)",
    },
  },

  // Enhanced grid and borders with modern styling
  gridColor: "var(--color-border)",
  gridOpacity: 0.3,
  gridStyle: {
    color: "var(--color-border)",
    lineWidth: 1,
    borderDash: [2, 4],
  },

  // Enhanced text colors with hierarchy
  textColor: "var(--color-text)",
  mutedTextColor: "var(--color-muted)",
  axisTextColor: "var(--slate-600)",
  titleColor: "var(--color-text)",

  // Enhanced background colors with depth
  backgroundColor: "var(--color-surface)",
  tooltipBackground: "var(--color-surface)",
  chartBackground: "transparent",

  // Enhanced typography matching project design system
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  fontSize: {
    axis: 11,
    legend: 12,
    tooltip: 12,
    title: 14,
    subtitle: 13,
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  // Enhanced legend configuration with modern styling
  legendPosition: "top" as const,
  legendAlign: "center" as const,
  legendVerticalAlign: "top" as const,
  legendItemStyle: {
    fontSize: 12,
    fontWeight: 500,
    color: "var(--color-text)",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    padding: 16,
    usePointStyle: true,
    pointStyle: "circle",
  },

  // Enhanced container styling with sophisticated shadows and borders
  containerStyle: {
    background: "var(--color-surface)",
    borderRadius: "16px",
    padding: "1.5rem",
    boxShadow:
      "0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)",
    border: "1px solid var(--color-border)",
    backdropFilter: "blur(10px)",
    position: "relative" as const,
    overflow: "hidden" as const,
  },

  // Enhanced animation settings with Chart.js compatible easing
  animation: {
    duration: 1500,
    easing: "easeInOutQuart" as const,
    delay: 100,
    loop: false,
  },

  // Modern hover effects
  hover: {
    duration: 200,
    easing: "ease-out",
    scale: 1.02,
    shadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  },

  // Enhanced focus states for accessibility
  focus: {
    outline: "2px solid var(--brand-400)",
    outlineOffset: "2px",
    borderRadius: "4px",
  },

  // Enhanced tooltip styling with modern design
  tooltipStyle: {
    backgroundColor: "var(--color-surface)",
    titleColor: "var(--color-text)",
    bodyColor: "var(--color-text)",
    borderColor: "var(--color-border)",
    borderWidth: 1,
    cornerRadius: 16,
    displayColors: true,
    padding: 20,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)",
    backdropFilter: "blur(10px)",
    titleFont: {
      size: 14,
      weight: 600,
      family:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    },
    bodyFont: {
      size: 12,
      weight: 500,
      family:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    },
    footerFont: {
      size: 11,
      weight: 400,
      family:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
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

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
  // Enhanced color palette - sophisticated and modern (resolved to actual values)
  colors: [
    "#0070b8", // Primary blue
    "#38837b", // Sophisticated teal
    "#e19e20", // Warm amber
    "#e778a6", // Elegant rose
    "#3c4856", // Professional slate
  ],

  // Enhanced semantic colors with depth (resolved to actual values)
  primary: "#0070b8",
  secondary: "#0052b6",
  accent: "#34a3f1",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",

  // Gradient definitions for modern look
  gradients: {
    primary: "linear-gradient(135deg, #0070b8 0%, #0052b6 100%)",
    secondary: "linear-gradient(135deg, #38837b 0%, #2d7a6b 100%)",
    accent: "linear-gradient(135deg, #e19e20 0%, #d97706 100%)",
    danger: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },

  // Enhanced color variants with transparency
  colorVariants: {
    primary: {
      light: "#34a3f1",
      main: "#0070b8",
      dark: "#0052b6",
      alpha10: "rgba(0, 112, 184, 0.1)",
      alpha20: "rgba(0, 112, 184, 0.2)",
      alpha30: "rgba(0, 112, 184, 0.3)",
    },
    secondary: {
      light: "#38837b",
      main: "#2d7a6b",
      dark: "#1f5f54",
      alpha10: "rgba(56, 131, 123, 0.1)",
      alpha20: "rgba(56, 131, 123, 0.2)",
      alpha30: "rgba(56, 131, 123, 0.3)",
    },
    accent: {
      light: "#e19e20",
      main: "#d97706",
      dark: "#b45309",
      alpha10: "rgba(225, 158, 32, 0.1)",
      alpha20: "rgba(225, 158, 32, 0.2)",
      alpha30: "rgba(225, 158, 32, 0.3)",
    },
  },

  // Enhanced grid and borders with modern styling
  gridColor: "#e5e7eb",
  gridOpacity: 0.3,
  gridStyle: {
    color: "#e5e7eb",
    lineWidth: 1,
    borderDash: [2, 4],
  },

  // Enhanced text colors with hierarchy
  textColor: "#3c4856",
  mutedTextColor: "#a0acbd",
  axisTextColor: "#6b7280",
  titleColor: "#3c4856",

  // Enhanced background colors with depth
  backgroundColor: "#ffffff",
  tooltipBackground: "#ffffff",
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
    color: "#3c4856",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    padding: 16,
    usePointStyle: true,
    pointStyle: "circle",
  },

  // Enhanced container styling with sophisticated shadows and borders
  containerStyle: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "1.5rem",
    boxShadow:
      "0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e5e7eb",
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
    outline: "2px solid #34a3f1",
    outlineOffset: "2px",
    borderRadius: "4px",
  },

  // Enhanced tooltip styling with modern design
  tooltipStyle: {
    backgroundColor: "#ffffff",
    titleColor: "#3c4856",
    bodyColor: "#3c4856",
    borderColor: "#e5e7eb",
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

// Utility function to get a color with transparency
export const getColorWithAlpha = (color: string, alpha: number): string => {
  // If color is already rgba, extract the rgb values
  if (color.startsWith("rgba")) {
    const rgbMatch = color.match(/rgba?\(([^)]+)\)/);
    if (rgbMatch) {
      const values = rgbMatch[1].split(",").map((v) => v.trim());
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
    }
  }

  // If color is hex, convert to rgba
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Fallback
  return color;
};

// Centralized color palette - update these values to change the entire color scheme
export const CHART_COLOR_PALETTE = {
  // Primary brand colors
  primary: "#0070b8",
  primaryLight: "#34a3f1",
  primaryDark: "#0052b6",

  // Secondary colors
  secondary: "#38837b",
  secondaryLight: "#4a9b91",
  secondaryDark: "#2d7a6b",

  // Accent colors
  accent: "#e19e20",
  accentLight: "#f4c430",
  accentDark: "#d97706",

  // Semantic colors
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",

  // Neutral colors
  text: "#3c4856",
  textMuted: "#a0acbd",
  border: "#e5e7eb",
  background: "#ffffff",

  // Additional chart colors
  rose: "#e778a6",
  slate: "#3c4856",
} as const;

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

  // Performance optimization settings
  performance: {
    // Disable animations on low-end devices
    reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")
      .matches,
    // Use canvas rendering for better performance
    useCanvas: true,
    // Optimize for large datasets
    dataLimit: 1000,
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

// Utility function to generate chart colors dynamically
export const generateChartColors = (count: number): string[] => {
  const baseColors = getThemeAwareColors();
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    if (i < 5) {
      // Use predefined colors first
      const colorKeys = [
        "primary",
        "secondary",
        "accent",
        "success",
        "warning",
      ] as const;
      colors.push(baseColors[colorKeys[i]]);
    } else {
      // Generate variations for additional colors
      const hue = (i * 137.5) % 360; // Golden angle for good distribution
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      const saturation = isDark ? 60 : 70; // Lower saturation for dark mode
      const lightness = isDark ? 60 : 50; // Higher lightness for dark mode
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
  }

  return colors;
};

// Utility function to format large numbers for better readability
export const formatLargeNumber = (value: number): string => {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  }
  return `$${value.toFixed(2)}`;
};

// Utility function to check if device prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
};

// Utility function to optimize chart data for performance
export const optimizeChartData = (data: any[], limit: number = 1000): any[] => {
  if (data.length <= limit) {
    return data;
  }

  // Sample data points evenly
  const step = Math.ceil(data.length / limit);
  return data.filter((_, index) => index % step === 0);
};

// Theme-aware color palette system
export const getThemeAwareColors = () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const isHighContrast =
    document.documentElement.getAttribute("data-theme") === "high-contrast";

  if (isHighContrast) {
    return {
      // High contrast colors - bold and accessible
      primary: "#0000ff",
      primaryLight: "#4d4dff",
      primaryDark: "#0000cc",
      secondary: "#006600",
      secondaryLight: "#00cc00",
      secondaryDark: "#004400",
      accent: "#ff6600",
      accentLight: "#ff9933",
      accentDark: "#cc4400",
      success: "#006600",
      warning: "#ff6600",
      danger: "#cc0000",
      info: "#0000ff",
      text: "#000000",
      textMuted: "#333333",
      border: "#000000",
      background: "#ffffff",
      rose: "#ff0066",
      slate: "#333333",
    };
  }

  if (isDark) {
    return {
      // Dark mode colors - high contrast and readable
      primary: "#60a5fa", // Brighter blue for dark backgrounds
      primaryLight: "#93c5fd",
      primaryDark: "#3b82f6",
      secondary: "#34d399", // Brighter teal
      secondaryLight: "#6ee7b7",
      secondaryDark: "#10b981",
      accent: "#fbbf24", // Warmer yellow
      accentLight: "#fcd34d",
      accentDark: "#f59e0b",
      success: "#34d399",
      warning: "#fbbf24",
      danger: "#f87171", // Softer red
      info: "#60a5fa",
      text: "#f8fafc", // High contrast white text
      textMuted: "#cbd5e1", // Much brighter muted text
      border: "#475569", // Brighter borders for better definition
      background: "#1e293b", // Dark background
      rose: "#fb7185", // Softer pink
      slate: "#cbd5e1", // Brighter slate for better readability
    };
  }

  // Light mode colors (default)
  return {
    primary: "#0070b8",
    primaryLight: "#34a3f1",
    primaryDark: "#0052b6",
    secondary: "#38837b",
    secondaryLight: "#4a9b91",
    secondaryDark: "#2d7a6b",
    accent: "#e19e20",
    accentLight: "#f4c430",
    accentDark: "#d97706",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
    text: "#3c4856",
    textMuted: "#a0acbd",
    border: "#e5e7eb",
    background: "#ffffff",
    rose: "#e778a6",
    slate: "#3c4856",
  };
};

// Legacy static palette for backward compatibility
export const CHART_COLOR_PALETTE = getThemeAwareColors();

/**
 * Custom Chart.js plugin to set canvas background color
 */
export const canvasBackgroundPlugin = {
  id: "canvasBackgroundColor",
  beforeDraw: (chart: any, _args: any, options: any) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = options.color || "#ffffff";
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

// Theme-aware chart styles function
export const getThemeAwareChartStyles = () => {
  const colors = getThemeAwareColors();

  return {
    // Modern color palette with professional hues
    colors: [
      colors.primary,
      colors.secondary,
      colors.accent,
      colors.rose,
      colors.slate,
    ],

    // Primary colors
    primary: colors.primary,
    secondary: colors.primaryDark,
    accent: colors.primaryLight,

    // Semantic colors
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,

    // Gradient definitions for modern look
    gradients: {
      primary: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
      secondary: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%)`,
      accent: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
      danger: `linear-gradient(135deg, ${colors.danger} 0%, #dc2626 100%)`,
      success: `linear-gradient(135deg, ${colors.success} 0%, #059669 100%)`,
    },

    // Enhanced color variants with transparency
    colorVariants: {
      primary: {
        light: colors.primaryLight,
        main: colors.primary,
        dark: colors.primaryDark,
        alpha10: getColorWithAlpha(colors.primary, 0.1),
        alpha20: getColorWithAlpha(colors.primary, 0.2),
        alpha30: getColorWithAlpha(colors.primary, 0.3),
      },
      secondary: {
        light: colors.secondaryLight,
        main: colors.secondary,
        dark: colors.secondaryDark,
        alpha10: getColorWithAlpha(colors.secondary, 0.1),
        alpha20: getColorWithAlpha(colors.secondary, 0.2),
        alpha30: getColorWithAlpha(colors.secondary, 0.3),
      },
      accent: {
        light: colors.accentLight,
        main: colors.accent,
        dark: colors.accentDark,
        alpha10: getColorWithAlpha(colors.accent, 0.1),
        alpha20: getColorWithAlpha(colors.accent, 0.2),
        alpha30: getColorWithAlpha(colors.accent, 0.3),
      },
    },

    // Grid and axis styling
    gridColor: colors.border,

    // Text colors
    textColor: colors.text,
    mutedTextColor: colors.textMuted,
    axisTextColor: colors.textMuted,
    titleColor: colors.text,

    // Background colors
    backgroundColor: colors.background,
    tooltipBackground: colors.background,

    // Focus and interaction
    focus: {
      outline: `2px solid ${colors.primaryLight}`,
    },

    // Tooltip styling
    tooltipStyle: {
      backgroundColor: colors.background,
      titleColor: colors.text,
      bodyColor: colors.text,
      borderColor: colors.border,
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      titleFont: {
        size: 14,
        weight: "bold" as const,
      },
      bodyFont: {
        size: 13,
        weight: "normal" as const,
      },
    },

    // Animation settings
    animation: {
      duration: prefersReducedMotion() ? 0 : 1500,
      easing: "easeInOutQuart" as const,
      delay: prefersReducedMotion() ? 0 : 100,
      loop: false,
    },

    // Performance optimization settings
    performance: {
      reducedMotion: prefersReducedMotion(),
      useCanvas: true,
      dataLimit: 1000,
    },

    // Modern hover effects
    hover: {
      duration: prefersReducedMotion() ? 0 : 200,
      easing: "ease-out",
      scale: 1.02,
      shadow: `0 20px 40px rgba(0, 0, 0, ${
        colors.text === "#000000" ? "0.1" : "0.3"
      })`,
    },

    // Container styling
    containerStyle: {
      background: colors.background,
      border: `1px solid ${colors.border}`,
      borderRadius: "16px",
      boxShadow: `0 4px 20px rgba(0, 0, 0, ${
        colors.text === "#000000" ? "0.05" : "0.15"
      })`,
      padding: "24px",
      backdropFilter: "blur(10px)",
      position: "relative" as const,
      overflow: "hidden" as const,
    },

    // Legend styling
    legendPosition: "bottom" as const,
    legendItemStyle: {
      fontSize: 13,
      fontWeight: "normal" as const,
      fontFamily: "Inter, system-ui, sans-serif",
      color: colors.text,
    },

    // Typography
    fontSize: {
      title: 14,
      axis: 12,
      legend: 13,
    },
    fontWeight: {
      normal: "normal" as const,
      semibold: "bold" as const,
      bold: "bold" as const,
    },
    fontFamily: "Inter, system-ui, sans-serif",

    // Grid styling
    gridStyle: {
      color: colors.border,
      lineWidth: 1,
      drawBorder: false,
      borderDash: [] as number[],
    },

    // Plugin for canvas background
    canvasBackgroundPlugin: canvasBackgroundPlugin,
  };
};

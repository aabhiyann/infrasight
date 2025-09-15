/**
 * Shared chart configuration constants
 * Demonstrates DRY principle by centralizing common chart settings
 */

// Common Chart.js registration components
export const CHART_JS_COMPONENTS = [
  "CategoryScale",
  "LinearScale",
  "PointElement",
  "LineElement",
  "BarElement",
  "Title",
  "Tooltip",
  "Legend",
  "Filler",
  "TimeScale",
] as const;

// Common chart options that are reused across components
export const COMMON_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
} as const;

// Common scale configurations
export const COMMON_SCALE_CONFIG = {
  display: true,
  grid: {
    drawBorder: false,
    lineWidth: 1,
  },
  ticks: {
    padding: 8,
  },
} as const;

// Common axis titles
export const AXIS_TITLES = {
  X: "Date",
  Y: "Cost ($)",
} as const;

// Common padding values
export const PADDING = {
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
} as const;

// Common animation settings
export const ANIMATION = {
  duration: 1000,
  easing: "easeInOutQuart" as const,
} as const;

// Common legend settings
export const LEGEND_CONFIG = {
  usePointStyle: true,
  padding: PADDING.LARGE,
} as const;

// Common tooltip settings
export const TOOLTIP_CONFIG = {
  mode: "index" as const,
  intersect: false,
  displayColors: true,
} as const;

/**
 * Helper function to create consistent font configurations
 */
export const createFontConfig = (
  size: number,
  weight: "normal" | "bold" = "normal"
) => ({
  size,
  weight,
  family: "Inter, system-ui, sans-serif",
});

/**
 * Helper function to create consistent color configurations
 */
export const createColorConfig = (color: string) => ({
  color,
  font: createFontConfig(12),
});

/**
 * Helper function to create consistent scale titles
 */
export const createScaleTitle = (text: string, color: string) => ({
  display: true,
  text,
  color,
  font: createFontConfig(14, "bold"),
  padding: PADDING.MEDIUM,
});

/**
 * Helper function to create consistent grid configurations
 */
export const createGridConfig = (color: string) => ({
  color,
  ...COMMON_SCALE_CONFIG.grid,
});

/**
 * Helper function to create consistent tick configurations
 */
export const createTickConfig = (
  color: string,
  callback?: (value: any) => string
) => ({
  color,
  font: createFontConfig(12),
  ...COMMON_SCALE_CONFIG.ticks,
  ...(callback && { callback }),
});

/**
 * Helper function to create consistent tooltip callbacks
 */
export const createTooltipCallbacks = (
  currencyFormat: boolean = false,
  formatCurrency?: (value: number) => string
) => ({
  label: function (context: any) {
    const label = context.dataset.label || "";
    const value = context.parsed.y;
    const formattedValue =
      currencyFormat && formatCurrency ? formatCurrency(value) : value;
    return `${label}: ${formattedValue}`;
  },
  title: function (context: any) {
    return context[0].label;
  },
});

/**
 * Helper function to create consistent date formatting
 */
export const formatDateForChart = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * Helper function to create consistent date formatting for tooltips
 */
export const formatDateForTooltip = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
};

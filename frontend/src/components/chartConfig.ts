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
  height: 300,
  showGrid: true,
  showLegend: true,
  currencyFormat: true,
  dateTickAngle: -45, // Standardized angle for better readability
  margin: { top: 20, right: 30, left: 60, bottom: 40 }, // More space for labels
};

// Standardized chart styling
export const chartStyles = {
  colors: [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ],
  gridColor: "var(--color-border)",
  textColor: "var(--color-text)",
  mutedTextColor: "var(--color-muted)",
  legendPosition: "bottom" as const,
  legendAlign: "center" as const,
  legendVerticalAlign: "bottom" as const,
  legendItemStyle: {
    fontSize: "12px",
    color: "var(--color-text)",
  },
};

export const formatCurrency = (value: number): string =>
  `$${Number(value).toFixed(2)}`;

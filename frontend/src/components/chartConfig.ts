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
  dateTickAngle: 0,
  margin: { top: 20, right: 30, left: 0, bottom: 5 },
};

export const formatCurrency = (value: number): string =>
  `$${Number(value).toFixed(2)}`;

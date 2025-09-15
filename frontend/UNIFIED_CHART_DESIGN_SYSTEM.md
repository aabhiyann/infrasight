# Unified Chart Design System

## Overview

This document outlines the unified design system implemented to ensure consistent styling across all chart components in the InfraSight application using Chart.js as the single charting library.

## Problem Solved

Previously, the application had design inconsistencies between different chart libraries:

- Chart.js components used CSS custom properties and consistent styling
- Recharts components had different styling approaches and inconsistent design patterns
- Mixed chart libraries (Chart.js and Recharts) created maintenance complexity
- Inconsistent colors, fonts, spacing, and container styling across different chart types
- No centralized design system for charts

## Solution

### 1. Enhanced Chart Configuration (`chartConfig.ts`)

The `chartConfig.ts` file now contains a comprehensive design system with:

#### Color Palette

```typescript
colors: [
  "var(--chart-1)", // Primary brand color
  "var(--chart-2)", // Teal
  "var(--chart-3)", // Amber
  "var(--chart-4)", // Blue variant
  "var(--chart-5)", // Pink variant
];
```

#### Semantic Colors

- `primary`: `var(--chart-1)`
- `secondary`: `var(--chart-2)`
- `accent`: `var(--chart-3)`
- `success`: `var(--color-success)`
- `warning`: `var(--color-warning)`
- `danger`: `var(--color-danger)`

#### Typography

- **Font Family**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif`
- **Font Sizes**: Consistent scale for axis (12px), legend (13px), tooltip (13px), title (14px)
- **Font Weights**: Normal (400), Medium (500), Semibold (600), Bold (700)

#### Container Styling

```typescript
containerStyle: {
  background: "var(--color-surface)",
  borderRadius: "12px",
  padding: "1rem",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)",
  border: "1px solid var(--color-border)",
}
```

### 2. ChartContainer Component

A reusable `ChartContainer` component that provides consistent styling for all charts:

```typescript
<ChartContainer height={height}>
  <YourChartComponent />
</ChartContainer>
```

### 3. Updated Components

#### All Chart.js Components

- `AnomalyChartChartJS.tsx` - Scatter plot for anomaly detection
- `CostChartChartJSSimple.tsx` - Line chart for cost trends
- `TopServicesBarChartChartJS.tsx` - Bar chart for top services
- `AnomalyScatterPlotChartJS.tsx` - Interactive scatter plot
- `ForecastChart.tsx` - Line chart for forecasts (migrated from Recharts)
- `BarChartTopServices.tsx` - Horizontal bar chart (migrated from Recharts)
- `MultiServiceTimeline.tsx` - Multi-line chart for service timelines (migrated from Recharts)

All now use:

- Unified `chartStyles` configuration
- `ChartContainer` for consistent containers
- Consistent typography and colors
- Single Chart.js library for all chart types

### 4. Design Principles

#### Consistency

- All charts use the same color palette
- Consistent typography across all chart types
- Uniform container styling and spacing

#### Accessibility

- Proper color contrast ratios
- Consistent font sizes for readability
- Clear visual hierarchy

#### Maintainability

- Centralized design tokens
- Easy to update colors and styles globally
- Reusable components

## Usage Examples

### Chart.js Implementation

```typescript
import { chartStyles } from "./chartConfig";
import ChartContainer from "./ChartContainer";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: chartStyles.animation.duration,
    easing: chartStyles.animation.easing,
  },
  plugins: {
    legend: {
      position: chartStyles.legendPosition,
      labels: chartStyles.legendItemStyle,
    },
    tooltip: chartStyles.tooltipStyle,
  },
  scales: {
    x: {
      ticks: {
        color: chartStyles.mutedTextColor,
        font: {
          size: chartStyles.fontSize.axis,
          family: chartStyles.fontFamily,
        },
      },
    },
  },
};

return (
  <ChartContainer height={400}>
    <Line data={data} options={options} />
  </ChartContainer>
);
```

## Benefits

1. **Visual Consistency**: All charts now have the same look and feel
2. **Maintainability**: Changes to design system automatically apply to all charts
3. **Developer Experience**: Easy to implement new charts with consistent styling
4. **Brand Cohesion**: Charts align with the overall application design
5. **Accessibility**: Consistent accessibility standards across all charts
6. **Library Consolidation**: Single Chart.js library reduces bundle size and complexity
7. **Performance**: Consistent rendering engine across all chart types

## Future Enhancements

1. **Dark Mode Support**: Enhanced dark mode styling for charts
2. **Animation Library**: Standardized animations across chart libraries
3. **Responsive Breakpoints**: Chart-specific responsive behavior
4. **Custom Themes**: Support for different chart themes
5. **Accessibility Improvements**: Enhanced screen reader support

## Migration Guide

To migrate existing charts to the unified system:

1. Import `chartStyles` and `ChartContainer`
2. Replace hardcoded styles with `chartStyles` properties
3. Wrap chart components with `ChartContainer`
4. Update color references to use semantic color names
5. Ensure typography uses the unified font system

This unified design system ensures that all charts in the InfraSight application maintain visual consistency while being easy to maintain and extend.

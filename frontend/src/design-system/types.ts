// Design System Types for InfraSight
// This ensures consistent spacing, colors, and styling across the entire project

export type Spacing =
  | "xs" // 0.25rem (4px)
  | "sm" // 0.5rem (8px)
  | "md" // 0.75rem (12px)
  | "lg" // 1rem (16px)
  | "xl" // 1.5rem (24px)
  | "2xl" // 2rem (32px)
  | "3xl" // 3rem (48px)
  | "4xl"; // 4rem (64px)

export type FontSize =
  | "xs" // 0.75rem (12px)
  | "sm" // 0.875rem (14px)
  | "base" // 1rem (16px)
  | "lg" // 1.125rem (18px)
  | "xl" // 1.25rem (20px)
  | "2xl" // 1.5rem (24px)
  | "3xl" // 1.875rem (30px)
  | "4xl" // 2.25rem (36px)
  | "5xl"; // 3rem (48px)

export type FontWeight =
  | "normal" // 400
  | "medium" // 500
  | "semibold" // 600
  | "bold"; // 700

export type BorderRadius =
  | "none" // 0
  | "sm" // 0.125rem (2px)
  | "md" // 0.375rem (6px)
  | "lg" // 0.5rem (8px)
  | "xl" // 0.75rem (12px)
  | "2xl" // 1rem (16px)
  | "full"; // 9999px

export type Shadow =
  | "none"
  | "sm" // 0 1px 2px rgba(0, 0, 0, 0.05)
  | "md" // 0 4px 6px rgba(0, 0, 0, 0.1)
  | "lg" // 0 10px 15px rgba(0, 0, 0, 0.1)
  | "xl" // 0 20px 25px rgba(0, 0, 0, 0.1)
  | "2xl"; // 0 25px 50px rgba(0, 0, 0, 0.25)

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export type ButtonSize =
  | "sm" // 0.5rem 0.75rem
  | "md" // 0.75rem 1rem
  | "lg"; // 1rem 1.5rem

// Component Props Types
export interface SpacingProps {
  p?: Spacing;
  px?: Spacing;
  py?: Spacing;
  pt?: Spacing;
  pr?: Spacing;
  pb?: Spacing;
  pl?: Spacing;
  m?: Spacing;
  mx?: Spacing;
  my?: Spacing;
  mt?: Spacing;
  mr?: Spacing;
  mb?: Spacing;
  ml?: Spacing;
  gap?: Spacing;
}

export interface TypographyProps {
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  textAlign?: "left" | "center" | "right";
}

export interface LayoutProps {
  display?: "block" | "flex" | "grid" | "none";
  flexDirection?: "row" | "column";
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around";
  width?: "full" | "auto" | "fit";
  height?: "full" | "auto" | "fit";
}

export interface ButtonProps extends SpacingProps, TypographyProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export interface CardProps extends SpacingProps {
  shadow?: Shadow;
  borderRadius?: BorderRadius;
  padding?: Spacing;
}

// Design Tokens
export const spacing: Record<Spacing, string> = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  "2xl": "2rem", // 32px
  "3xl": "3rem", // 48px
  "4xl": "4rem", // 64px
};

export const fontSize: Record<FontSize, string> = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
};

export const fontWeight: Record<FontWeight, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const borderRadius: Record<BorderRadius, string> = {
  none: "0",
  sm: "0.125rem", // 2px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  full: "9999px",
};

export const shadows: Record<Shadow, string> = {
  none: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
  "2xl": "0 25px 50px rgba(0, 0, 0, 0.25)",
};

import React from "react";
import {
  cn,
  getTypographyClasses,
  getSpacingClasses,
} from "../../design-system";
import type { TypographyProps, SpacingProps } from "../../design-system/types";

interface TextProps extends TypographyProps, SpacingProps {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color?: "primary" | "secondary" | "muted" | "danger" | "success" | "warning";
  truncate?: boolean;
  style?: React.CSSProperties;
}

const Text: React.FC<TextProps> = ({
  children,
  className = "",
  as: Component = "p",
  color,
  truncate = false,
  style,
  ...props
}) => {
  const typographyClasses = getTypographyClasses(props);
  const spacingClasses = getSpacingClasses(props);

  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    muted: "text-muted",
    danger: "text-danger",
    success: "text-success",
    warning: "text-warning",
  };

  const classes = cn(
    typographyClasses,
    spacingClasses,
    color && colorClasses[color],
    truncate && "truncate",
    className
  );

  return (
    <Component className={classes} style={style}>
      {children}
    </Component>
  );
};

export default Text;

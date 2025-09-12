import React from "react";
import { cn, getSpacingClasses } from "../../design-system";
import type { SpacingProps } from "../../design-system/types";

interface StackProps extends SpacingProps {
  children: React.ReactNode;
  className?: string;
  direction?: "row" | "column";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "space-between" | "space-around";
  spacing?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  as?: React.ElementType;
}

const Stack: React.FC<StackProps> = ({
  children,
  className = "",
  direction = "column",
  align = "stretch",
  justify = "start",
  spacing = "md",
  as: Component = "div",
  ...spacingProps
}) => {
  const spacingClasses = getSpacingClasses(spacingProps);

  const classes = cn(
    "d-flex",
    `flex-${direction}`,
    `items-${align}`,
    `justify-${justify}`,
    `gap-${spacing}`,
    spacingClasses,
    className
  );

  return <Component className={classes}>{children}</Component>;
};

export default Stack;

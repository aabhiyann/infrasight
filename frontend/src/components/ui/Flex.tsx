import React from "react";
import { cn, getSpacingClasses } from "../../design-system";
import type { SpacingProps } from "../../design-system/types";

interface FlexProps extends SpacingProps {
  children: React.ReactNode;
  className?: string;
  direction?: "row" | "column";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "space-between" | "space-around";
  wrap?: boolean;
  gap?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  as?: React.ElementType;
  style?: React.CSSProperties;
}

const Flex: React.FC<FlexProps> = ({
  children,
  className = "",
  direction = "row",
  align = "start",
  justify = "start",
  wrap = false,
  gap,
  as: Component = "div",
  style,
  ...spacingProps
}) => {
  const spacingClasses = getSpacingClasses(spacingProps);

  const classes = cn(
    "d-flex",
    `flex-${direction}`,
    `items-${align}`,
    `justify-${justify}`,
    wrap && "flex-wrap",
    gap && `gap-${gap}`,
    spacingClasses,
    className
  );

  return (
    <Component className={classes} style={style}>
      {children}
    </Component>
  );
};

export default Flex;

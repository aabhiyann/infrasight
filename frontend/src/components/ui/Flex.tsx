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

  // Map props to utility class suffixes
  const justifyClassSuffix = (() => {
    switch (justify) {
      case "space-between":
        return "between";
      case "space-around":
        return "around";
      case "start":
      case "center":
      case "end":
        return justify;
      default:
        return "start";
    }
  })();

  const classes = cn(
    "d-flex",
    `flex-${direction}`,
    `items-${align}`,
    `justify-${justifyClassSuffix}`,
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

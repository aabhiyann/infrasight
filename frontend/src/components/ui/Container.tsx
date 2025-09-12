import React from "react";
import { cn, getSpacingClasses } from "../../design-system";
import type { SpacingProps } from "../../design-system/types";

interface ContainerProps extends SpacingProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  center?: boolean;
  as?: React.ElementType;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  maxWidth = "xl",
  center = true,
  as: Component = "div",
  ...spacingProps
}) => {
  const spacingClasses = getSpacingClasses(spacingProps);

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  const classes = cn(
    "container",
    maxWidthClasses[maxWidth],
    center && "mx-auto",
    spacingClasses,
    className
  );

  return <Component className={classes}>{children}</Component>;
};

export default Container;

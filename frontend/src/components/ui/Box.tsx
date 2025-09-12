import React from "react";
import {
  cn,
  getSpacingClasses,
  getLayoutClasses,
  getTypographyClasses,
} from "../../design-system";
import type {
  SpacingProps,
  TypographyProps,
  LayoutProps,
} from "../../design-system/types";

interface BoxProps extends SpacingProps, TypographyProps, LayoutProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
}

const Box: React.FC<BoxProps> = ({
  children,
  className = "",
  as: Component = "div",
  style,
  ...props
}) => {
  const spacingClasses = getSpacingClasses(props);
  const layoutClasses = getLayoutClasses(props);
  const typographyClasses = getTypographyClasses(props);

  const classes = cn(
    spacingClasses,
    layoutClasses,
    typographyClasses,
    className
  );

  return (
    <Component className={classes} style={style}>
      {children}
    </Component>
  );
};

export default Box;

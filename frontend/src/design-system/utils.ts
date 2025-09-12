import type {
  Spacing,
  FontSize,
  FontWeight,
  BorderRadius,
  Shadow,
  ButtonVariant,
  ButtonSize,
  SpacingProps,
  TypographyProps,
  LayoutProps,
  ButtonProps,
  CardProps,
} from "./types";
import { spacing, fontSize, fontWeight } from "./types";

// Utility function to generate CSS classes from props
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

// Generate spacing classes
export const getSpacingClasses = (props: SpacingProps): string => {
  const classes: string[] = [];

  if (props.p) classes.push(`p-${props.p}`);
  if (props.px) classes.push(`px-${props.px}`);
  if (props.py) classes.push(`py-${props.py}`);
  if (props.pt) classes.push(`pt-${props.pt}`);
  if (props.pr) classes.push(`pr-${props.pr}`);
  if (props.pb) classes.push(`pb-${props.pb}`);
  if (props.pl) classes.push(`pl-${props.pl}`);

  if (props.m) classes.push(`m-${props.m}`);
  if (props.mx) classes.push(`mx-${props.mx}`);
  if (props.my) classes.push(`my-${props.my}`);
  if (props.mt) classes.push(`mt-${props.mt}`);
  if (props.mr) classes.push(`mr-${props.mr}`);
  if (props.mb) classes.push(`mb-${props.mb}`);
  if (props.ml) classes.push(`ml-${props.ml}`);

  if (props.gap) classes.push(`gap-${props.gap}`);

  return classes.join(" ");
};

// Generate typography classes
export const getTypographyClasses = (props: TypographyProps): string => {
  const classes: string[] = [];

  if (props.fontSize) classes.push(`text-${props.fontSize}`);
  if (props.fontWeight) classes.push(`font-${props.fontWeight}`);
  if (props.textAlign) classes.push(`text-${props.textAlign}`);

  return classes.join(" ");
};

// Generate layout classes
export const getLayoutClasses = (props: LayoutProps): string => {
  const classes: string[] = [];

  if (props.display) classes.push(`d-${props.display}`);
  if (props.flexDirection) classes.push(`flex-${props.flexDirection}`);
  if (props.alignItems) classes.push(`items-${props.alignItems}`);
  if (props.justifyContent) classes.push(`justify-${props.justifyContent}`);
  if (props.width) classes.push(`w-${props.width}`);
  if (props.height) classes.push(`h-${props.height}`);

  return classes.join(" ");
};

// Generate button classes
export const getButtonClasses = (props: ButtonProps): string => {
  const classes: string[] = ["btn"];

  // Variant
  if (props.variant) {
    classes.push(`btn-${props.variant}`);
  } else {
    classes.push("btn-primary");
  }

  // Size
  if (props.size) {
    classes.push(`btn-${props.size}`);
  } else {
    classes.push("btn-md");
  }

  // Full width
  if (props.fullWidth) {
    classes.push("w-full");
  }

  // Add spacing and typography classes
  classes.push(getSpacingClasses(props));
  classes.push(getTypographyClasses(props));

  return classes.join(" ");
};

// Generate card classes
export const getCardClasses = (props: CardProps): string => {
  const classes: string[] = ["card"];

  if (props.shadow) {
    classes.push(`shadow-${props.shadow}`);
  }

  if (props.borderRadius) {
    classes.push(`rounded-${props.borderRadius}`);
  }

  if (props.padding) {
    classes.push(`p-${props.padding}`);
  }

  classes.push(getSpacingClasses(props));

  return classes.join(" ");
};

// Generate inline styles for complex cases
export const getInlineStyles = (
  props: SpacingProps & TypographyProps & LayoutProps
): React.CSSProperties => {
  const styles: React.CSSProperties = {};

  // Spacing
  if (props.p) styles.padding = spacing[props.p];
  if (props.px) styles.paddingLeft = spacing[props.px];
  if (props.px) styles.paddingRight = spacing[props.px];
  if (props.py) styles.paddingTop = spacing[props.py];
  if (props.py) styles.paddingBottom = spacing[props.py];
  if (props.pt) styles.paddingTop = spacing[props.pt];
  if (props.pr) styles.paddingRight = spacing[props.pr];
  if (props.pb) styles.paddingBottom = spacing[props.pb];
  if (props.pl) styles.paddingLeft = spacing[props.pl];

  if (props.m) styles.margin = spacing[props.m];
  if (props.mx) styles.marginLeft = spacing[props.mx];
  if (props.mx) styles.marginRight = spacing[props.mx];
  if (props.my) styles.marginTop = spacing[props.my];
  if (props.my) styles.marginBottom = spacing[props.my];
  if (props.mt) styles.marginTop = spacing[props.mt];
  if (props.mr) styles.marginRight = spacing[props.mr];
  if (props.mb) styles.marginBottom = spacing[props.mb];
  if (props.ml) styles.marginLeft = spacing[props.ml];

  if (props.gap) styles.gap = spacing[props.gap];

  // Typography
  if (props.fontSize) styles.fontSize = fontSize[props.fontSize];
  if (props.fontWeight) styles.fontWeight = fontWeight[props.fontWeight];
  if (props.textAlign) styles.textAlign = props.textAlign;

  // Layout
  if (props.display) styles.display = props.display;
  if (props.flexDirection) styles.flexDirection = props.flexDirection;
  if (props.alignItems) styles.alignItems = props.alignItems;
  if (props.justifyContent) styles.justifyContent = props.justifyContent;
  if (props.width === "full") styles.width = "100%";
  if (props.width === "fit") styles.width = "fit-content";
  if (props.height === "full") styles.height = "100%";
  if (props.height === "fit") styles.height = "fit-content";

  return styles;
};

// Predefined component class combinations
export const componentClasses = {
  // Page layouts
  pageContainer: "container stack-lg",
  pageHeader: "page-header",
  pageTitle: "page-title",
  pageSubtitle: "page-subtitle",

  // Cards
  card: "card",
  cardHeader: "card-header",

  // Forms
  form: "auth-form",
  formGroup: "form-group",
  formLabel: "form-label",
  formInput: "form-input",
  formError: "form-error",

  // Buttons
  button: "btn",
  buttonPrimary: "btn btn-primary",
  buttonSecondary: "btn btn-secondary",
  buttonDanger: "btn btn-danger",
  buttonGhost: "btn btn-ghost",

  // Auth specific
  authContainer: "auth-container",
  authCard: "auth-card",
  authHeader: "auth-header",
  authTitle: "auth-title",
  authSubtitle: "auth-subtitle",
  authButton: "auth-button",
  authSwitch: "auth-switch",
  authSwitchText: "auth-switch-text",
  authSwitchLink: "auth-switch-link",

  // Toolbars
  toolbar: "toolbar",

  // Utilities
  flexCenter: "d-flex items-center justify-center",
  flexBetween: "d-flex items-center justify-between",
  flexStart: "d-flex items-center justify-start",
  flexEnd: "d-flex items-center justify-end",
  flexColumn: "d-flex flex-column",
  textCenter: "text-center",
  textLeft: "text-left",
  textRight: "text-right",
  wFull: "w-full",
  hFull: "h-full",
};

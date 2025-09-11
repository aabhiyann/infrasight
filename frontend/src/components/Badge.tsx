import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
}

const Badge = ({ 
  children, 
  variant = "default", 
  size = "md" 
}: BadgeProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          background: "var(--color-success)",
          color: "white",
        };
      case "warning":
        return {
          background: "var(--color-warning)",
          color: "white",
        };
      case "danger":
        return {
          background: "var(--color-danger)",
          color: "white",
        };
      case "info":
        return {
          background: "var(--color-accent)",
          color: "white",
        };
      default:
        return {
          background: "var(--accent-15)",
          color: "var(--color-accent)",
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          padding: "0.1rem 0.4rem",
          fontSize: "0.7rem",
        };
      case "lg":
        return {
          padding: "0.2rem 0.6rem",
          fontSize: "0.8rem",
        };
      default:
        return {
          padding: "0.15rem 0.5rem",
          fontSize: "0.75rem",
        };
    }
  };

  return (
    <span
      className="badge"
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        display: "inline-block",
        borderRadius: "999px",
        lineHeight: 1,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
};

export default Badge;

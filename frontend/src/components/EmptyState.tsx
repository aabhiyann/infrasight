import { AlertCircle, RefreshCw, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: React.ReactNode;
  icon?: "alert" | "refresh" | "plus" | "default";
  onRetry?: () => void;
  onAdd?: () => void;
}

const EmptyState = ({
  title,
  message,
  action,
  icon = "default",
  onRetry,
  onAdd,
}: EmptyStateProps) => {
  const getIcon = () => {
    switch (icon) {
      case "alert":
        return <AlertCircle size={32} />;
      case "refresh":
        return <RefreshCw size={32} />;
      case "plus":
        return <Plus size={32} />;
      default:
        return <span style={{ fontSize: "2rem", opacity: 0.7 }}>🧭</span>;
    }
  };

  const getDefaultAction = () => {
    if (onRetry) {
      return (
        <button className="btn" onClick={onRetry}>
          <RefreshCw size={16} style={{ marginRight: "0.5rem" }} />
          Try Again
        </button>
      );
    }
    if (onAdd) {
      return (
        <button className="btn" onClick={onAdd}>
          <Plus size={16} style={{ marginRight: "0.5rem" }} />
          Add New
        </button>
      );
    }
    return null;
  };

  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden>
        {getIcon()}
      </div>
      <h3 style={{ margin: "0.25rem 0" }}>{title}</h3>
      {message ? (
        <p style={{ margin: 0, color: "var(--color-muted)" }}>{message}</p>
      ) : null}
      {(action || getDefaultAction()) && (
        <div style={{ marginTop: "0.75rem" }}>
          {action || getDefaultAction()}
        </div>
      )}
    </div>
  );
};

export default EmptyState;

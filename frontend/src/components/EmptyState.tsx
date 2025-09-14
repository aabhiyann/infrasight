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
        return <span style={{ fontSize: "2rem", opacity: 0.7 }}>?</span>;
    }
  };

  const getDefaultAction = () => {
    if (onRetry) {
      return (
        <button className="btn d-flex items-center gap-xs" onClick={onRetry}>
          <RefreshCw size={16} />
          Try Again
        </button>
      );
    }
    if (onAdd) {
      return (
        <button className="btn d-flex items-center gap-xs" onClick={onAdd}>
          <Plus size={16} />
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
      <h3 className="my-xs">{title}</h3>
      {message ? <p className="m-none text-muted">{message}</p> : null}
      {(action || getDefaultAction()) && (
        <div className="mt-md">{action || getDefaultAction()}</div>
      )}
    </div>
  );
};

export default EmptyState;

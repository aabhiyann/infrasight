import { useState } from "react";

interface RefreshButtonProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  lastRefresh?: Date;
  className?: string;
}

const RefreshButton = ({
  onRefresh,
  isRefreshing = false,
  lastRefresh,
  className = "",
}: RefreshButtonProps) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = async () => {
    setIsSpinning(true);
    await onRefresh();
    // Keep spinning for a bit for visual feedback
    setTimeout(() => setIsSpinning(false), 1000);
  };

  const formatLastRefresh = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className={`refresh-controls ${className}`}>
      <button
        onClick={handleClick}
        disabled={isRefreshing}
        className={`btn btn-sm ${isRefreshing ? "loading" : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          opacity: isRefreshing ? 0.7 : 1,
        }}
      >
        <span
          className={`refresh-icon ${isSpinning ? "spinning" : ""}`}
          style={{
            display: "inline-block",
            transition: "transform 0.3s ease",
            transform: isSpinning ? "rotate(360deg)" : "rotate(0deg)",
          }}
        >
          ↻
        </span>
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </button>
      {lastRefresh && (
        <span
          className="last-refresh"
          style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}
        >
          Last updated: {formatLastRefresh(lastRefresh)}
        </span>
      )}
    </div>
  );
};

export default RefreshButton;

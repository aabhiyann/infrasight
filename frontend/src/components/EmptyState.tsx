interface EmptyStateProps {
  title: string;
  message?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ title, message, action }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden>
        🧭
      </div>
      <h3 style={{ margin: "0.25rem 0" }}>{title}</h3>
      {message ? (
        <p style={{ margin: 0, color: "var(--color-muted)" }}>{message}</p>
      ) : null}
      {action ? <div style={{ marginTop: "0.75rem" }}>{action}</div> : null}
    </div>
  );
};

export default EmptyState;

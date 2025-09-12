interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: "⚠️",
      confirmClass: "btn-danger",
    },
    warning: {
      icon: "⚠️",
      confirmClass: "btn-warning",
    },
    info: {
      icon: "ℹ️",
      confirmClass: "btn-info",
    },
  };

  const style = typeStyles[type];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="confirm-content">
            <div className="confirm-icon">{style.icon}</div>
            <p className="confirm-message">{message}</p>
          </div>
          <div className="form-actions">
            <button onClick={onClose} className="btn btn-secondary">
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`btn ${style.confirmClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

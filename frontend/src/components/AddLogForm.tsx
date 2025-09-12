import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface LogEntry {
  id: number;
  date: string;
  service: string;
  amount: number;
  source?: string;
}

interface AddLogFormProps {
  onSuccess: (newLog: LogEntry) => void;
  onClose: () => void;
  availableServices: string[];
  initialData?: LogEntry | null;
}

interface FormData {
  date: string;
  service: string;
  amount: string;
  source: string;
}

interface FormErrors {
  date?: string;
  service?: string;
  amount?: string;
  source?: string;
}

const AddLogForm = ({
  onSuccess,
  onClose,
  availableServices,
  initialData,
}: AddLogFormProps) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<FormData>({
    date: initialData
      ? new Date(initialData.date).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    service: initialData?.service || "",
    amount: initialData?.amount?.toString() || "",
    source: initialData?.source || "manual",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Date validation
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const now = new Date();
      if (selectedDate > now) {
        newErrors.date = "Date cannot be in the future";
      }
    }

    // Service validation
    if (!formData.service) {
      newErrors.service = "Service is required";
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount < 0) {
        newErrors.amount = "Amount must be a positive number";
      }
    }

    // Source validation
    if (!formData.source) {
      newErrors.source = "Source is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const logData = {
        date: formData.date,
        service: formData.service,
        amount: parseFloat(formData.amount),
        source: formData.source,
      };

      let response;
      if (isEditing && initialData) {
        // Update existing log
        response = await axios.put(
          `${BASE_URL}/log/${initialData.id}`,
          logData
        );
        const updatedLog: LogEntry = {
          id: initialData.id,
          date: formData.date,
          service: formData.service,
          amount: parseFloat(formData.amount),
          source: formData.source,
        };
        onSuccess(updatedLog);
      } else {
        // Create new log
        response = await axios.post(`${BASE_URL}/log`, logData);
        const newLog: LogEntry = {
          id: response.data.id,
          date: formData.date,
          service: formData.service,
          amount: parseFloat(formData.amount),
          source: formData.source,
        };
        onSuccess(newLog);
      }

      onClose();
    } catch (error) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} log entry:`,
        error
      );
      alert(
        `Failed to ${
          isEditing ? "update" : "create"
        } log entry. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-log-form">
      <div className="form-group">
        <label htmlFor="date" className="form-label">
          Date & Time <span className="required">*</span>
        </label>
        <input
          id="date"
          type="datetime-local"
          value={formData.date}
          onChange={(e) => handleInputChange("date", e.target.value)}
          className={`form-input ${errors.date ? "error" : ""}`}
        />
        {errors.date && <span className="form-error">{errors.date}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="service" className="form-label">
          Service <span className="required">*</span>
        </label>
        <select
          id="service"
          value={formData.service}
          onChange={(e) => handleInputChange("service", e.target.value)}
          className={`form-input ${errors.service ? "error" : ""}`}
        >
          <option value="">Select a service</option>
          {availableServices.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        {errors.service && <span className="form-error">{errors.service}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="amount" className="form-label">
          Amount ($) <span className="required">*</span>
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => handleInputChange("amount", e.target.value)}
          className={`form-input ${errors.amount ? "error" : ""}`}
          placeholder="0.00"
        />
        {errors.amount && <span className="form-error">{errors.amount}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="source" className="form-label">
          Source <span className="required">*</span>
        </label>
        <select
          id="source"
          value={formData.source}
          onChange={(e) => handleInputChange("source", e.target.value)}
          className={`form-input ${errors.source ? "error" : ""}`}
        >
          <option value="manual">Manual Entry</option>
          <option value="api">API Import</option>
          <option value="csv">CSV Import</option>
        </select>
        {errors.source && <span className="form-error">{errors.source}</span>}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Adding..."
            : isEditing
            ? "Update Log Entry"
            : "Add Log Entry"}
        </button>
      </div>
    </form>
  );
};

export default AddLogForm;

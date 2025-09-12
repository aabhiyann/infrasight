import React from "react";

interface FormInputProps {
  id: string;
  name: string;
  type: "text" | "email" | "password";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  error?: string;
  label: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  label,
}) => {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`form-input ${error ? "error" : ""}`}
        placeholder={placeholder}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default FormInput;

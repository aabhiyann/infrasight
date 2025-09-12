import React from "react";

interface FormCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  subtitle,
  children,
  className = "",
}) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <div>
          <h2 className="page-title">{title}</h2>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
};

export default FormCard;

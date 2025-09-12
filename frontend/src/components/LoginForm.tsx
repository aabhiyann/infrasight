import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { type LoginRequest } from "../api/authApi";
import FormInput from "./FormInput";

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const { login, error, clearError } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(formData);
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your InfraSight account</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message">{error}</div>}

        <FormInput
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          label="Email Address"
        />

        <FormInput
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          label="Password"
        />

        <button type="submit" disabled={isSubmitting} className="auth-button">
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="auth-switch">
        <p className="auth-switch-text">
          Don't have an account?{" "}
          <button onClick={onSwitchToSignup} className="auth-switch-link">
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

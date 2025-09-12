import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { type SignupRequest } from "../api/authApi";
import FormInput from "./FormInput";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const { signup, error, clearError } = useAuth();
  const [formData, setFormData] = useState<SignupRequest>({
    email: "",
    username: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
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

    // Validate passwords match
    if (formData.password !== confirmPassword) {
      clearError();
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      clearError();
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(formData);
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordsMatch = formData.password === confirmPassword;
  const passwordValid = formData.password.length >= 6;

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">
          Join InfraSight to start optimizing your cloud costs
        </p>
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
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
          required
          label="Username"
        />

        <div>
          <FormInput
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            label="Password"
          />
          {formData.password && !passwordValid && (
            <div className="form-error">
              Password must be at least 6 characters
            </div>
          )}
        </div>

        <div>
          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            label="Confirm Password"
          />
          {confirmPassword && !passwordsMatch && (
            <div className="form-error">Passwords do not match</div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !passwordsMatch || !passwordValid}
          className="auth-button"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="auth-switch">
        <p className="auth-switch-text">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="auth-switch-link">
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;

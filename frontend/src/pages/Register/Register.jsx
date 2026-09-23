import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      console.log("REGISTER RESPONSE:", response.data);

      setSuccess(
        "Registration successful. Redirecting to login..."
      );

      setFormData({
        fullName: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      console.error("Registration failed:", error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>Create Account</h1>

            <p>
              Register to start using the e-commerce application.
            </p>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.success}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.registerButton}
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <div className={styles.loginText}>
            Already have an account?

            <button
              type="button"
              className={styles.loginLink}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
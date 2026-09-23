import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
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
    setLoading(true);

    try {
      await login(
        formData.email,
        formData.password
      );

      /*
       * If the user was redirected to login from a
       * protected page, return them to that page.
       *
       * Otherwise, go to Home.
       */
      const from =
        location.state?.from?.pathname || "/";

      const search =
        location.state?.from?.search || "";

      const hash =
        location.state?.from?.hash || "";

      navigate(
        `${from}${search}${hash}`,
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please check your email and password."
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
            <h1>Login</h1>

            <p>
              Login to access your account.
            </p>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

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
                required
              />
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className={styles.registerText}>
            Don't have an account?

            <button
              type="button"
              className={styles.registerLink}
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;
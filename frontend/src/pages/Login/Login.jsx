import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import styles from "./Login.module.css";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(email, password);

      navigate("/products");
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please check your email and password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>

      <div className={styles.card}>

        <h1 className={styles.title}>
          Login
        </h1>

        <p className={styles.subtitle}>
          Login to your account
        </p>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >

          <div className={styles.field}>

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

          </div>

          <div className={styles.field}>

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className={styles.registerText}>
          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
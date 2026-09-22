import styles from "./Register.module.css";

function Register() {
  return (
    <div className={styles.page}>

      <div className={styles.card}>

        <h1 className={styles.title}>
          Create Account
        </h1>

        <p className={styles.subtitle}>
          Register a new account
        </p>

        <form className={styles.form}>

          <div className={styles.field}>
            <label htmlFor="fullName">
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            className={styles.button}
          >
            Register
          </button>

        </form>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <a href="/login">
            Login
          </a>
        </p>

      </div>

    </div>
  );
}

export default Register;
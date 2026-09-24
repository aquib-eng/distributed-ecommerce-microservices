import { Link } from "react-router-dom";

import styles from "./Footer.module.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          {/* BRAND */}

          <div className={styles.brandSection}>
            <Link
              to="/"
              className={styles.brand}
            >
              <span className={styles.brandIcon}>
                🛒
              </span>

              <span>Distributed Shop</span>
            </Link>

            <p className={styles.description}>
              A modern distributed e-commerce
              application built with React and
              Spring Boot microservices.
            </p>
          </div>

          {/* QUICK LINKS */}

          <div className={styles.linksSection}>
            <h3>Quick Links</h3>

            <Link to="/">Home</Link>

            <Link to="/products">
              Products
            </Link>

            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </div>

          {/* CUSTOMER */}

          <div className={styles.linksSection}>
            <h3>Customer</h3>

            <Link to="/cart">
              Shopping Cart
            </Link>

            <Link to="/orders">
              My Orders
            </Link>

            <Link to="/notifications">
              Notifications
            </Link>
          </div>
        </div>

        {/* BOTTOM */}

        <div className={styles.bottomSection}>
          <p>
            © {currentYear} Distributed Shop. All
            rights reserved.
          </p>

          <p>
            Built with React + Spring Boot
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
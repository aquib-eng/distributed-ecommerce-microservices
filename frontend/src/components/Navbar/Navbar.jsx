import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import styles from "./Navbar.module.css";

function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  const getLinkClass = ({ isActive }) =>
    `${styles.navLink} ${
      isActive ? styles.active : ""
    }`;

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>

          {/* BRAND */}

          <Link
            to="/"
            className={styles.brand}
            onClick={closeMenu}
          >
            <span className={styles.brandIcon}>
              🛒
            </span>

            <span className={styles.brandText}>
              Distributed Shop
            </span>
          </Link>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            className={`${styles.menuButton} ${
              menuOpen ? styles.menuButtonOpen : ""
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* NAVIGATION */}

          <div
            className={`${styles.navigation} ${
              menuOpen ? styles.navigationOpen : ""
            }`}
          >
            <div className={styles.navLinks}>

              <NavLink
                to="/"
                className={getLinkClass}
                onClick={closeMenu}
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                className={getLinkClass}
                onClick={closeMenu}
              >
                Products
              </NavLink>

              {user && (
                <>
                  <NavLink
                    to="/cart"
                    className={getLinkClass}
                    onClick={closeMenu}
                  >
                    Cart
                  </NavLink>

                  <NavLink
                    to="/orders"
                    className={getLinkClass}
                    onClick={closeMenu}
                  >
                    Orders
                  </NavLink>

                  <NavLink
                    to="/notifications"
                    className={getLinkClass}
                    onClick={closeMenu}
                  >
                    Notifications
                  </NavLink>

                  <NavLink
                    to="/profile"
                    className={getLinkClass}
                    onClick={closeMenu}
                  >
                    Profile
                  </NavLink>
                </>
              )}
            </div>

            {/* USER SECTION */}

            <div className={styles.userSection}>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className={styles.userInfo}
                    onClick={closeMenu}
                  >
                    <span className={styles.welcomeText}>
                      Welcome
                    </span>

                    <span className={styles.userName}>
                      {user.fullName ||
                        user.email ||
                        "User"}
                    </span>
                  </Link>

                  <button
                    type="button"
                    className={styles.logoutButton}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className={styles.authLinks}>
                  <Link
                    to="/login"
                    className={styles.loginButton}
                    onClick={closeMenu}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className={styles.registerButton}
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
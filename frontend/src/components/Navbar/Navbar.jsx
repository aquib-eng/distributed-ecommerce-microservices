import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import styles from "./Navbar.module.css";

function Navbar() {
  const { user, loading, logout } = useAuth();

  const navigate = useNavigate();

  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? `${styles.navLink} ${styles.active}`
      : styles.navLink;
  };

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink
          to="/"
          className={styles.brand}
        >
          E-Commerce
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="mainNavbar"
        >
          <ul className="navbar-nav ms-auto align-items-lg-center">

            <li className="nav-item">
              <NavLink
                to="/"
                className={getNavLinkClass}
                end
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/products"
                className={getNavLinkClass}
              >
                Products
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/cart"
                className={getNavLinkClass}
              >
                Cart
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/orders"
                className={getNavLinkClass}
              >
                Orders
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/notifications"
                className={getNavLinkClass}
              >
                Notifications
              </NavLink>
            </li>

            {!loading && user ? (
              <>
                <li className="nav-item">
                  <span className={styles.userName}>
                    Welcome,{" "}
                    {user.fullName ||
                      user.name ||
                      user.email ||
                      "User"}
                  </span>
                </li>

                <li className="nav-item">
                  <button
                    type="button"
                    className={styles.logoutButton}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : !loading ? (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={styles.loginButton}
                  >
                    Login
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className={styles.registerButton}
                  >
                    Register
                  </NavLink>
                </li>
              </>
            ) : null}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
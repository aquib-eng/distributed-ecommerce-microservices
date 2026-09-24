import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import styles from "./Profile.module.css";

function Profile() {
  const { user } = useAuth();

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = () => {
    const name =
      user?.fullName ||
      user?.email ||
      "User";

    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
  };

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>!</div>

            <span className={styles.errorEyebrow}>
              PROFILE UNAVAILABLE
            </span>

            <h1>Unable to load profile</h1>

            <p>
              We could not find your account information.
              Please log in again.
            </p>

            <Link
              to="/login"
              className={styles.primaryButton}
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <section className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              ACCOUNT
            </span>

            <h1 className={styles.title}>
              My Profile
            </h1>

            <p className={styles.subtitle}>
              View your account information and profile
              details.
            </p>
          </div>

          <Link
            to="/"
            className={styles.backButton}
          >
            ← Back to Home
          </Link>
        </section>

        {/* ==========================================
            PROFILE OVERVIEW
        ========================================== */}

        <section className={styles.profileCard}>
          <div className={styles.profileMain}>
            <div className={styles.avatar}>
              {getInitials()}
            </div>

            <div className={styles.profileIdentity}>
              <span className={styles.profileLabel}>
                ACCOUNT HOLDER
              </span>

              <h2>
                {user.fullName || "User"}
              </h2>

              <p>
                {user.email || "Email not available"}
              </p>
            </div>
          </div>

          <div className={styles.accountStatus}>
            <span className={styles.statusDot}></span>

            <div>
              <span className={styles.statusLabel}>
                Account Status
              </span>

              <strong>Active</strong>
            </div>
          </div>
        </section>

        {/* ==========================================
            ACCOUNT INFORMATION
        ========================================== */}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                PERSONAL DETAILS
              </span>

              <h2 className={styles.sectionTitle}>
                Account Information
              </h2>
            </div>
          </div>

          <div className={styles.infoGrid}>

            {/* FULL NAME */}

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                👤
              </div>

              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>
                  Full Name
                </span>

                <strong className={styles.infoValue}>
                  {user.fullName || "Not available"}
                </strong>
              </div>
            </div>

            {/* EMAIL */}

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                ✉
              </div>

              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>
                  Email Address
                </span>

                <strong className={styles.infoValue}>
                  {user.email || "Not available"}
                </strong>
              </div>
            </div>

            {/* ROLE */}

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                🛡
              </div>

              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>
                  Account Role
                </span>

                <strong
                  className={`${styles.infoValue} ${styles.roleValue}`}
                >
                  {user.role || "CUSTOMER"}
                </strong>
              </div>
            </div>

            {/* USER ID */}

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                #
              </div>

              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>
                  User ID
                </span>

                <strong
                  className={`${styles.infoValue} ${styles.userId}`}
                >
                  {user.id ||
                    user.userId ||
                    "Not available"}
                </strong>
              </div>
            </div>

            {/* CREATED DATE */}

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                📅
              </div>

              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>
                  Account Created
                </span>

                <strong className={styles.infoValue}>
                  {formatDate(user.createdAt)}
                </strong>
              </div>
            </div>

            {/* LOGIN STATUS */}

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                ✓
              </div>

              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>
                  Login Status
                </span>

                <strong
                  className={`${styles.infoValue} ${styles.activeValue}`}
                >
                  Authenticated
                </strong>
              </div>
            </div>

          </div>
        </section>

        {/* ==========================================
            ACCOUNT SECURITY
        ========================================== */}

        <section className={styles.securityCard}>
          <div className={styles.securityIcon}>
            🔐
          </div>

          <div className={styles.securityContent}>
            <span className={styles.sectionEyebrow}>
              SECURITY
            </span>

            <h2>Account Security</h2>

            <p>
              Your account is protected using JWT-based
              authentication. Your authenticated session
              is required to access protected areas of
              the application.
            </p>
          </div>
        </section>

        {/* ==========================================
            QUICK ACTIONS
        ========================================== */}

        <section className={styles.actionsSection}>
          <div>
            <span className={styles.sectionEyebrow}>
              QUICK ACTIONS
            </span>

            <h2 className={styles.sectionTitle}>
              Manage Your Account
            </h2>
          </div>

          <div className={styles.actions}>
            <Link
              to="/orders"
              className={styles.actionButton}
            >
              <span>📦</span>
              My Orders
            </Link>

            <Link
              to="/notifications"
              className={styles.actionButton}
            >
              <span>🔔</span>
              Notifications
            </Link>

            <Link
              to="/products"
              className={styles.actionButton}
            >
              <span>🛍</span>
              Continue Shopping
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Profile;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

import styles from "./Notifications.module.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/notifications");

      console.log("Notifications response:", response.data);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.notifications || [];

      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setError("");
      setSuccess("");

      await api.put(
        `/api/notifications/${notificationId}/read`
      );

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          getNotificationId(notification) === notificationId
            ? {
                ...notification,
                status: "READ",
              }
            : notification
        )
      );

      setSuccess("Notification marked as read.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to mark notification as read."
      );
    }
  };

  const getNotificationId = (notification) => {
    return (
      notification.id ||
      notification.notificationId ||
      notification._id
    );
  };

  const isRead = (notification) => {
    return (
      String(notification.status || "").toUpperCase() ===
      "READ"
    );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date unavailable";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString();
  };

  const getNotificationType = (notification) => {
    if (!notification.type) {
      return "Notification";
    }

    return String(notification.type)
      .replaceAll("_", " ")
      .replaceAll("-", " ")
      .toLowerCase()
      .replace(/\b\w/g, (character) =>
        character.toUpperCase()
      );
  };

  const getNotificationIcon = (notification) => {
    const type = String(notification.type || "").toUpperCase();

    if (type.includes("PAYMENT")) {
      return "💳";
    }

    if (type.includes("ORDER")) {
      return "📦";
    }

    if (type.includes("CANCEL")) {
      return "↩️";
    }

    if (type.includes("SUCCESS")) {
      return "✓";
    }

    if (type.includes("FAILED")) {
      return "⚠";
    }

    return "🔔";
  };

  const unreadCount = notifications.filter(
    (notification) => !isRead(notification)
  ).length;

  const readCount = notifications.length - unreadCount;

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loadingCard}>
            <div className={styles.loadingSpinner}></div>

            <p>Loading notifications...</p>

            <span>
              Please wait while we retrieve your latest
              updates.
            </span>
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
          <div className={styles.headerContent}>
            <span className={styles.eyebrow}>
              ACCOUNT UPDATES
            </span>

            <h1 className={styles.title}>
              Notifications
            </h1>

            <p className={styles.subtitle}>
              Stay updated with your orders, payments, and
              account activity.
            </p>
          </div>

          <button
            type="button"
            className={styles.refreshButton}
            onClick={fetchNotifications}
          >
            <span className={styles.refreshIcon}>↻</span>

            Refresh
          </button>
        </section>

        {/* ==========================================
            STATISTICS
        ========================================== */}
        {notifications.length > 0 && (
          <section className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🔔</div>

              <div>
                <span className={styles.statLabel}>
                  Total
                </span>

                <strong className={styles.statValue}>
                  {notifications.length}
                </strong>
              </div>
            </div>

            <div className={styles.statCard}>
              <div
                className={`${styles.statIcon} ${styles.unreadStatIcon}`}
              >
                ●
              </div>

              <div>
                <span className={styles.statLabel}>
                  Unread
                </span>

                <strong className={styles.statValue}>
                  {unreadCount}
                </strong>
              </div>
            </div>

            <div className={styles.statCard}>
              <div
                className={`${styles.statIcon} ${styles.readStatIcon}`}
              >
                ✓
              </div>

              <div>
                <span className={styles.statLabel}>
                  Read
                </span>

                <strong className={styles.statValue}>
                  {readCount}
                </strong>
              </div>
            </div>
          </section>
        )}

        {/* ==========================================
            ALERTS
        ========================================== */}
        {error && (
          <div className={styles.error}>
            <div className={styles.alertIcon}>!</div>

            <div>
              <strong>Something went wrong</strong>

              <p>{error}</p>
            </div>

            <button
              type="button"
              className={styles.alertAction}
              onClick={fetchNotifications}
            >
              Retry
            </button>
          </div>
        )}

        {success && (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>

            <div>
              <strong>Success</strong>

              <p>{success}</p>
            </div>
          </div>
        )}

        {/* ==========================================
            EMPTY STATE
        ========================================== */}
        {!error && notifications.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔔</div>

            <span className={styles.emptyEyebrow}>
              ALL CAUGHT UP
            </span>

            <h2>No notifications yet</h2>

            <p>
              You don't have any notifications at the
              moment. New order and payment updates will
              appear here.
            </p>

            <Link
              to="/products"
              className={styles.shopButton}
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* ==========================================
            NOTIFICATION LIST
        ========================================== */}
        {notifications.length > 0 && (
          <section className={styles.notificationSection}>
            <div className={styles.listHeader}>
              <div>
                <span className={styles.sectionEyebrow}>
                  RECENT ACTIVITY
                </span>

                <h2 className={styles.sectionTitle}>
                  Your Notifications
                </h2>
              </div>

              <span className={styles.countBadge}>
                {notifications.length}{" "}
                {notifications.length === 1
                  ? "notification"
                  : "notifications"}
              </span>
            </div>

            <div className={styles.list}>
              {notifications.map((notification) => {
                const notificationId =
                  getNotificationId(notification);

                const read = isRead(notification);

                return (
                  <article
                    key={notificationId}
                    className={`${styles.notification} ${
                      !read ? styles.unread : ""
                    }`}
                  >
                    {/* ICON */}
                    <div
                      className={`${styles.iconWrapper} ${
                        !read
                          ? styles.unreadIconWrapper
                          : ""
                      }`}
                    >
                      <span className={styles.icon}>
                        {getNotificationIcon(notification)}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className={styles.content}>
                      <div className={styles.topRow}>
                        <div className={styles.titleGroup}>
                          {!read && (
                            <span
                              className={
                                styles.unreadDot
                              }
                            ></span>
                          )}

                          <h3 className={styles.type}>
                            {getNotificationType(
                              notification
                            )}
                          </h3>
                        </div>

                        <span
                          className={
                            read
                              ? styles.readBadge
                              : styles.unreadBadge
                          }
                        >
                          {read ? "Read" : "Unread"}
                        </span>
                      </div>

                      <p className={styles.message}>
                        {notification.message ||
                          "You have a new notification."}
                      </p>

                      {notification.orderId && (
                        <div className={styles.orderReference}>
                          <span className={styles.orderLabel}>
                            Order
                          </span>

                          <span
                            className={styles.orderId}
                          >
                            {notification.orderId}
                          </span>

                          <Link
                            to={`/orders/${notification.orderId}`}
                            className={styles.orderLink}
                          >
                            View Order →
                          </Link>
                        </div>
                      )}

                      <div className={styles.meta}>
                        <span className={styles.dateIcon}>
                          ◷
                        </span>

                        <span>
                          {formatDate(
                            notification.createdAt
                          )}
                        </span>
                      </div>

                      {!read && notificationId && (
                        <button
                          type="button"
                          className={styles.readButton}
                          onClick={() =>
                            markAsRead(notificationId)
                          }
                        >
                          <span>✓</span>

                          Mark as Read
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Notifications;
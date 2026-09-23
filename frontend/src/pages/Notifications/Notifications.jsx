import { useEffect, useState } from "react";

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
    return String(notification.status || "").toUpperCase() === "READ";
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

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>
            Loading notifications...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Notifications</h1>

            <p>
              Stay updated with your orders, payments, and
              account activity.
            </p>
          </div>

          <button
            type="button"
            className={styles.refreshButton}
            onClick={fetchNotifications}
          >
            Refresh
          </button>
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

        {!error && notifications.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔔</div>

            <h2>No notifications</h2>

            <p>
              You don't have any notifications yet.
            </p>
          </div>
        )}

        {notifications.length > 0 && (
          <div className={styles.list}>
            {notifications.map((notification) => {
              const notificationId =
                getNotificationId(notification);

              const read = isRead(notification);

              return (
                <div
                  key={notificationId}
                  className={`${styles.notification} ${
                    !read ? styles.unread : ""
                  }`}
                >
                  <div className={styles.icon}>
                    {read ? "✓" : "🔔"}
                  </div>

                  <div className={styles.content}>
                    <div className={styles.topRow}>
                      <h2>
                        {getNotificationType(notification)}
                      </h2>

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
                      <p className={styles.orderId}>
                        Order ID:{" "}
                        <span>
                          {notification.orderId}
                        </span>
                      </p>
                    )}

                    <p className={styles.date}>
                      {formatDate(notification.createdAt)}
                    </p>

                    {!read && notificationId && (
                      <button
                        type="button"
                        className={styles.readButton}
                        onClick={() =>
                          markAsRead(notificationId)
                        }
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
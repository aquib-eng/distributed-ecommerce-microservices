
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../services/api";

import styles from "./OrderDetails.module.css";

function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.get(
        `/api/orders/${orderId}`
      );

      console.log(
        "Order details response:",
        response.data
      );

      setOrder(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch order details:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load order details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");
      setSuccess("");

      console.log(
        "Cancelling order:",
        orderId
      );

      const response = await api.put(
        `/api/orders/${orderId}/cancel`
      );

      console.log(
        "Cancel order response:",
        response.data
      );

      setOrder(response.data);

      setSuccess(
        "Order cancelled successfully."
      );
    } catch (error) {
      console.error(
        "Failed to cancel order:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to cancel the order."
      );
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return styles.statusPending;

      case "CONFIRMED":
        return styles.statusConfirmed;

      case "CANCELLED":
        return styles.statusCancelled;

      case "COMPLETED":
        return styles.statusCompleted;

      case "PROCESSING":
        return styles.statusProcessing;

      default:
        return styles.statusDefault;
    }
  };

  const getStatusLabel = (status) => {
    if (!status) {
      return "Unknown";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
  };

  const getPaymentMethod = (orderData) => {
    return (
      orderData.paymentMethod ||
      orderData.paymentType ||
      "COD"
    );
  };

  const getTimelineData = (status) => {
    const normalizedStatus =
      status?.toUpperCase();

    if (normalizedStatus === "CANCELLED") {
      return [
        {
          title: "Order Placed",
          description:
            "Your order was created successfully.",
          state: "completed",
          icon: "✓",
        },
        {
          title: "Order Cancelled",
          description:
            "This order has been cancelled.",
          state: "cancelled",
          icon: "×",
        },
      ];
    }

    if (normalizedStatus === "CONFIRMED") {
      return [
        {
          title: "Order Placed",
          description:
            "Your order has been placed successfully.",
          state: "completed",
          icon: "✓",
        },
        {
          title: "Order Confirmed",
          description:
            "Your order has been confirmed.",
          state: "completed",
          icon: "✓",
        },
        {
          title: "Processing",
          description:
            "Your order is being processed.",
          state: "current",
          icon: "3",
        },
      ];
    }

    if (normalizedStatus === "COMPLETED") {
      return [
        {
          title: "Order Placed",
          description:
            "Your order has been placed successfully.",
          state: "completed",
          icon: "✓",
        },
        {
          title: "Order Confirmed",
          description:
            "Your order has been confirmed.",
          state: "completed",
          icon: "✓",
        },
        {
          title: "Processing",
          description:
            "Your order has been processed.",
          state: "completed",
          icon: "✓",
        },
        {
          title: "Completed",
          description:
            "Your order has been completed successfully.",
          state: "completed",
          icon: "✓",
        },
      ];
    }

    return [
      {
        title: "Order Placed",
        description:
          "Your order has been placed successfully.",
        state: "completed",
        icon: "✓",
      },
      {
        title: "Order Confirmation",
        description:
          "Waiting for order confirmation.",
        state: "current",
        icon: "2",
      },
      {
        title: "Processing",
        description:
          "Your order will be processed after confirmation.",
        state: "pending",
        icon: "3",
      },
    ];
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div
              className="spinner-border text-primary"
              role="status"
              aria-label="Loading order"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p>
              Loading order details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.errorBox}>
            <div className={styles.errorIcon}>
              !
            </div>

            <p className={styles.errorEyebrow}>
              ORDER ERROR
            </p>

            <h2>
              Order Not Found
            </h2>

            <p>
              {error}
            </p>

            <div className={styles.errorActions}>
              <button
                type="button"
                className={styles.retryButton}
                onClick={fetchOrder}
              >
                Try Again
              </button>

              <Link
                to="/orders"
                className={styles.primaryButton}
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  const status =
    order.status || "UNKNOWN";

  const normalizedStatus =
    status.toUpperCase();

  const orderNumber =
    order.orderId ||
    order.id ||
    orderId;

  const totalAmount =
    order.totalAmount ??
    order.totalPrice ??
    0;

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const paymentMethod =
    getPaymentMethod(order);

  const timeline =
    getTimelineData(status);

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* =====================================
            HEADER
        ====================================== */}

        <header className={styles.header}>
          <div className={styles.headerContent}>
            <Link
              to="/orders"
              className={styles.backLink}
            >
              <span>←</span>
              Back to Orders
            </Link>

            <p className={styles.eyebrow}>
              ORDER MANAGEMENT
            </p>

            <h1 className={styles.title}>
              Order Details
            </h1>

            <p className={styles.orderId}>
              Order #{orderNumber}
            </p>
          </div>

          <div className={styles.statusWrapper}>
            <span className={styles.statusLabel}>
              CURRENT STATUS
            </span>

            <span
              className={`${styles.status} ${getStatusClass(
                status
              )}`}
            >
              <span
                className={styles.statusDot}
              ></span>

              {getStatusLabel(status)}
            </span>
          </div>
        </header>

        {/* =====================================
            ALERTS
        ====================================== */}

        {error && (
          <div
            className={styles.error}
            role="alert"
          >
            <span className={styles.alertIcon}>
              !
            </span>

            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            className={styles.success}
            role="status"
          >
            <span className={styles.successIcon}>
              ✓
            </span>

            <span>{success}</span>
          </div>
        )}

        {/* =====================================
            ORDER SUMMARY
        ====================================== */}

        <section className={styles.summaryCard}>
          <div className={styles.summaryItem}>
            <div className={styles.summaryIcon}>
              📅
            </div>

            <div>
              <span
                className={styles.summaryLabel}
              >
                Order Date
              </span>

              <strong
                className={styles.summaryValue}
              >
                {formatDate(
                  order.createdAt
                )}
              </strong>
            </div>
          </div>

          <div className={styles.summaryItem}>
            <div className={styles.summaryIcon}>
              💳
            </div>

            <div>
              <span
                className={styles.summaryLabel}
              >
                Payment
              </span>

              <strong
                className={styles.summaryValue}
              >
                {paymentMethod}
              </strong>
            </div>
          </div>

          <div className={styles.summaryItem}>
            <div className={styles.summaryIcon}>
              🛍️
            </div>

            <div>
              <span
                className={styles.summaryLabel}
              >
                Items
              </span>

              <strong
                className={styles.summaryValue}
              >
                {items.reduce(
                  (total, item) =>
                    total +
                    Number(
                      item.quantity || 0
                    ),
                  0
                )}
              </strong>
            </div>
          </div>

          <div className={styles.summaryItem}>
            <div className={styles.summaryIcon}>
              💰
            </div>

            <div>
              <span
                className={styles.summaryLabel}
              >
                Total Amount
              </span>

              <strong
                className={`${styles.summaryValue} ${styles.summaryTotal}`}
              >
                ₹{formatPrice(totalAmount)}
              </strong>
            </div>
          </div>
        </section>

        {/* =====================================
            CUSTOMER INFORMATION
        ====================================== */}

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>
                ORDER INFORMATION
              </p>

              <h2
                className={styles.sectionTitle}
              >
                Customer & Payment
              </h2>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span
                className={styles.detailLabel}
              >
                Order ID
              </span>

              <span
                className={`${styles.detailValue} ${styles.breakText}`}
              >
                {orderNumber}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span
                className={styles.detailLabel}
              >
                Customer ID
              </span>

              <span
                className={`${styles.detailValue} ${styles.breakText}`}
              >
                {order.userId || "N/A"}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span
                className={styles.detailLabel}
              >
                Payment Method
              </span>

              <span
                className={styles.detailValue}
              >
                {paymentMethod}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span
                className={styles.detailLabel}
              >
                Order Status
              </span>

              <span
                className={styles.detailValue}
              >
                {getStatusLabel(status)}
              </span>
            </div>
          </div>
        </section>

        {/* =====================================
            STATUS TIMELINE
        ====================================== */}

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>
                ORDER PROGRESS
              </p>

              <h2
                className={styles.sectionTitle}
              >
                Order Status
              </h2>
            </div>
          </div>

          <div className={styles.timeline}>
            {timeline.map(
              (step, index) => {
                const isLast =
                  index ===
                  timeline.length - 1;

                return (
                  <div
                    key={step.title}
                    className={
                      styles.timelineWrapper
                    }
                  >
                    <div
                      className={
                        styles.timelineItem
                      }
                    >
                      <div
                        className={`${styles.timelineCircle} ${
                          step.state ===
                          "completed"
                            ? styles.timelineCompleted
                            : step.state ===
                                "cancelled"
                              ? styles.timelineCancelled
                              : step.state ===
                                  "current"
                                ? styles.timelineCurrent
                                : styles.timelinePending
                        }`}
                      >
                        {step.icon}
                      </div>

                      <div
                        className={
                          styles.timelineContent
                        }
                      >
                        <h3>
                          {step.title}
                        </h3>

                        <p>
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {!isLast && (
                      <div
                        className={`${styles.timelineLine} ${
                          step.state ===
                            "completed" ||
                          step.state ===
                            "cancelled"
                            ? styles.timelineLineCompleted
                            : ""
                        }`}
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* =====================================
            ORDER ITEMS
        ====================================== */}

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>
                PURCHASE SUMMARY
              </p>

              <h2
                className={styles.sectionTitle}
              >
                Order Items
              </h2>
            </div>

            <span
              className={styles.itemCountBadge}
            >
              {items.length} product
              {items.length === 1
                ? ""
                : "s"}
            </span>
          </div>

          {items.length === 0 ? (
            <div className={styles.noItems}>
              <span>📦</span>

              <p>
                No order items found.
              </p>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {items.map(
                (item, index) => {
                  const quantity =
                    Number(
                      item.quantity || 0
                    );

                  const unitPrice =
                    Number(
                      item.price || 0
                    );

                  const itemTotal =
                    unitPrice * quantity;

                  return (
                    <div
                      key={
                        item.orderItemId ||
                        item.id ||
                        index
                      }
                      className={styles.item}
                    >
                      <div
                        className={
                          styles.productInfo
                        }
                      >
                        <div
                          className={
                            styles.productIcon
                          }
                        >
                          🛍️
                        </div>

                        <div
                          className={
                            styles.productContent
                          }
                        >
                          <h3>
                            Product
                          </h3>

                          <span
                            className={
                              styles.productLabel
                            }
                          >
                            Product ID
                          </span>

                          <p
                            className={
                              styles.productId
                            }
                          >
                            {item.productId}
                          </p>
                        </div>
                      </div>

                      <div
                        className={
                          styles.itemInfo
                        }
                      >
                        <span>
                          Quantity
                        </span>

                        <strong>
                          {quantity}
                        </strong>
                      </div>

                      <div
                        className={
                          styles.itemInfo
                        }
                      >
                        <span>
                          Unit Price
                        </span>

                        <strong>
                          ₹
                          {formatPrice(
                            unitPrice
                          )}
                        </strong>
                      </div>

                      <div
                        className={`${styles.itemInfo} ${styles.itemTotal}`}
                      >
                        <span>
                          Item Total
                        </span>

                        <strong>
                          ₹
                          {formatPrice(
                            itemTotal
                          )}
                        </strong>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* =====================================
            TOTAL
        ====================================== */}

        <section className={styles.totalCard}>
          <div className={styles.totalContent}>
            <span>
              Order Total
            </span>

            <strong>
              ₹{formatPrice(totalAmount)}
            </strong>
          </div>

          <p className={styles.totalNote}>
            Final amount associated with this
            order.
          </p>
        </section>

        {/* =====================================
            ACTIONS
        ====================================== */}

        <div className={styles.actions}>
          <Link
            to="/orders"
            className={styles.backButton}
          >
            ← Back to Orders
          </Link>

          {normalizedStatus ===
            "PENDING" && (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling
                ? "Cancelling..."
                : "Cancel Order"}
            </button>
          )}

          <Link
            to="/products"
            className={styles.shopButton}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;


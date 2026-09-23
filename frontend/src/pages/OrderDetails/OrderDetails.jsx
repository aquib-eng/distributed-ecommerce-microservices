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

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Unable to load order details."
        );
      }
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

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Unable to cancel the order."
        );
      }
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

      default:
        return styles.statusDefault;
    }
  };

  const getStatusStepClass = (
    stepStatus,
    currentStatus
  ) => {
    const status = currentStatus?.toUpperCase();

    if (stepStatus === "PLACED") {
      return styles.timelineCompleted;
    }

    if (
      stepStatus === "CONFIRMED" &&
      status === "CONFIRMED"
    ) {
      return styles.timelineCompleted;
    }

    if (
      stepStatus === "CANCELLED" &&
      status === "CANCELLED"
    ) {
      return styles.timelineCancelled;
    }

    return styles.timelinePending;
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.message}>
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.errorBox}>
            <h2>
              Order Not Found
            </h2>

            <p>
              {error}
            </p>

            <Link
              to="/orders"
              className={styles.primaryButton}
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const status =
    order.status || "UNKNOWN";

  const totalAmount =
    order.totalAmount ??
    order.totalPrice ??
    0;

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}

        <div className={styles.header}>

          <div>
            <Link
              to="/orders"
              className={styles.backLink}
            >
              ← Back to Orders
            </Link>

            <h1 className={styles.title}>
              Order Details
            </h1>

            <p className={styles.orderId}>
              Order ID: {order.orderId}
            </p>
          </div>

          <span
            className={`${styles.status} ${getStatusClass(
              status
            )}`}
          >
            {status}
          </span>

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

        {/* ORDER INFORMATION */}

        <div className={styles.infoCard}>

          <div className={styles.infoItem}>

            <span className={styles.infoLabel}>
              Order Date
            </span>

            <span className={styles.infoValue}>
              {formatDate(
                order.createdAt
              )}
            </span>

          </div>

          <div className={styles.infoItem}>

            <span className={styles.infoLabel}>
              Customer ID
            </span>

            <span
              className={`${styles.infoValue} ${styles.breakText}`}
            >
              {order.userId}
            </span>

          </div>

          <div className={styles.infoItem}>

            <span className={styles.infoLabel}>
              Payment Method
            </span>

            <span className={styles.infoValue}>
              COD
            </span>

          </div>

          <div className={styles.infoItem}>

            <span className={styles.infoLabel}>
              Total Amount
            </span>

            <span className={styles.totalValue}>
              ₹{Number(totalAmount).toFixed(2)}
            </span>

          </div>

        </div>

        {/* STATUS TIMELINE */}

        <div className={styles.card}>

          <h2 className={styles.sectionTitle}>
            Order Status
          </h2>

          {status.toUpperCase() ===
          "CANCELLED" ? (
            <div className={styles.timeline}>

              <div className={styles.timelineItem}>

                <div
                  className={`${styles.timelineCircle} ${getStatusStepClass(
                    "PLACED",
                    status
                  )}`}
                >
                  ✓
                </div>

                <div
                  className={styles.timelineContent}
                >
                  <h3>
                    Order Placed
                  </h3>

                  <p>
                    Your order was created
                    successfully.
                  </p>
                </div>

              </div>

              <div className={styles.timelineLine} />

              <div className={styles.timelineItem}>

                <div
                  className={`${styles.timelineCircle} ${styles.timelineCancelled}`}
                >
                  ×
                </div>

                <div
                  className={styles.timelineContent}
                >
                  <h3>
                    Order Cancelled
                  </h3>

                  <p>
                    This order has been
                    cancelled.
                  </p>
                </div>

              </div>

            </div>
          ) : (
            <div className={styles.timeline}>

              <div className={styles.timelineItem}>

                <div
                  className={`${styles.timelineCircle} ${styles.timelineCompleted}`}
                >
                  ✓
                </div>

                <div
                  className={styles.timelineContent}
                >
                  <h3>
                    Order Placed
                  </h3>

                  <p>
                    Your order has been
                    placed successfully.
                  </p>
                </div>

              </div>

              <div className={styles.timelineLine} />

              <div className={styles.timelineItem}>

                <div
                  className={`${styles.timelineCircle} ${
                    status.toUpperCase() ===
                    "CONFIRMED"
                      ? styles.timelineCompleted
                      : styles.timelinePending
                  }`}
                >
                  {status.toUpperCase() ===
                  "CONFIRMED"
                    ? "✓"
                    : "2"}
                </div>

                <div
                  className={styles.timelineContent}
                >
                  <h3>
                    Order Confirmation
                  </h3>

                  <p>
                    {status.toUpperCase() ===
                    "CONFIRMED"
                      ? "Your order has been confirmed."
                      : "Waiting for order confirmation."}
                  </p>
                </div>

              </div>

              <div className={styles.timelineLine} />

              <div className={styles.timelineItem}>

                <div
                  className={`${styles.timelineCircle} ${styles.timelinePending}`}
                >
                  3
                </div>

                <div
                  className={styles.timelineContent}
                >
                  <h3>
                    Processing
                  </h3>

                  <p>
                    Your order will be
                    processed after confirmation.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* ORDER ITEMS */}

        <div className={styles.card}>

          <h2 className={styles.sectionTitle}>
            Order Items
          </h2>

          {items.length === 0 ? (
            <p className={styles.noItems}>
              No order items found.
            </p>
          ) : (
            <div className={styles.itemsList}>

              {items.map((item, index) => {

                const itemTotal =
                  Number(item.price || 0) *
                  Number(item.quantity || 0);

                return (
                  <div
                    key={
                      item.orderItemId ||
                      index
                    }
                    className={styles.item}
                  >

                    <div
                      className={styles.productInfo}
                    >

                      <h3>
                        Product
                      </h3>

                      <p
                        className={
                          styles.productId
                        }
                      >
                        Product ID:
                      </p>

                      <p
                        className={
                          styles.productIdValue
                        }
                      >
                        {item.productId}
                      </p>

                    </div>

                    <div
                      className={styles.itemInfo}
                    >

                      <span>
                        Quantity
                      </span>

                      <strong>
                        {item.quantity}
                      </strong>

                    </div>

                    <div
                      className={styles.itemInfo}
                    >

                      <span>
                        Unit Price
                      </span>

                      <strong>
                        ₹
                        {Number(
                          item.price || 0
                        ).toFixed(2)}
                      </strong>

                    </div>

                    <div
                      className={
                        styles.itemInfo
                      }
                    >

                      <span>
                        Total
                      </span>

                      <strong>
                        ₹
                        {itemTotal.toFixed(2)}
                      </strong>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* TOTAL */}

        <div className={styles.totalCard}>

          <div className={styles.totalRow}>

            <span>
              Order Total
            </span>

            <strong>
              ₹{Number(totalAmount).toFixed(2)}
            </strong>

          </div>

        </div>

        {/* ACTIONS */}

        <div className={styles.actions}>

          {status.toUpperCase() ===
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
    </div>
  );
}

export default OrderDetails;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

import styles from "./Orders.module.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/orders");

      console.log(
        "Orders response:",
        response.data
      );

      const data = response.data;

      /*
       * Backend may return either:
       * 1. Direct array
       * 2. Object containing orders
       */

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else if (Array.isArray(data.content)) {
        setOrders(data.content);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(
        "Failed to fetch orders:",
        error
      );

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Unable to load your orders."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
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

      setSuccess(
        "Order cancelled successfully."
      );

      /*
       * Refresh the order list so the
       * latest status is displayed.
       */
      await fetchOrders();
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
      setCancellingOrderId(null);
    }
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

  const getItemCount = (order) => {
    if (!Array.isArray(order.items)) {
      return 0;
    }

    return order.items.reduce(
      (total, item) =>
        total + (item.quantity || 0),
      0
    );
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.message}>
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>
            My Orders
          </h1>

          <p className={styles.subtitle}>
            View and manage your orders.
          </p>
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

        {orders.length === 0 ? (
          <div className={styles.emptyBox}>

            <h2>
              No Orders Yet
            </h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <Link
              to="/products"
              className={styles.shopButton}
            >
              Start Shopping
            </Link>

          </div>
        ) : (
          <div className={styles.ordersList}>

            {orders.map((order) => {

              const orderId =
                order.orderId || order.id;

              const status =
                order.status || "UNKNOWN";

              const total =
                order.totalAmount ??
                order.totalPrice ??
                0;

              return (
                <div
                  key={orderId}
                  className={styles.orderCard}
                >

                  <div className={styles.orderHeader}>

                    <div>
                      <h2 className={styles.orderId}>
                        Order #{orderId}
                      </h2>

                      <p className={styles.orderDate}>
                        Placed on{" "}
                        {formatDate(
                          order.createdAt
                        )}
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

                  <div className={styles.orderInfo}>

                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>
                        Items
                      </span>

                      <span className={styles.infoValue}>
                        {getItemCount(order)}
                      </span>
                    </div>

                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>
                        Total
                      </span>

                      <span className={styles.infoValue}>
                        ₹
                        {Number(total).toFixed(2)}
                      </span>
                    </div>

                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>
                        Payment
                      </span>

                      <span className={styles.infoValue}>
                        COD
                      </span>
                    </div>

                  </div>

                  {Array.isArray(order.items) &&
                    order.items.length > 0 && (
                      <div className={styles.itemsPreview}>

                        <h3>
                          Order Items
                        </h3>

                        {order.items.map(
                          (item, index) => (
                            <div
                              key={
                                item.orderItemId ||
                                index
                              }
                              className={
                                styles.itemRow
                              }
                            >

                              <span>
                                Product ID:{" "}
                                {item.productId}
                              </span>

                              <span>
                                Qty:{" "}
                                {item.quantity}
                              </span>

                              <span>
                                ₹
                                {Number(
                                  item.price || 0
                                ).toFixed(2)}
                              </span>

                            </div>
                          )
                        )}

                      </div>
                    )}

                  <div className={styles.actions}>

                   <Link
                      to={`/orders/${orderId}`}
                      className={styles.detailsButton}
                    >
                            View Details
                    </Link>

                    {status.toUpperCase() ===
                      "PENDING" && (
                      <button
                        type="button"
                        className={
                          styles.cancelButton
                        }
                        onClick={() =>
                          handleCancelOrder(
                            orderId
                          )
                        }
                        disabled={
                          cancellingOrderId ===
                          orderId
                        }
                      >
                        {cancellingOrderId ===
                        orderId
                          ? "Cancelling..."
                          : "Cancel Order"}
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

export default Orders;
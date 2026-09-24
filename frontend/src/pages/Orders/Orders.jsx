
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

      setError(
        error.response?.data?.message ||
          "Unable to load your orders."
      );
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

      await fetchOrders();
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

  const getItemCount = (order) => {
    if (!Array.isArray(order.items)) {
      return 0;
    }

    return order.items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  };

  const getPaymentMethod = (order) => {
    return (
      order.paymentMethod ||
      order.paymentType ||
      "COD"
    );
  };

  const getOrderNumber = (order) => {
    return (
      order.orderId ||
      order.id ||
      "N/A"
    );
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div
              className="spinner-border text-primary"
              role="status"
              aria-label="Loading orders"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p>
              Loading your orders...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              ACCOUNT
            </p>

            <h1 className={styles.title}>
              My Orders
            </h1>

            <p className={styles.subtitle}>
              View your order history and manage
              your recent purchases.
            </p>
          </div>

          <Link
            to="/products"
            className={styles.shopButton}
          >
            Continue Shopping
          </Link>
        </header>

        {/* ERROR */}
        {error && (
          <div
            className={styles.error}
            role="alert"
          >
            <span className={styles.alertIcon}>
              !
            </span>

            <span>{error}</span>

            {orders.length === 0 && (
              <button
                type="button"
                className={styles.retryButton}
                onClick={fetchOrders}
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* SUCCESS */}
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

        {/* EMPTY */}
        {orders.length === 0 ? (
          <div className={styles.emptyBox}>
            <div className={styles.emptyIcon}>
              📦
            </div>

            <p className={styles.emptyEyebrow}>
              ORDER HISTORY
            </p>

            <h2>
              No Orders Yet
            </h2>

            <p>
              You haven't placed any orders yet.
              Start shopping and your orders will
              appear here.
            </p>

            <Link
              to="/products"
              className={styles.primaryButton}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* ORDER COUNT */}
            <div className={styles.listHeader}>
              <div>
                <span className={styles.listEyebrow}>
                  ORDER HISTORY
                </span>

                <h2>
                  {orders.length}{" "}
                  {orders.length === 1
                    ? "Order"
                    : "Orders"}
                </h2>
              </div>
            </div>

            {/* ORDERS */}
            <div className={styles.ordersList}>
              {orders.map((order) => {
                const orderId =
                  getOrderNumber(order);

                const status =
                  order.status || "UNKNOWN";

                const total =
                  order.totalAmount ??
                  order.totalPrice ??
                  0;

                const itemCount =
                  getItemCount(order);

                const paymentMethod =
                  getPaymentMethod(order);

                return (
                  <article
                    key={orderId}
                    className={styles.orderCard}
                  >
                    {/* ORDER HEADER */}
                    <div
                      className={
                        styles.orderHeader
                      }
                    >
                      <div
                        className={
                          styles.orderIdentity
                        }
                      >
                        <div
                          className={
                            styles.orderIcon
                          }
                        >
                          📦
                        </div>

                        <div>
                          <p
                            className={
                              styles.orderLabel
                            }
                          >
                            ORDER
                          </p>

                          <h2
                            className={
                              styles.orderId
                            }
                          >
                            #{orderId}
                          </h2>

                          <p
                            className={
                              styles.orderDate
                            }
                          >
                            Placed on{" "}
                            {formatDate(
                              order.createdAt
                            )}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`${styles.status} ${getStatusClass(
                          status
                        )}`}
                      >
                        <span
                          className={
                            styles.statusDot
                          }
                        ></span>

                        {getStatusLabel(
                          status
                        )}
                      </span>
                    </div>

                    {/* ORDER SUMMARY */}
                    <div
                      className={
                        styles.orderInfo
                      }
                    >
                      <div
                        className={
                          styles.infoItem
                        }
                      >
                        <span
                          className={
                            styles.infoLabel
                          }
                        >
                          Items
                        </span>

                        <strong
                          className={
                            styles.infoValue
                          }
                        >
                          {itemCount}
                        </strong>
                      </div>

                      <div
                        className={
                          styles.infoItem
                        }
                      >
                        <span
                          className={
                            styles.infoLabel
                          }
                        >
                          Total Amount
                        </span>

                        <strong
                          className={
                            styles.infoValue
                          }
                        >
                          ₹
                          {formatPrice(
                            total
                          )}
                        </strong>
                      </div>

                      <div
                        className={
                          styles.infoItem
                        }
                      >
                        <span
                          className={
                            styles.infoLabel
                          }
                        >
                          Payment
                        </span>

                        <strong
                          className={
                            styles.infoValue
                          }
                        >
                          {paymentMethod}
                        </strong>
                      </div>
                    </div>

                    {/* ITEMS PREVIEW */}
                    {Array.isArray(
                      order.items
                    ) &&
                      order.items.length > 0 && (
                        <div
                          className={
                            styles.itemsPreview
                          }
                        >
                          <div
                            className={
                              styles.itemsHeader
                            }
                          >
                            <h3>
                              Order Items
                            </h3>

                            <span>
                              {order.items.length}{" "}
                              product
                              {order.items.length ===
                              1
                                ? ""
                                : "s"}
                            </span>
                          </div>

                          <div
                            className={
                              styles.itemList
                            }
                          >
                            {order.items.map(
                              (
                                item,
                                index
                              ) => (
                                <div
                                  key={
                                    item.orderItemId ||
                                    item.id ||
                                    index
                                  }
                                  className={
                                    styles.itemRow
                                  }
                                >
                                  <div
                                    className={
                                      styles.itemProduct
                                    }
                                  >
                                    <span
                                      className={
                                        styles.itemIcon
                                      }
                                    >
                                      🛍️
                                    </span>

                                    <div>
                                      <span
                                        className={
                                          styles.itemName
                                        }
                                      >
                                        Product
                                      </span>

                                      <span
                                        className={
                                          styles.itemProductId
                                        }
                                      >
                                        ID:{" "}
                                        {
                                          item.productId
                                        }
                                      </span>
                                    </div>
                                  </div>

                                  <span
                                    className={
                                      styles.itemQuantity
                                    }
                                  >
                                    Qty:{" "}
                                    {
                                      item.quantity
                                    }
                                  </span>

                                  <strong
                                    className={
                                      styles.itemPrice
                                    }
                                  >
                                    ₹
                                    {formatPrice(
                                      item.price
                                    )}
                                  </strong>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* ACTIONS */}
                    <div
                      className={
                        styles.actions
                      }
                    >
                      <Link
                        to={`/orders/${orderId}`}
                        className={
                          styles.detailsButton
                        }
                      >
                        View Details
                        <span>→</span>
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
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Orders;


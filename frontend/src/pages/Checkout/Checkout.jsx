
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";

import styles from "./Checkout.module.css";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState({});

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/cart");

      console.log(
        "Checkout cart response:",
        response.data
      );

      const cartData = response.data;

      setCart(cartData);

      if (
        cartData.items &&
        cartData.items.length > 0
      ) {
        const productResults =
          await Promise.all(
            cartData.items.map(async (item) => {
              try {
                const response = await api.get(
                  `/api/products/${item.productId}`
                );

                return {
                  productId: item.productId,
                  product: response.data,
                };
              } catch (error) {
                console.error(
                  `Failed to fetch product ${item.productId}:`,
                  error
                );

                return {
                  productId: item.productId,
                  product: null,
                };
              }
            })
          );

        const productMap = {};

        productResults.forEach((result) => {
          productMap[result.productId] =
            result.product;
        });

        setProducts(productMap);

        console.log(
          "Checkout products:",
          productMap
        );
      } else {
        setProducts({});
      }
    } catch (error) {
      console.error(
        "Failed to load checkout:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load checkout."
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity =
        Number(item.quantity) || 0;

      return total + price * quantity;
    }, 0);
  };

  const calculateTotalItems = () => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
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

  const handlePlaceOrder = async () => {
    if (
      !cart?.items ||
      cart.items.length === 0
    ) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const orderRequest = {
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),

        paymentMethod,
      };

      console.log(
        "Creating order:",
        orderRequest
      );

      // ==========================================
      // STEP 1: CREATE ORDER
      // ==========================================

      const response = await api.post(
        "/api/orders",
        orderRequest
      );

      console.log(
        "Order created successfully:",
        response.data
      );

      // ==========================================
      // STEP 2: CLEAR CART
      // ==========================================

      console.log(
        "Clearing cart after successful order..."
      );

      try {
        await api.delete("/api/cart");

        console.log(
          "Cart cleared successfully."
        );
      } catch (cartError) {
        console.error(
          "Order was created, but cart could not be cleared:",
          cartError
        );

        /*
         * The order was already successfully created.
         * We do not cancel the order just because
         * clearing the cart failed.
         */
      }

      // ==========================================
      // STEP 3: UPDATE LOCAL CART STATE
      // ==========================================

      setCart({
        ...cart,
        items: [],
      });

      // ==========================================
      // STEP 4: GO TO ORDERS
      // ==========================================

      navigate("/orders");
    } catch (error) {
      console.error(
        "Failed to place order:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div
              className="spinner-border text-primary"
              role="status"
              aria-label="Loading checkout"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p>
              Loading checkout...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ============================================
  // ERROR LOADING CART
  // ============================================

  if (error && !cart) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>
              !
            </div>

            <p className={styles.errorEyebrow}>
              CHECKOUT
            </p>

            <h2>
              Unable to Load Checkout
            </h2>

            <p>{error}</p>

            <Link
              to="/cart"
              className={styles.primaryButton}
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ============================================
  // EMPTY CART
  // ============================================

  if (
    !cart?.items ||
    cart.items.length === 0
  ) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              🛒
            </div>

            <p className={styles.emptyEyebrow}>
              CHECKOUT
            </p>

            <h2>
              Your Cart is Empty
            </h2>

            <p>
              Add some products to your cart before
              proceeding to checkout.
            </p>

            <Link
              to="/products"
              className={styles.primaryButton}
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const subtotal = calculateSubtotal();
  const totalItems = calculateTotalItems();

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              SECURE CHECKOUT
            </p>

            <h1 className={styles.title}>
              Checkout
            </h1>

            <p className={styles.subtitle}>
              Review your order and choose your
              preferred payment method.
            </p>
          </div>

          <Link
            to="/cart"
            className={styles.cartLink}
          >
            ← Back to Cart
          </Link>
        </header>

        {/* ERROR */}
        {error && (
          <div
            className={styles.errorMessage}
            role="alert"
          >
            <span
              className={
                styles.errorMessageIcon
              }
            >
              !
            </span>

            <span>{error}</span>
          </div>
        )}

        <div className={styles.checkoutLayout}>

          {/* LEFT SIDE */}
          <div className={styles.orderSection}>

            {/* ORDER ITEMS */}
            <section
              className={styles.sectionCard}
            >
              <div
                className={
                  styles.sectionHeader
                }
              >
                <div>
                  <p
                    className={
                      styles.sectionEyebrow
                    }
                  >
                    YOUR ORDER
                  </p>

                  <h2
                    className={
                      styles.sectionTitle
                    }
                  >
                    Order Items
                  </h2>
                </div>

                <span
                  className={styles.itemBadge}
                >
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "Item"
                    : "Items"}
                </span>
              </div>

              <div
                className={styles.itemsList}
              >
                {cart.items.map((item) => {
                  const product =
                    products[item.productId];

                  const image =
                    product?.imageUrl ||
                    product?.image ||
                    "";

                  const itemTotal =
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

                  return (
                    <article
                      key={item.productId}
                      className={styles.item}
                    >
                      {/* IMAGE */}
                      <Link
                        to={`/products/${item.productId}`}
                        className={
                          styles.imageLink
                        }
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={
                              product?.name ||
                              "Product"
                            }
                            className={
                              styles.image
                            }
                            onError={(
                              event
                            ) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div
                            className={
                              styles.imagePlaceholder
                            }
                          >
                            🛍️
                          </div>
                        )}
                      </Link>

                      {/* DETAILS */}
                      <div
                        className={
                          styles.itemDetails
                        }
                      >
                        <Link
                          to={`/products/${item.productId}`}
                          className={
                            styles.productName
                          }
                        >
                          {product?.name ||
                            "Product"}
                        </Link>

                        {product?.category && (
                          <span
                            className={
                              styles.category
                            }
                          >
                            {product.category}
                          </span>
                        )}

                        <p
                          className={
                            styles.quantity
                          }
                        >
                          Quantity:{" "}
                          <strong>
                            {item.quantity}
                          </strong>
                        </p>

                        <p
                          className={
                            styles.unitPrice
                          }
                        >
                          ₹
                          {formatPrice(
                            item.price
                          )}{" "}
                          per item
                        </p>
                      </div>

                      {/* PRICE */}
                      <div
                        className={
                          styles.itemPrice
                        }
                      >
                        <span>
                          Subtotal
                        </span>

                        <strong>
                          ₹
                          {formatPrice(
                            itemTotal
                          )}
                        </strong>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* PAYMENT */}
            <section
              className={styles.sectionCard}
            >
              <div
                className={
                  styles.sectionHeader
                }
              >
                <div>
                  <p
                    className={
                      styles.sectionEyebrow
                    }
                  >
                    PAYMENT
                  </p>

                  <h2
                    className={
                      styles.sectionTitle
                    }
                  >
                    Payment Method
                  </h2>
                </div>
              </div>

              <div
                className={
                  styles.paymentOptions
                }
              >
                <label
                  className={
                    paymentMethod === "COD"
                      ? `${styles.paymentOption} ${styles.selected}`
                      : styles.paymentOption
                  }
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={
                      paymentMethod === "COD"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                  />

                  <span
                    className={
                      styles.radioCustom
                    }
                  ></span>

                  <span
                    className={
                      styles.paymentIcon
                    }
                  >
                    💵
                  </span>

                  <span
                    className={
                      styles.paymentContent
                    }
                  >
                    <strong>
                      Cash on Delivery
                    </strong>

                    <small>
                      Pay when your order is
                      delivered.
                    </small>
                  </span>

                  {paymentMethod === "COD" && (
                    <span
                      className={
                        styles.selectedBadge
                      }
                    >
                      Selected
                    </span>
                  )}
                </label>
              </div>
            </section>

            {/* TRUST */}
            <div className={styles.trustBox}>
              <div className={styles.trustIcon}>
                ✓
              </div>

              <div>
                <strong>
                  Secure Order Processing
                </strong>

                <p>
                  Your order is securely processed
                  through the e-commerce
                  microservices architecture.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <aside className={styles.summaryCard}>
            <div
              className={
                styles.summaryHeader
              }
            >
              <p
                className={
                  styles.summaryEyebrow
                }
              >
                SUMMARY
              </p>

              <h2>
                Order Summary
              </h2>
            </div>

            <div
              className={
                styles.summaryContent
              }
            >
              <div className={styles.summaryRow}>
                <span>
                  Items
                </span>

                <strong>
                  {totalItems}
                </strong>
              </div>

              <div className={styles.summaryRow}>
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {formatPrice(subtotal)}
                </strong>
              </div>

              <div className={styles.summaryRow}>
                <span>
                  Payment
                </span>

                <span
                  className={
                    styles.paymentValue
                  }
                >
                  Cash on Delivery
                </span>
              </div>

              <div
                className={
                  styles.shippingRow
                }
              >
                <div>
                  <span>
                    Shipping
                  </span>

                  <small>
                    Delivery charges
                  </small>
                </div>

                <strong>
                  At checkout
                </strong>
              </div>

              <div
                className={styles.divider}
              />

              <div className={styles.totalRow}>
                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {formatPrice(subtotal)}
                </strong>
              </div>

              <button
                type="button"
                className={
                  styles.placeOrderButton
                }
                onClick={handlePlaceOrder}
                disabled={placingOrder}
              >
                {placingOrder ? (
                  <>
                    <span
                      className={
                        styles.buttonSpinner
                      }
                    ></span>

                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <span>→</span>
                  </>
                )}
              </button>

              <Link
                to="/cart"
                className={styles.backToCart}
              >
                ← Edit Cart
              </Link>

              <p
                className={
                  styles.summaryNote
                }
              >
                By placing your order, you confirm
                the items and payment method selected
                above.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Checkout;



import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

import styles from "./Cart.module.css";

function Cart() {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingProductId, setUpdatingProductId] =
    useState(null);

  const [removingProductId, setRemovingProductId] =
    useState(null);

  const [clearingCart, setClearingCart] =
    useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  // ======================================================
  // FETCH CART
  // ======================================================
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      await refreshCart();
    } catch (error) {
      console.error(
        "Failed to fetch cart:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load your cart. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // REFRESH CART WITHOUT FULL PAGE LOADING
  // ======================================================
  const refreshCart = async () => {
    const response = await api.get("/api/cart");

    console.log(
      "Cart response:",
      response.data
    );

    setCart(response.data);

    await fetchProducts(
      response.data?.items || []
    );

    return response.data;
  };

  // ======================================================
  // FETCH PRODUCT DETAILS
  // ======================================================
  const fetchProducts = async (items) => {
    if (!items.length) {
      setProducts({});
      return;
    }

    try {
      const productRequests = items.map(
        async (item) => {
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
        }
      );

      const results =
        await Promise.all(productRequests);

      const productMap = {};

      results.forEach((result) => {
        productMap[result.productId] =
          result.product;
      });

      setProducts(productMap);

      console.log(
        "Cart product details:",
        productMap
      );
    } catch (error) {
      console.error(
        "Failed to fetch product details:",
        error
      );
    }
  };

  // ======================================================
  // CALCULATE ITEM SUBTOTAL
  // ======================================================
  const calculateSubtotal = (item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;

    return price * quantity;
  };

  // ======================================================
  // CALCULATE TOTAL
  // ======================================================
  const calculateTotal = () => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce(
      (total, item) =>
        total + calculateSubtotal(item),
      0
    );
  };

  // ======================================================
  // CALCULATE TOTAL ITEMS
  // ======================================================
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

  // ======================================================
  // FORMAT PRICE
  // ======================================================
  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN"
    );
  };

  // ======================================================
  // UPDATE QUANTITY
  // ======================================================
  const updateQuantity = async (
    productId,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      setUpdatingProductId(productId);
      setError("");

      const response = await api.put(
        `/api/cart/items/${productId}`,
        {
          quantity: newQuantity,
        }
      );

      console.log(
        "Updated cart:",
        response.data
      );

      // Use backend response when it contains
      // the updated cart.
      if (
        response.data &&
        Array.isArray(response.data.items)
      ) {
        setCart(response.data);

        await fetchProducts(
          response.data.items
        );
      } else {
        // Fallback: reload actual cart
        await refreshCart();
      }
    } catch (error) {
      console.error(
        "Failed to update cart:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update cart item."
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  // ======================================================
  // REMOVE SINGLE CART ITEM
  // ======================================================
  const removeItem = async (productId) => {
    try {
      setRemovingProductId(productId);
      setError("");

      console.log(
        "Removing cart item:",
        productId
      );

      await api.delete(
        `/api/cart/items/${productId}`
      );

      console.log(
        "Cart item removed successfully:",
        productId
      );

      // IMPORTANT:
      // Do NOT use the DELETE response to update
      // the cart.
      //
      // Fetch the actual cart again so that only
      // the selected product is removed.
      const updatedCart =
        await refreshCart();

      console.log(
        "Cart after removing item:",
        updatedCart
      );
    } catch (error) {
      console.error(
        "Failed to remove cart item:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to remove cart item."
      );
    } finally {
      setRemovingProductId(null);
    }
  };

  // ======================================================
  // CLEAR ENTIRE CART
  // ======================================================
  const clearCart = async () => {
    try {
      setClearingCart(true);
      setError("");

      const response = await api.delete(
        "/api/cart"
      );

      console.log(
        "Cart cleared:",
        response.data
      );

      // The clear-cart operation is intentionally
      // supposed to remove every item.
      if (
        response.data &&
        Array.isArray(response.data.items)
      ) {
        setCart(response.data);
      } else {
        await refreshCart();
      }

      setProducts({});
    } catch (error) {
      console.error(
        "Failed to clear cart:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to clear cart."
      );
    } finally {
      setClearingCart(false);
    }
  };

  // ======================================================
  // LOADING STATE
  // ======================================================
  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div
              className="spinner-border text-primary"
              role="status"
              aria-label="Loading cart"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p>Loading your cart...</p>
          </div>
        </div>
      </main>
    );
  }

  // ======================================================
  // ERROR STATE
  // ======================================================
  if (error && !cart) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>
              !
            </div>

            <h2>Unable to Load Cart</h2>

            <p>{error}</p>

            <button
              type="button"
              className={styles.retryButton}
              onClick={fetchCart}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const items = cart?.items || [];
  const total = calculateTotal();
  const totalItems = calculateTotalItems();

  // ======================================================
  // MAIN UI
  // ======================================================
  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* PAGE HEADER */}
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              SHOPPING CART
            </p>

            <h1 className={styles.title}>
              Your Cart
            </h1>

            <p className={styles.subtitle}>
              Review your selected products before
              proceeding to checkout.
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearCart}
              disabled={
                clearingCart ||
                removingProductId !== null
              }
            >
              {clearingCart
                ? "Clearing..."
                : "Clear Cart"}
            </button>
          )}
        </header>

        {/* ERROR MESSAGE */}
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

        {/* EMPTY CART */}
        {items.length === 0 ? (
          <section className={styles.emptyCart}>
            <div className={styles.emptyIcon}>
              🛒
            </div>

            <p className={styles.emptyEyebrow}>
              YOUR CART
            </p>

            <h2>
              Your cart is empty
            </h2>

            <p
              className={
                styles.emptyDescription
              }
            >
              You haven't added any products to your
              cart yet. Explore our products and find
              something you like.
            </p>

            <Link
              to="/products"
              className={styles.shopButton}
            >
              Browse Products
            </Link>
          </section>
        ) : (
          <div className={styles.content}>

            {/* CART ITEMS */}
            <section className={styles.itemsSection}>
              <div className={styles.itemsHeader}>
                <div>
                  <h2>
                    Cart Items
                  </h2>

                  <p>
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "item"
                      : "items"}{" "}
                    in your cart
                  </p>
                </div>

                <span className={styles.itemCount}>
                  {items.length}{" "}
                  {items.length === 1
                    ? "Product"
                    : "Products"}
                </span>
              </div>

              <div className={styles.itemList}>
                {items.map((item) => {
                  const product =
                    products[item.productId];

                  const subtotal =
                    calculateSubtotal(item);

                  const isUpdating =
                    updatingProductId ===
                    item.productId;

                  const isRemoving =
                    removingProductId ===
                    item.productId;

                  const image =
                    product?.imageUrl ||
                    product?.image ||
                    "";

                  return (
                    <article
                      key={item.productId}
                      className={
                        styles.cartItem
                      }
                    >
                      {/* IMAGE */}
                      <Link
                        to={`/products/${item.productId}`}
                        className={
                          styles.productImageLink
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
                              styles.productImage
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
                            <span>
                              🛍️
                            </span>
                          </div>
                        )}
                      </Link>

                      {/* PRODUCT INFORMATION */}
                      <div
                        className={
                          styles.productInfo
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
                            styles.unitPrice
                          }
                        >
                          ₹
                          {formatPrice(
                            item.price
                          )}{" "}
                          <span>
                            per item
                          </span>
                        </p>

                        <p
                          className={
                            styles.productId
                          }
                        >
                          ID:{" "}
                          {item.productId}
                        </p>
                      </div>

                      {/* QUANTITY */}
                      <div
                        className={
                          styles.quantitySection
                        }
                      >
                        <span
                          className={
                            styles.sectionLabel
                          }
                        >
                          Quantity
                        </span>

                        <div
                          className={
                            styles.quantityControls
                          }
                        >
                          <button
                            type="button"
                            className={
                              styles.quantityButton
                            }
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity -
                                  1
                              )
                            }
                            disabled={
                              item.quantity <=
                                1 ||
                              isUpdating ||
                              isRemoving
                            }
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>

                          <span
                            className={
                              styles.quantity
                            }
                          >
                            {isUpdating
                              ? "..."
                              : item.quantity}
                          </span>

                          <button
                            type="button"
                            className={
                              styles.quantityButton
                            }
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity +
                                  1
                              )
                            }
                            disabled={
                              isUpdating ||
                              isRemoving
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* SUBTOTAL */}
                      <div
                        className={
                          styles.subtotalSection
                        }
                      >
                        <span
                          className={
                            styles.sectionLabel
                          }
                        >
                          Subtotal
                        </span>

                        <strong>
                          ₹
                          {formatPrice(
                            subtotal
                          )}
                        </strong>
                      </div>

                      {/* REMOVE */}
                      <button
                        type="button"
                        className={
                          styles.removeButton
                        }
                        onClick={() =>
                          removeItem(
                            item.productId
                          )
                        }
                        disabled={
                          isRemoving ||
                          isUpdating ||
                          removingProductId !==
                            null
                        }
                      >
                        {isRemoving
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </article>
                  );
                })}
              </div>

              {/* CONTINUE SHOPPING */}
              <Link
                to="/products"
                className={
                  styles.continueShopping
                }
              >
                ← Continue Shopping
              </Link>
            </section>

            {/* ORDER SUMMARY */}
            <aside className={styles.summary}>
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
                <div
                  className={
                    styles.summaryRow
                  }
                >
                  <span>
                    Items
                  </span>

                  <strong>
                    {totalItems}
                  </strong>
                </div>

                <div
                  className={
                    styles.summaryRow
                  }
                >
                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹
                    {formatPrice(total)}
                  </strong>
                </div>

                <div
                  className={
                    styles.summaryRow
                  }
                >
                  <span>
                    Shipping
                  </span>

                  <span
                    className={
                      styles.shippingText
                    }
                  >
                    At checkout
                  </span>
                </div>

                <div
                  className={
                    styles.divider
                  }
                />

                <div
                  className={
                    styles.totalRow
                  }
                >
                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {formatPrice(total)}
                  </strong>
                </div>

                <Link
                  to="/checkout"
                  className={
                    styles.checkoutButton
                  }
                >
                  Proceed to Checkout
                  <span>→</span>
                </Link>

                <p
                  className={
                    styles.checkoutNote
                  }
                >
                  Secure checkout powered by our
                  microservices architecture.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;


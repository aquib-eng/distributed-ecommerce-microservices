import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

import styles from "./Cart.module.css";

function Cart() {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [removingProductId, setRemovingProductId] = useState(null);
  const [clearingCart, setClearingCart] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/cart");

      console.log("Cart response:", response.data);

      setCart(response.data);

      await fetchProducts(response.data.items || []);
    } catch (error) {
      console.error(
        "Failed to fetch cart:",
        error
      );

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to load cart.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (items) => {
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

  const refreshCart = async () => {
    try {
      const response = await api.get("/api/cart");

      console.log(
        "Refreshed cart:",
        response.data
      );

      setCart(response.data);

      await fetchProducts(
        response.data.items || []
      );
    } catch (error) {
      console.error(
        "Failed to refresh cart:",
        error
      );

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Unable to refresh cart."
        );
      }
    }
  };

  const calculateSubtotal = (item) => {
    return (
      Number(item.price) *
      Number(item.quantity)
    );
  };

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

      setCart(response.data);

      await fetchProducts(
        response.data.items || []
      );
    } catch (error) {
      console.error(
        "Failed to update cart:",
        error
      );

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Unable to update cart item."
        );
      }
    } finally {
      setUpdatingProductId(null);
    }
  };

  const removeItem = async (productId) => {
    try {
      setRemovingProductId(productId);
      setError("");

      const response = await api.delete(
        `/api/cart/items/${productId}`
      );

      console.log(
        "Removed cart item:",
        response.data
      );

      setCart(response.data);

      await fetchProducts(
        response.data.items || []
      );
    } catch (error) {
      console.error(
        "Failed to remove cart item:",
        error
      );

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Unable to remove cart item."
        );
      }
    } finally {
      setRemovingProductId(null);
    }
  };

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

      setCart(response.data);
      setProducts({});
    } catch (error) {
      console.error(
        "Failed to clear cart:",
        error
      );

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Unable to clear cart."
        );
      }
    } finally {
      setClearingCart(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.message}>
            Loading cart...
          </div>
        </div>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>
              Unable to Load Cart
            </h2>

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
      </div>
    );
  }

  const items = cart?.items || [];
  const total = calculateTotal();

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Shopping Cart
            </h1>

            <p className={styles.subtitle}>
              Review your items before checkout.
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearCart}
              disabled={clearingCart}
            >
              {clearingCart
                ? "Clearing..."
                : "Clear Cart"}
            </button>
          )}
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className={styles.emptyCart}>
            <div className={styles.emptyIcon}>
              🛒
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              You haven't added any products
              to your cart yet.
            </p>

            <Link
              to="/products"
              className={styles.shopButton}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.content}>

            <div className={styles.itemsSection}>

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

                return (
                  <div
                    key={item.productId}
                    className={styles.cartItem}
                  >

                    <Link
                      to={`/products/${item.productId}`}
                      className={styles.productImageLink}
                    >
                      {product?.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={
                            product.name ||
                            "Product"
                          }
                          className={styles.productImage}
                        />
                      ) : (
                        <div
                          className={
                            styles.imagePlaceholder
                          }
                        >
                          Product
                        </div>
                      )}
                    </Link>

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
                        <p
                          className={
                            styles.category
                          }
                        >
                          {product.category}
                        </p>
                      )}

                      <p
                        className={
                          styles.productId
                        }
                      >
                        Product ID:
                        <br />
                        {item.productId}
                      </p>

                      <p
                        className={
                          styles.price
                        }
                      >
                        ₹
                        {Number(
                          item.price
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    <div
                      className={
                        styles.quantitySection
                      }
                    >
                      <span>
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
                              item.quantity - 1
                            )
                          }
                          disabled={
                            item.quantity <= 1 ||
                            isUpdating
                          }
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
                              item.quantity + 1
                            )
                          }
                          disabled={
                            isUpdating
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div
                      className={
                        styles.subtotalSection
                      }
                    >
                      <span>
                        Subtotal
                      </span>

                      <strong>
                        ₹
                        {subtotal.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

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
                      disabled={isRemoving}
                    >
                      {isRemoving
                        ? "Removing..."
                        : "Remove"}
                    </button>

                  </div>
                );
              })}
            </div>

            <div
              className={
                styles.summary
              }
            >
              <h2>
                Order Summary
              </h2>

              <div
                className={
                  styles.summaryRow
                }
              >
                <span>
                  Items
                </span>

                <span>
                  {items.reduce(
                    (total, item) =>
                      total +
                      Number(
                        item.quantity
                      ),
                    0
                  )}
                </span>
              </div>

              <div
                className={
                  styles.summaryRow
                }
              >
                <span>
                  Subtotal
                </span>

                <span>
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div
                className={
                  styles.summaryRow
                }
              >
                <span>
                  Shipping
                </span>

                <span>
                  Calculated at checkout
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
                <strong>
                  Total
                </strong>

                <strong>
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <Link
                to="/checkout"
                className={
                  styles.checkoutButton
                }
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className={
                  styles.continueButton
                }
              >
                Continue Shopping
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
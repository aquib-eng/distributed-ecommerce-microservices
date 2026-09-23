import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";

import styles from "./Checkout.module.css";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState({});

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/cart");

      console.log("Checkout cart response:", response.data);

      const cartData = response.data;

      setCart(cartData);

      if (cartData.items && cartData.items.length > 0) {
        const productResponses = await Promise.all(
          cartData.items.map((item) =>
            api.get(`/api/products/${item.productId}`)
          )
        );

        const productMap = {};

        productResponses.forEach((response, index) => {
          const productId = cartData.items[index].productId;

          productMap[productId] = response.data;
        });

        setProducts(productMap);

        console.log(
          "Checkout products:",
          productMap
        );
      }
    } catch (error) {
      console.error(
        "Failed to load checkout:",
        error
      );

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to load checkout.");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const calculateTotalItems = () => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      setError("");

      if (!cart?.items || cart.items.length === 0) {
        setError("Your cart is empty.");
        return;
      }

      const orderRequest = {
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),

        paymentMethod: paymentMethod,
      };

      console.log(
        "Creating order:",
        orderRequest
      );

      const response = await api.post(
        "/api/orders",
        orderRequest
      );

      console.log(
        "Order created successfully:",
        response.data
      );

      alert("Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error(
        "Failed to place order:",
        error
      );

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Unable to place order. Please try again."
        );
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.message}>
            Loading checkout...
          </p>
        </div>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.errorBox}>
            <h2>
              Checkout Error
            </h2>

            <p>
              {error}
            </p>

            <Link
              to="/cart"
              className={styles.primaryButton}
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.emptyBox}>
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
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const totalItems = calculateTotalItems();

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>
            Checkout
          </h1>

          <p className={styles.subtitle}>
            Review your order and select a payment
            method.
          </p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.checkoutLayout}>

          {/* ORDER ITEMS */}

          <div className={styles.orderSection}>

            <div className={styles.sectionCard}>

              <h2 className={styles.sectionTitle}>
                Order Items
              </h2>

              <div className={styles.itemsList}>

                {cart.items.map((item) => {
                  const product =
                    products[item.productId];

                  return (
                    <div
                      key={item.productId}
                      className={styles.item}
                    >

                      <div className={styles.imageContainer}>

                        {product?.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className={styles.image}
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

                      </div>

                      <div className={styles.itemDetails}>

                        <Link
                          to={`/products/${item.productId}`}
                          className={styles.productName}
                        >
                          {product?.name ||
                            "Product"}
                        </Link>

                        {product?.category && (
                          <p className={styles.category}>
                            {product.category}
                          </p>
                        )}

                        <p className={styles.productId}>
                          Product ID:{" "}
                          {item.productId}
                        </p>

                        <p className={styles.quantity}>
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                      </div>

                      <div className={styles.itemPrice}>

                        <p className={styles.price}>
                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </p>

                        <p className={styles.unitPrice}>
                          ₹
                          {item.price.toFixed(2)} each
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            {/* PAYMENT */}

            <div className={styles.sectionCard}>

              <h2 className={styles.sectionTitle}>
                Payment Method
              </h2>

              <div className={styles.paymentOptions}>

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

                  <div>
                    <strong>
                      Cash on Delivery
                    </strong>

                    <p>
                      Pay when your order is
                      delivered.
                    </p>
                  </div>

                </label>

              </div>

            </div>

          </div>

          {/* ORDER SUMMARY */}

          <aside className={styles.summaryCard}>

            <h2 className={styles.sectionTitle}>
              Order Summary
            </h2>

            <div className={styles.summaryRow}>
              <span>
                Items
              </span>

              <span>
                {totalItems}
              </span>
            </div>

            <div className={styles.summaryRow}>
              <span>
                Subtotal
              </span>

              <span>
                ₹{subtotal.toFixed(2)}
              </span>
            </div>

            <div className={styles.summaryRow}>
              <span>
                Payment
              </span>

              <span>
                {paymentMethod}
              </span>
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
              <span>
                Total
              </span>

              <span>
                ₹{subtotal.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              className={styles.placeOrderButton}
              onClick={handlePlaceOrder}
              disabled={placingOrder}
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"}
            </button>

            <Link
              to="/cart"
              className={styles.backToCart}
            >
              ← Back to Cart
            </Link>

          </aside>

        </div>

      </div>
    </div>
  );
}

export default Checkout;
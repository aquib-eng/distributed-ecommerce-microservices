import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../services/api";

import styles from "./ProductDetails.module.css";

function ProductDetails() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.get(
        `/api/products/${productId}`
      );

      console.log(
        "Product details:",
        response.data
      );

      setProduct(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load product details."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStockQuantity = () => {
    if (!product) {
      return 0;
    }

    const stock =
      product.stockQuantity ??
      product.stock ??
      0;

    const numericStock = Number(stock);

    return Number.isFinite(numericStock)
      ? numericStock
      : 0;
  };

  const stockQuantity = getStockQuantity();

  const isOutOfStock = stockQuantity <= 0;

  const increaseQuantity = () => {
    setQuantity((currentQuantity) => {
      if (currentQuantity >= stockQuantity) {
        return currentQuantity;
      }

      return currentQuantity + 1;
    });
  };

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) =>
      Math.max(1, currentQuantity - 1)
    );
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      setError("This product is currently out of stock.");
      return;
    }

    try {
      setAddingToCart(true);
      setError("");
      setSuccess("");

      const cartItem = {
        productId: product.id,
        quantity,
        price: product.price,
      };

      console.log(
        "Adding product to cart:",
        cartItem
      );

      const response = await api.post(
        "/api/cart/items",
        cartItem
      );

      console.log(
        "Add to cart response:",
        response.data
      );

      setSuccess(
        `${product.name} added to cart successfully.`
      );
    } catch (error) {
      console.error(
        "Failed to add product to cart:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to add product to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN"
    );
  };

  const getStockStatus = () => {
    if (stockQuantity <= 0) {
      return {
        text: "Out of Stock",
        className: styles.outOfStock,
      };
    }

    if (stockQuantity <= 5) {
      return {
        text: `Only ${stockQuantity} left`,
        className: styles.lowStock,
      };
    }

    return {
      text: `${stockQuantity} in stock`,
      className: styles.inStock,
    };
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div
              className="spinner-border text-primary"
              role="status"
              aria-label="Loading product"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p>
              Loading product details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !product) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>
            <div className={styles.errorIcon}>
              !
            </div>

            <h2>
              Product Not Found
            </h2>

            <p>{error}</p>

            <Link
              to="/products"
              className={styles.backButton}
            >
              ← Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  const image =
    product.imageUrl ||
    product.image ||
    "";

  const stockStatus = getStockStatus();

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* ==============================
            BACK LINK
        ============================== */}

        <Link
          to="/products"
          className={styles.backLink}
        >
          ← Back to Products
        </Link>

        {/* ==============================
            PRODUCT SECTION
        ============================== */}

        <section className={styles.productLayout}>

          {/* ==============================
              IMAGE
          ============================== */}

          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              {image ? (
                <img
                  src={image}
                  alt={product.name}
                  className={styles.image}
                  onError={(event) => {
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
                  <span>🛍️</span>
                  <p>Product Image</p>
                </div>
              )}

              {product.category && (
                <span
                  className={styles.categoryBadge}
                >
                  {product.category}
                </span>
              )}

              {isOutOfStock && (
                <span
                  className={
                    styles.imageStockBadge
                  }
                >
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* ==============================
              DETAILS
          ============================== */}

          <div className={styles.details}>

            <div className={styles.detailsHeader}>
              <p className={styles.eyebrow}>
                PRODUCT DETAILS
              </p>

              <h1 className={styles.title}>
                {product.name}
              </h1>

              <p className={styles.productId}>
                Product ID: {product.id}
              </p>
            </div>

            {/* PRICE */}

            <div className={styles.priceSection}>
              <span className={styles.priceLabel}>
                Price
              </span>

              <span className={styles.price}>
                ₹{formatPrice(product.price)}
              </span>
            </div>

            {/* STOCK */}

            <div className={styles.stockRow}>
              <span
                className={stockStatus.className}
              >
                ● {stockStatus.text}
              </span>
            </div>

            {/* DESCRIPTION */}

            <div className={styles.descriptionSection}>
              <h2>Description</h2>

              <p className={styles.description}>
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>

            {/* INFORMATION */}

            <div className={styles.infoGrid}>
              {product.category && (
                <div className={styles.infoCard}>
                  <span className={styles.infoLabel}>
                    Category
                  </span>

                  <strong>
                    {product.category}
                  </strong>
                </div>
              )}

              {product.brand && (
                <div className={styles.infoCard}>
                  <span className={styles.infoLabel}>
                    Brand
                  </span>

                  <strong>
                    {product.brand}
                  </strong>
                </div>
              )}

              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>
                  Availability
                </span>

                <strong>
                  {isOutOfStock
                    ? "Unavailable"
                    : "Available"}
                </strong>
              </div>
            </div>

            {/* QUANTITY */}

            {!isOutOfStock && (
              <div className={styles.purchaseSection}>

                <div className={styles.quantitySection}>
                  <span
                    className={styles.quantityLabel}
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
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span
                      className={styles.quantity}
                    >
                      {quantity}
                    </span>

                    <button
                      type="button"
                      className={
                        styles.quantityButton
                      }
                      onClick={increaseQuantity}
                      disabled={
                        quantity >= stockQuantity
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <p className={styles.stockHint}>
                  Maximum available:{" "}
                  {stockQuantity}
                </p>

              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className={styles.success}>
                <span>✓</span>
                <p>{success}</p>
              </div>
            )}

            {/* ERROR */}

            {error && product && (
              <div className={styles.errorMessage}>
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            {/* ACTION */}

            {isOutOfStock ? (
              <button
                type="button"
                className={
                  styles.disabledButton
                }
                disabled
              >
                Out of Stock
              </button>
            ) : (
              <button
                type="button"
                className={styles.addButton}
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart
                  ? "Adding to Cart..."
                  : "Add to Cart"}
              </button>
            )}

            {success && (
              <Link
                to="/cart"
                className={styles.cartLink}
              >
                Go to Cart →
              </Link>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductDetails;
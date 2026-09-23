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

      if (error.response?.data?.message) {
        setError(
          error.response.data.message
        );
      } else {
        setError(
          "Unable to load product details."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) =>
      Math.max(1, currentQuantity - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((currentQuantity) =>
      currentQuantity + 1
    );
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      setError("");
      setSuccess("");

      const cartItem = {
        productId: product.id,
        quantity: quantity,
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

      if (error.response?.data?.message) {
        setError(
          error.response.data.message
        );
      } else {
        setError(
          "Unable to add product to cart."
        );
      }
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.message}>
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>
              Product not found
            </h2>

            <p>
              {error}
            </p>

            <Link
              to="/products"
              className={styles.button}
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.imageContainer}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className={styles.image}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              Product Image
            </div>
          )}
        </div>

        <div className={styles.details}>

          <h1 className={styles.title}>
            {product.name}
          </h1>

          <p className={styles.productId}>
            Product ID: {product.id}
          </p>

          <p className={styles.description}>
            {product.description}
          </p>

          <div className={styles.price}>
            ₹{product.price}
          </div>

          {product.category && (
            <p className={styles.info}>
              <strong>
                Category:
              </strong>{" "}
              {product.category}
            </p>
          )}

          {product.brand && (
            <p className={styles.info}>
              <strong>
                Brand:
              </strong>{" "}
              {product.brand}
            </p>
          )}

          {product.stockQuantity !== null &&
            product.stockQuantity !== undefined && (
              <p className={styles.info}>
                <strong>
                  Stock:
                </strong>{" "}
                {product.stockQuantity}
              </p>
            )}

          <div className={styles.quantitySection}>

            <span className={styles.quantityLabel}>
              Quantity
            </span>

            <div className={styles.quantityControls}>

              <button
                type="button"
                className={styles.quantityButton}
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                −
              </button>

              <span className={styles.quantity}>
                {quantity}
              </span>

              <button
                type="button"
                className={styles.quantityButton}
                onClick={increaseQuantity}
              >
                +
              </button>

            </div>
          </div>

          {success && (
            <div className={styles.success}>
              {success}
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <button
            type="button"
            className={styles.button}
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart
              ? "Adding to Cart..."
              : "Add to Cart"}
          </button>

          {success && (
            <Link
              to="/cart"
              className={styles.cartLink}
            >
              Go to Cart
            </Link>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
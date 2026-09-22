import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";
import styles from "./Products.module.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/products");

      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);

      setError(
        "Unable to load products. Please make sure the backend services are running."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Products</h1>

          <p className={styles.message}>
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Products</h1>

          <div className={styles.error}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <h1 className={styles.title}>
          Products
        </h1>

        <p className={styles.description}>
          Browse our available products.
        </p>

        {products.length === 0 ? (
          <div className={styles.message}>
            No products available.
          </div>
        ) : (
          <div className={styles.grid}>

            {products.map((product) => (
              <div
                className={styles.card}
                key={product.id}
              >

                <div className={styles.imagePlaceholder}>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className={styles.image}
                    />
                  ) : (
                    "Product Image"
                  )}
                </div>

                <h3>
                  {product.name}
                </h3>

                <p>
                  {product.description}
                </p>

                <strong>
                  ₹{product.price}
                </strong>

                <Link
                  to={`/products/${product.id}`}
                  className={styles.button}
                >
                  View Details
                </Link>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Products;
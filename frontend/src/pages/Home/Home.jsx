
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

import styles from "./Home.module.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/products");

      console.log("Home products response:", response.data);

      const productData = Array.isArray(response.data)
        ? response.data
        : response.data?.products || response.data?.content || [];

      setProducts(productData.slice(0, 4));
    } catch (error) {
      console.error(
        "Failed to fetch featured products:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load featured products."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className={styles.heroContent}>
                <span className={styles.heroBadge}>
                  Modern E-Commerce Platform
                </span>

                <h1 className={styles.heroTitle}>
                  Everything You Need,
                  <span> All in One Place.</span>
                </h1>

                <p className={styles.heroText}>
                  Discover quality products, enjoy a smooth
                  shopping experience, and manage your orders
                  easily from one powerful e-commerce platform.
                </p>

                <div className={styles.heroActions}>
                  <Link
                    to="/products"
                    className={styles.primaryButton}
                  >
                    Shop Now
                  </Link>

                  <Link
                    to="/register"
                    className={styles.secondaryButton}
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className={styles.heroVisual}>
                <div className={styles.heroCard}>
                  <div className={styles.heroIcon}>
                    🛒
                  </div>

                  <h3>Easy Shopping</h3>

                  <p>
                    Browse products, add them to your cart,
                    and place orders securely.
                  </p>
                </div>

                <div className={styles.heroSmallCard}>
                  <span>✓</span>
                  Secure &amp; Reliable
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className={styles.productsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>
                OUR PRODUCTS
              </span>

              <h2>Featured Products</h2>

              <p>
                Explore some of the products available in our
                store.
              </p>
            </div>

            <Link
              to="/products"
              className={styles.viewAllLink}
            >
              View All Products →
            </Link>
          </div>

          {loading && (
            <div className={styles.message}>
              Loading featured products...
            </div>
          )}

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className={styles.message}>
              No products available at the moment.
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="row g-4">
              {products.map((product) => (
                <div
                  className="col-sm-6 col-lg-3"
                  key={product.id}
                >
                  <div className={styles.productCard}>
                    <div className={styles.productImage}>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                        />
                      ) : (
                        <span>🛍️</span>
                      )}
                    </div>

                    <div className={styles.productContent}>
                      <span className={styles.category}>
                        {product.category || "Product"}
                      </span>

                      <h3>{product.name}</h3>

                      <p className={styles.description}>
                        {product.description ||
                          "Quality product available in our store."}
                      </p>

                      <div className={styles.productFooter}>
                        <strong>
                          ₹{Number(product.price || 0).toLocaleString("en-IN")}
                        </strong>

                        <Link
                          to={`/products/${product.id}`}
                          className={styles.detailsButton}
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionLabel}>
              WHY CHOOSE US
            </span>

            <h2>A Better Shopping Experience</h2>

            <p>
              Designed to make online shopping simple,
              secure, and convenient.
            </p>
          </div>

          <div className="row g-4 mt-2">
            <div className="col-md-4">
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  🚚
                </div>

                <h3>Fast Delivery</h3>

                <p>
                  Track your orders and manage your purchases
                  through a simple and convenient experience.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  🔒
                </div>

                <h3>Secure Shopping</h3>

                <p>
                  Authentication and protected APIs help keep
                  your account and shopping experience secure.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  ⭐
                </div>

                <h3>Quality Products</h3>

                <p>
                  Browse products with useful information such
                  as price, category, description, and stock.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div>
              <span className={styles.ctaLabel}>
                START SHOPPING
              </span>

              <h2>Ready to explore our products?</h2>

              <p>
                Browse the catalog and find products that
                match what you are looking for.
              </p>
            </div>

            <Link
              to="/products"
              className={styles.ctaButton}
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;


import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

import styles from "./Products.module.css";

function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/products");

      console.log("Products response:", response.data);

      const productData = Array.isArray(response.data)
        ? response.data
        : response.data?.products ||
          response.data?.content ||
          response.data?.data ||
          [];

      setProducts(productData);
    } catch (error) {
      console.error("Failed to fetch products:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const uniqueCategories = products
      .map((product) => product.category)
      .filter(Boolean);

    return [...new Set(uniqueCategories)].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search);

      const matchesCategory =
        !category || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, category]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
  };

  const getStockQuantity = (product) => {
    const stockValue =
      product.stockQuantity ?? product.stock ?? 0;

    const stock = Number(stockValue);

    return Number.isFinite(stock) ? stock : 0;
  };

  const getStockStatus = (product) => {
    const stock = getStockQuantity(product);

    if (stock <= 0) {
      return {
        label: "Out of stock",
        className: styles.outOfStock,
      };
    }

    if (stock <= 5) {
      return {
        label: `Only ${stock} left`,
        className: styles.lowStock,
      };
    }

    return {
      label: `${stock} in stock`,
      className: styles.inStock,
    };
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.stateContainer}>
            <div
              className="spinner-border text-primary"
              role="status"
              aria-label="Loading products"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className={styles.stateText}>
              Loading products...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>
              !
            </div>

            <h2>Unable to Load Products</h2>

            <p>{error}</p>

            <button
              type="button"
              className={styles.retryButton}
              onClick={fetchProducts}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className="container">
        {/* ==============================
            PAGE HEADER
        ============================== */}

        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              PRODUCT CATALOG
            </p>

            <h1 className={styles.title}>
              Explore Products
            </h1>

            <p className={styles.subtitle}>
              Discover products and find what you need.
            </p>
          </div>

          <div className={styles.productCount}>
            {products.length}{" "}
            {products.length === 1
              ? "Product"
              : "Products"}
          </div>
        </div>

        {/* ==============================
            FILTER SECTION
        ============================== */}

        <section className={styles.filterSection}>
          <div className={styles.searchWrapper}>
            <label
              htmlFor="product-search"
              className={styles.label}
            >
              Search Products
            </label>

            <input
              id="product-search"
              type="search"
              className={styles.searchInput}
              placeholder="Search by product name or description..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <div className={styles.categoryWrapper}>
            <label
              htmlFor="category-filter"
              className={styles.label}
            >
              Category
            </label>

            <select
              id="category-filter"
              className={styles.categorySelect}
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              <option value="">
                All Categories
              </option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* ==============================
            RESULT BAR
        ============================== */}

        <div className={styles.resultBar}>
          <p>
            Showing{" "}
            <strong>
              {filteredProducts.length}
            </strong>{" "}
            of{" "}
            <strong>{products.length}</strong>{" "}
            products
          </p>

          {(searchTerm || category) && (
            <button
              type="button"
              className={styles.clearFiltersButton}
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* ==============================
            EMPTY PRODUCTS
        ============================== */}

        {products.length === 0 && (
          <div className={styles.stateContainer}>
            <div className={styles.emptyIcon}>
              🛍️
            </div>

            <h2>No Products Available</h2>

            <p className={styles.stateText}>
              There are currently no products available
              in the catalog.
            </p>
          </div>
        )}

        {/* ==============================
            NO FILTER RESULTS
        ============================== */}

        {products.length > 0 &&
          filteredProducts.length === 0 && (
            <div className={styles.stateContainer}>
              <div className={styles.emptyIcon}>
                🔎
              </div>

              <h2>No Matching Products</h2>

              <p className={styles.stateText}>
                Try changing your search term or
                category filter.
              </p>

              <button
                type="button"
                className={styles.clearButton}
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* ==============================
            PRODUCT GRID
        ============================== */}

        {filteredProducts.length > 0 && (
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => {
              const stockStatus =
                getStockStatus(product);

              const image =
                product.imageUrl ||
                product.image ||
                "";

              return (
                <article
                  className={styles.productCard}
                  key={product.id}
                >
                  {/* PRODUCT IMAGE */}

                  <div className={styles.imageContainer}>
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        className={styles.productImage}
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
                        🛍️
                      </div>
                    )}

                    <span
                      className={styles.categoryBadge}
                    >
                      {product.category ||
                        "Product"}
                    </span>

                    {getStockQuantity(product) <=
                      0 && (
                      <span
                        className={
                          styles.outOfStockBadge
                        }
                      >
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* PRODUCT CONTENT */}

                  <div className={styles.productContent}>
                    <h2 className={styles.productName}>
                      {product.name ||
                        "Unnamed Product"}
                    </h2>

                    <p
                      className={styles.description}
                    >
                      {product.description ||
                        "Quality product available in our store."}
                    </p>

                    <div
                      className={styles.productInfo}
                    >
                      <div>
                        <span
                          className={styles.priceLabel}
                        >
                          Price
                        </span>

                        <strong
                          className={styles.price}
                        >
                          ₹
                          {formatPrice(
                            product.price
                          )}
                        </strong>
                      </div>

                      <span
                        className={
                          stockStatus.className
                        }
                      >
                        {stockStatus.label}
                      </span>
                    </div>

                    <Link
                      to={`/products/${product.id}`}
                      className={styles.detailsButton}
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Products;
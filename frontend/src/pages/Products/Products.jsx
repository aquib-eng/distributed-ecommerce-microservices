import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

import styles from "./Products.module.css";

function Products() {
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

      const data = response.data;

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data?.products)) {
        setProducts(data.products);
      } else if (Array.isArray(data?.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);

      if (err.response?.status === 401) {
        setError(
          "You are not authorized to view products. Please login again."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load products. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const uniqueCategories = products
      .map((product) => product.category)
      .filter(Boolean);

    return ["All", ...new Set(uniqueCategories)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";
      const category = product.category || "";

      const matchesSearch =
        !search ||
        name.includes(search) ||
        description.includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const hasActiveFilters =
    searchTerm.trim() !== "" || selectedCategory !== "All";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  const getProductImage = (product) => {
    return (
      product.imageUrl ||
      product.image ||
      "https://via.placeholder.com/600x400?text=Product"
    );
  };

  const getStockValue = (product) => {
    if (
      product.stockQuantity !== null &&
      product.stockQuantity !== undefined
    ) {
      return Number(product.stockQuantity);
    }

    if (
      product.stock !== null &&
      product.stock !== undefined
    ) {
      return Number(product.stock);
    }

    return null;
  };

  const getStockStatus = (stock) => {
    if (stock === null) {
      return "Stock unavailable";
    }

    if (stock <= 0) {
      return "Out of stock";
    }

    if (stock <= 5) {
      return `Only ${stock} left`;
    }

    return `${stock} in stock`;
  };

  const getStockClass = (stock) => {
    if (stock === null || stock <= 0) {
      return styles.outOfStock;
    }

    if (stock <= 5) {
      return styles.lowStock;
    }

    return styles.inStock;
  };

  return (
    <div className={styles.page}>
      {/* ==============================
          PAGE HEADER
      ============================== */}

      <section className={styles.header}>
        <div>
          <p className={styles.eyebrow}>OUR COLLECTION</p>

          <h1 className={styles.title}>Products</h1>

          <p className={styles.subtitle}>
            Browse our products and find what you need.
          </p>
        </div>

        <div className={styles.productCount}>
          {products.length}{" "}
          {products.length === 1 ? "Product" : "Products"}
        </div>
      </section>

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
            type="text"
            className={styles.searchInput}
            placeholder="Search by name or description..."
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
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* ==============================
          RESULT SUMMARY
      ============================== */}

      {!loading && !error && products.length > 0 && (
        <div className={styles.resultBar}>
          <p>
            Showing{" "}
            <strong>{filteredProducts.length}</strong>{" "}
            of{" "}
            <strong>{products.length}</strong>{" "}
            products
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              className={styles.clearFiltersButton}
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* ==============================
          LOADING
      ============================== */}

      {loading && (
        <div className={styles.stateContainer}>
          <div
            className="spinner-border"
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
      )}

      {/* ==============================
          ERROR
      ============================== */}

      {!loading && error && (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>!</div>

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
      )}

      {/* ==============================
          NO PRODUCTS
      ============================== */}

      {!loading &&
        !error &&
        products.length === 0 && (
          <div className={styles.stateContainer}>
            <div className={styles.emptyIcon}>
              🛍️
            </div>

            <h2>No Products Available</h2>

            <p className={styles.stateText}>
              There are currently no products available.
            </p>
          </div>
        )}

      {/* ==============================
          NO FILTER RESULTS
      ============================== */}

      {!loading &&
        !error &&
        products.length > 0 &&
        filteredProducts.length === 0 && (
          <div className={styles.stateContainer}>
            <div className={styles.emptyIcon}>
              🔍
            </div>

            <h2>No Matching Products</h2>

            <p className={styles.stateText}>
              Try changing your search or category
              filter.
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

      {!loading &&
        !error &&
        filteredProducts.length > 0 && (
          <section className={styles.productGrid}>
            {filteredProducts.map((product) => {
              const stock = getStockValue(product);

              return (
                <article
                  className={styles.productCard}
                  key={product.id}
                >
                  {/* IMAGE */}

                  <div className={styles.imageContainer}>
                    <img
                      src={getProductImage(product)}
                      alt={
                        product.name ||
                        "Product"
                      }
                      className={styles.productImage}
                      onError={(event) => {
                        event.currentTarget.src =
                          "https://via.placeholder.com/600x400?text=Product";
                      }}
                    />

                    {product.category && (
                      <span
                        className={
                          styles.categoryBadge
                        }
                      >
                        {product.category}
                      </span>
                    )}
                  </div>

                  {/* CONTENT */}

                  <div
                    className={styles.productContent}
                  >
                    <h2
                      className={styles.productName}
                    >
                      {product.name}
                    </h2>

                    <p
                      className={styles.description}
                    >
                      {product.description ||
                        "No description available."}
                    </p>

                    <div
                      className={styles.productInfo}
                    >
                      <div>
                        <span
                          className={
                            styles.priceLabel
                          }
                        >
                          Price
                        </span>

                        <span
                          className={styles.price}
                        >
                          ₹
                          {Number(
                            product.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>

                      <span
                        className={getStockClass(
                          stock
                        )}
                      >
                        {getStockStatus(stock)}
                      </span>
                    </div>

                    <Link
                      to={`/products/${product.id}`}
                      className={
                        styles.detailsButton
                      }
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
    </div>
  );
}

export default Products;
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.home}>

      <section className={styles.hero}>
        <div className={styles.heroContent}>

          <h1 className={styles.title}>
            Welcome to Our E-Commerce Platform
          </h1>

          <p className={styles.description}>
            Discover products, add them to your cart,
            place orders and track your purchases.
          </p>

          <a
            href="/products"
            className={styles.button}
          >
            Shop Now
          </a>

        </div>
      </section>

      <section className={styles.features}>

        <div className={styles.feature}>
          <h3>Products</h3>
          <p>
            Browse our available products.
          </p>
        </div>

        <div className={styles.feature}>
          <h3>Secure Orders</h3>
          <p>
            Place and track your orders easily.
          </p>
        </div>

        <div className={styles.feature}>
          <h3>Notifications</h3>
          <p>
            Receive updates about your orders.
          </p>
        </div>

      </section>

    </div>
  );
}

export default Home;
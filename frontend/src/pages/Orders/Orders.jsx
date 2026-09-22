import styles from "./Orders.module.css";

function Orders() {
  return (
    <div className={styles.page}>

      <div className={styles.container}>

        <h1 className={styles.title}>
          My Orders
        </h1>

        <div className={styles.empty}>
          <h2>No orders yet</h2>

          <p>
            Your orders will appear here after you
            complete a purchase.
          </p>

          <a
            href="/products"
            className={styles.button}
          >
            Start Shopping
          </a>
        </div>

      </div>

    </div>
  );
}

export default Orders;
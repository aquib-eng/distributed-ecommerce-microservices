import styles from "./Cart.module.css";

function Cart() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <h1 className={styles.title}>
          Shopping Cart
        </h1>

        <div className={styles.emptyCart}>
          <h2>Your cart is empty</h2>

          <p>
            Add products to your cart to see them here.
          </p>

          <a href="/products" className={styles.button}>
            Continue Shopping
          </a>
        </div>

      </div>
    </div>
  );
}

export default Cart;
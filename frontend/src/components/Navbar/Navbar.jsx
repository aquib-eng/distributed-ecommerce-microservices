import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>

        <div className={styles.logo}>
          E-Commerce
        </div>

        <nav className={styles.nav}>
          <a href="/" className={styles.navLink}>
            Home
          </a>

          <a href="/products" className={styles.navLink}>
            Products
          </a>

          <a href="/cart" className={styles.navLink}>
            Cart
          </a>

          <a href="/login" className={styles.navLink}>
            Login
          </a>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;
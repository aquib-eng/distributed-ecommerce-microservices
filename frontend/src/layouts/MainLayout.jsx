import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import styles from "./MainLayout.module.css";

function MainLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.container}>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
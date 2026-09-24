import { useNavigate } from "react-router-dom";

import styles from "./Hero.module.css";

function Hero() {
  const navigate = useNavigate();

  const handleExploreProducts = () => {
    navigate("/products");
  };

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.badge}>
          Modern Microservices E-Commerce
        </div>

        <h1 className={styles.title}>
          Distributed E-Commerce Platform
        </h1>

        <p className={styles.description}>
          A modern e-commerce application powered by
          Spring Boot Microservices, Kafka and React.
        </p>

        <button
          type="button"
          className={styles.button}
          onClick={handleExploreProducts}
        >
          Explore Products
        </button>
      </div>
    </section>
  );
}

export default Hero;
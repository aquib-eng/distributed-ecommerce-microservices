import styles from "./Hero.module.css";

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>

        <h1 className={styles.title}>
          Distributed E-Commerce Platform
        </h1>

        <p className={styles.description}>
          A modern e-commerce application powered by
          Spring Boot Microservices, Kafka and React.
        </p>

        <button className={styles.button}>
          Explore Products
        </button>

      </div>
    </section>
  );
}

export default Hero;
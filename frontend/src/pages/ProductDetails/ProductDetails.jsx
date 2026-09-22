import { useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";

function ProductDetails() {
  const { productId } = useParams();

  return (
    <div className={styles.page}>

      <div className={styles.container}>

        <div className={styles.image}>
          Product Image
        </div>

        <div className={styles.details}>

          <h1>
            Product Details
          </h1>

          <p className={styles.productId}>
            Product ID: {productId}
          </p>

          <p>
            Product description will be loaded
            from the Product Service.
          </p>

          <h2>
            ₹1,000
          </h2>

          <button className={styles.button}>
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;
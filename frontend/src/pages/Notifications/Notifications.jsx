import styles from "./Notifications.module.css";

function Notifications() {
  return (
    <div className={styles.page}>

      <div className={styles.container}>

        <h1 className={styles.title}>
          Notifications
        </h1>

        <div className={styles.empty}>
          <h2>No notifications</h2>

          <p>
            Your order and payment notifications
            will appear here.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Notifications;
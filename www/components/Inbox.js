import styles from "../styles/Inbox.module.css";

const Inbox = () => {
  return (
    <div className={styles.inboxContainer}>
      <div className={styles.messagesContainer}>
        <p className={styles.messages}>test</p>
        <p className={styles.messages}>test</p>
        <p className={styles.messages}>test</p>
        <p className={styles.messages}>test</p>
        <p className={styles.messages}>test</p>
        <p className={styles.messages}>test</p>
        <p className={styles.messages}>test</p>
        <p className={styles.messages}>test</p>
        <p className={styles.messages}>test</p>
        <p className={styles.messages}>test</p>
      </div>
    </div>
  );
};

export default Inbox;

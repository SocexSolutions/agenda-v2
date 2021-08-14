import styles from "../styles/Inbox.module.css"
import InboxMenu from "./InboxMenu"

const Inbox = () => {
  return (
    <div className={styles.inboxContainer}>
      <InboxMenu />
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
  )
}

export default Inbox

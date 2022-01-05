import styles from '../styles/Inbox.module.css';
import InboxMenu from '../components/InboxMenu';
import MailBox from '../components/MailBox';

const messageExample = () => {
  return (
    <>
      <div className={styles.inboxContainer}>
        <InboxMenu />
        <MailBox />
      </div>
    </>
  );
};

export default messageExample;

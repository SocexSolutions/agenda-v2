import styles from '../styles/Inbox.module.css';
import Link from 'next/link';

const Inbox = ({ meetings }) => {
  const lineItems = meetings.map( meeting => {
    const date = new Date( meeting.date ).toLocaleString();

    return (
      <Link key={meeting._id} href={ `/meeting/${ meeting._id }`}>
        <div className={styles.message} >
          <p>{meeting.name} </p>
          <p> {date} </p>
        </div>
      </Link>
    );
  });

  return (
    <div className={styles.inboxContainer}>
      <div className={styles.messagesContainer}>
        {lineItems}
      </div>
    </div>
  );
};

export default Inbox;

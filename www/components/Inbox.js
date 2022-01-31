import styles from '../styles/Inbox.module.css';

const Inbox = ({ meetings }) => {
  const lineItems = meetings.map( meeting => {
    const date = new Date( meeting.date ).toLocaleString();

    return <div className={styles.messages} key={meeting._id}>
      <p>{meeting.name} </p>
      <p> {date} </p>
    </div>;
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

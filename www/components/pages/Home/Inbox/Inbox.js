import Link from 'next/link';

import InboxRow from './InboxRow/InboxRow';

import styles from './Inbox.module.scss';

const Inbox = ({ meetings, emptyMessage }) => {
  const lineItems = meetings.map( ( meeting ) => {
    return (
      <InboxRow meeting={meeting} key={meeting._id} classes={styles.row} />
    );
  });

  if ( lineItems.length ) {
    return <div className={styles.table}>{lineItems}</div>;
  }

  return (
    <div className={styles.table}>
      <div className={styles.noMeetings}>{emptyMessage}</div>
    </div>
  );
};

Inbox.defaultProps = {
  emptyMessage: (
    <>
      <h2 style={{ margin: '0' }}>No Meetings :(</h2>
      <br />
      <Link href="/meeting/new">Get Started</Link>)
    </>
  )
};

export default Inbox;

import styles from '../styles/Inbox.module.css';

import Link from 'next/link';

import Button from '../components/Button';

const Inbox = ({ meetings, emptyMessage }) => {
  const lineItems = meetings.map( meeting => {
    return (
      <Link
        key={meeting._id}
        href={ `/meeting/${ meeting._id }`}
      >
        <div className={styles.item}>
          <p>{meeting.name}</p>
          <Link  href={ `/meeting/${ meeting._id }/voting`}>
            <Button
              text='vote'
              size='medium'
              variant='hollow'
            />
          </Link>
          <Link href={ `/meeting/${ meeting._id }/meet`}>
            <Button
              text='meet'
              size='medium'
              type='success'
            />
          </Link>
        </div>
      </Link>
    );
  });


  return (
    <div className={styles.list}>
      {
        lineItems.length ? lineItems :
          <div className={styles.noMeetings}>{emptyMessage}</div> //No Meetings :( <br></br> <a><Link href="/meeting/new">Get Started</Link></a>
      }
    </div>
  );
};

Inbox.defaultProps = {
  emptyMessage: <>
    <h2 style={{ margin: '0' }}>No Meetings :(</h2><br />
    <Link href="/meeting/new">Get Started</Link>)
  </>
};

export default Inbox;

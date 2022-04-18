import styles from '../styles/Inbox.module.css';

import Link from 'next/link';

import Button from '../components/Button';

const Inbox = ({ meetings, emptyMessage }) => {
  const lineItems = meetings.map( meeting => {
    return (
      <div className={styles.item} key={meeting._id} >
        <p>{meeting.name}</p>
        <Link  href={ `/meeting/${ meeting._id }`}>
          <Button
            text='edit'
            size='medium'
            type='danger'
            variant='outlined'
          />
        </Link>
        <Link  href={ `/meeting/${ meeting._id }/voting`}>
          <Button
            text='vote'
            size='medium'
            variant='outlined'
          />
        </Link>
        <Link href={ `/meeting/${ meeting._id }/meet`}>
          <Button
            text='meet'
            size='medium'
            type='success'
            variant='outlined'
          />
        </Link>
      </div>
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
    <a><Link href="/meeting/new">Get Started</Link></a>
  </>
};

export default Inbox;

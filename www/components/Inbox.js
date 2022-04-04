import styles from '../styles/Inbox.module.css';

import Link from 'next/link';

import Button from '../components/Button';

const Inbox = ({ meetings }) => {
  const lineItems = meetings.map( meeting => {
    return (
      <div className={styles.item} key={meeting._id} >
        <p>{meeting.name}</p>
        <Link  href={ `/meeting/${ meeting._id }`}>
          <Button
            text='edit'
            size='medium'
            type='success'
            variant='outlined'
          />
        </Link>
        <Link href={ `/meeting/${ meeting._id }/meet`}>
          <Button
            text='meet'
            size='medium'
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
          <div className={styles.noMeetings}>No Meetings :( <br></br> <a><Link href="/meeting/new">Get Started</Link></a> </div>
      }
    </div>
  );
};

export default Inbox;

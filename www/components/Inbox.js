import Link from 'next/link';

import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import GroupsIcon from '@mui/icons-material/Groups';
import CreateSharpIcon from '@mui/icons-material/CreateSharp';

import Button from '../components/Button';

import styles from '../styles/components/Inbox.module.css';

const Inbox = ({ meetings, emptyMessage }) => {
  const lineItems = meetings.map( meeting => {
    return (
      <Link
        key={meeting._id}
        href={ `/meeting/${ meeting._id }`}
      >
        <div className={styles.item}>
          <p>{meeting.name}</p>
          <Link  href={ `/meeting/${ meeting._id }`}>
            <Button
              icon={<CreateSharpIcon/>}
              text='edit'
              size='medium'
              variant='hollow'
            />
          </Link>
          <Link  href={ `/meeting/${ meeting._id }/voting`}>
            <Button
              icon={<ThumbsUpDownIcon/>}
              text='vote'
              size='medium'
              variant='hollow'
            />
          </Link>
          <Link href={ `/meeting/${ meeting._id }/meet`}>
            <Button
              icon={<GroupsIcon/>}
              text='meet'
              size='medium'
              variant='hollow'
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

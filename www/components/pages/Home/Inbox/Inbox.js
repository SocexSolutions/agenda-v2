import Link from 'next/link';

import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import GroupsIcon       from '@mui/icons-material/Groups';
import CreateSharpIcon  from '@mui/icons-material/CreateSharp';

import { useRouter } from 'next/router';

import Button from '../../../shared/Button/Button';

import styles from './Inbox.module.css';

const Inbox = ({ meetings, emptyMessage }) => {
  const router = useRouter();

  const lineItems = meetings.map( meeting => {
    return (
      <Link
        key={meeting._id}
        href={ `/meeting/${ meeting._id }/edit`}
      >
        <div className={styles.item}>
          <p>{meeting.name}</p>
          <Button
            onClick={() => router.push( `/meeting/${ meeting._id }/edit` )}
            icon={<CreateSharpIcon/>}
            size='medium'
            variant='hollow'
          />
          <Button
            icon={<ThumbsUpDownIcon/>}
            onClick={() => router.push( `/meeting/${ meeting._id }/vote` )}
            size='medium'
            variant='hollow'
          />
          <Button
            icon={<GroupsIcon/>}
            onClick={() => router.push( `/meeting/${ meeting._id }/meet` )}
            size='medium'
            variant='hollow'
          />
        </div>
      </Link>
    );
  });


  return (
    <div className={styles.list}>
      {
        lineItems.length ? lineItems :
          <div className={styles.noMeetings}>{emptyMessage}</div>
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

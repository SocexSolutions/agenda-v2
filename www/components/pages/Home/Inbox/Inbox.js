import { Button, TextField } from '@mui/material';
import InboxRow from './InboxRow/InboxRow';
import meetingAPI from '../../../../api/meeting';
import { useRouter } from 'next/router';
import styles from './Inbox.module.scss';
import FilterListIcon from '@mui/icons-material/FilterList';

/**
 * Table that displays users meetings
 * @param {Object[]} meetings - meetings to display
 * @param {Function} refresh - a function that refreshes the meetings
 */
export default function Inbox({ meetings, refresh }) {
  const router = useRouter();

  const lineItems = meetings.map((meeting) => {
    return (
      <InboxRow
        meeting={meeting}
        key={meeting._id}
        classes={styles.row}
        refresh={refresh}
      />
    );
  });

  if ( lineItems.length ) {
    return (
      <div className={styles.table}>
        <div className={styles.filter_box}>
          <TextField placeholder='Search' variant='standard' size='small'></TextField>
          <Button endIcon={<FilterListIcon />} >Filters</ Button>
        </div>
        {lineItems}
      </div>
    );
  }

  const createMeeting = async () => {
    // create a draft meeting before redirect so that created participants
    // and topics have a meeting_id to reference
    const res = await meetingAPI.create({ name: "Draft", date: new Date() });

    router.push(`/meeting/${res._id}/edit`);
  };

  return (
    <div className={styles.no_meetings}>
      <h3>No meetings :(</h3>
      <p>Create your first meeting!</p>
      <Button
        variant="contained"
        size="large"
        color="blue"
        onClick={() => createMeeting()}
        disableElevation
      >
        Create Meeting
      </Button>
    </div>
  );
}

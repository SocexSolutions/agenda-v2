import MeetingModal from '../MeetingModal/MeetingModal';
import { useState } from 'react';

/**
 * A row in the inbox component
 * @param {Object} meeting - a meeting
 * @param {Function} refresh - function that tells the inbox to refresh
 * @param {string} classes - custom css class names to be applied to the row
 */
export default function InboxRow({ meeting, refresh, classes }) {
  const [ open, setOpen ] = useState( false );

  return (
    <div className={classes}>
      <p onClick={() => setOpen( true )}>{meeting.name}</p>
      <MeetingModal
        meeting={meeting}
        open={open}
        setOpen={setOpen}
        refresh={refresh}
      />
    </div>
  );
}

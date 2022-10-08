import MeetingModal from '../MeetingModal/MeetingModal';
import { useState } from 'react';

export default function InboxRow({ meeting, classes }) {
  const [ open, setOpen ] = useState( false );

  return (
    <div className={classes}>
      <p onClick={() => setOpen( true )}>{meeting.name}</p>
      <MeetingModal
        meeting={meeting}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
}

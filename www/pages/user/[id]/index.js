import { getInbox } from '../../../store/features/meetings/meetingSlice';

import { useEffect, useState } from 'react';
import { useSelector }         from 'react-redux';

import Inbox       from '../../../components/Inbox';
import LoadingIcon from '../../../components/LoadingIcon';

const selectUser                = state => state.user;
const selectOwnedMeetings       = state => state.meetings.ownedMeetings;
const selectParticipantMeetings = state => state.meetings.participantMeetings;

const User = ( props ) => {
  const [ loading, setLoading ] = useState( true );

  const user                = useSelector( selectUser );
  const ownedMeetings       = useSelector( selectOwnedMeetings );
  const participantMeetings = useSelector( selectParticipantMeetings );

  useEffect( () => {
    async function load() {
      try {
        await props.store.dispatch( getInbox() );
        setLoading( false );
      } catch ( err ) {
        props.notify({
          msg: 'Error loading meetings: ' + err.message,
          type: 'Danger'
        });
      }
    }

    if ( user._id ) {
      load();
    }
  }, [ user ] );

  if ( loading ) {
    return (
      <>
        <LoadingIcon size="large" />
      </>
    );
  }

  const meetings = ownedMeetings.concat( participantMeetings );

  return (
    <>
      <Inbox
        meetings={ meetings }
      />
    </>
  );
};

export default User;

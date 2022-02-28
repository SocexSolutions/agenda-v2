import Inbox from '../../../components/Inbox';
import LoadingIcon from '../../../components/LoadingIcon';
import { getInbox } from '../../../store/features/meetings/meetingSlice';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const selectUser = state => state.user;
const selectOwnedMeetings = state => state.meetings.ownedMeetings;
const selectParticipantMeetings = state => state.meetings.participantMeetings;

const User = () => {
  const dispatch = useDispatch();

  const user = useSelector( selectUser );
  const ownedMeetings = useSelector( selectOwnedMeetings );
  const participantMeetings = useSelector( selectParticipantMeetings );

  useEffect( () => {
    if ( user._id ) {
      dispatch( getInbox() );
    }
  }, [ user ] );

  const loaded = ownedMeetings.length || participantMeetings.length;

  if ( loaded ) {
    return (
      <>
        <Inbox meetings={ ownedMeetings }/>
      </>
    );
  } else {
    return (
      <>
        <LoadingIcon size="large" />
      </>
    );
  }
};

export default User;

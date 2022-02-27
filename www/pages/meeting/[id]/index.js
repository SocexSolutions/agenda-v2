import HeaderForm from '../../../components/Bundles/Meeting/HeaderForm';
import TopicsForm from '../../../components/Bundles/Meeting/TopicsForm';
import ParticipantsForm from '../../../components/Bundles/Meeting/ParticipantsForm';
import LoadingIcon from '../../../components/LoadingIcon';
import Button from '../../../components/Button';
import Snackbar from '../../../components/Snackbar';

import { useEffect, useState } from 'react';
import {
  saveMeeting,
  fetchMeeting
} from '../../../store/features/meetings/meetingSlice';

import { useSelector } from 'react-redux';

import styles from '../../../styles/MeetingPage.module.css';

const Meeting = props => {
  const [ loading, setLoading ] = useState( true );

  const [ name, setName ] = useState('');
  const [ participants, setParticipants ] = useState([]);
  const [ topics, setTopics ] = useState([]);
  const [ snackbarOpen, setSnackbarOpen ] = useState( false );

  const user = useSelector( state => state.user );
  const meeting = useSelector( state => state.meetings.openMeeting );

  const clearPage = () => {
    setName('');
    setParticipants([]);
    setTopics([]);
  };

  useEffect( () => {
    const loadMeeting = async() => {
      const meeting_id = String( window.location.pathname ).split('/').pop();
      const realMeetingId = meeting_id.length === 24;

      if ( realMeetingId ) {
        await props.store.dispatch(
          fetchMeeting( meeting_id )
        );

        const { meetings } = props.store.getState();

        setName( meetings.openMeeting.name );
        setParticipants( meetings.openMeeting.participants );
        setTopics( meetings.openMeeting.topics );
      } else {
        clearPage();
      }

      setLoading( false );
    };

    loadMeeting();
  }, [ user, props.store ] );


  const save = () => {
    props.store.dispatch(
      saveMeeting({
        name,
        owner_id: user._id,
        meeting_id: meeting._id || undefined,
        date: new Date,
        participants,
        topics
      })
    );
  };

  const handleSubmit = () => {
    save();

    if ( String( window.location.pathname ).split('/').pop().length === 24 ) {
      setSnackbarOpen( true );
    }
  };

  const setNameHandler = ( event ) => {
    setName( event.target.value );
  };

  if ( loading ) {
    return <LoadingIcon/>;
  }

  return (
    <div>
      <HeaderForm
        setMeetingName={setNameHandler}
        meetingName={name}
      />
      <TopicsForm
        topics={topics}
        setTopics={setTopics}
      />
      <ParticipantsForm
        owner={user.email}
        participants={participants}
        setParticipants={setParticipants}
      />
      <Button
        varient='secondary'
        customClass={styles.meetingButton}
        onClick={handleSubmit}
        text='save'
      />
      <Snackbar
        message='Save Successful'
        type='success'
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
      />
    </div>
  );
};

export default Meeting;

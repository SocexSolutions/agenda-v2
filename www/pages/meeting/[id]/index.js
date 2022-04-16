import HeaderForm from '../../../components/Bundles/Meeting/HeaderForm';
import TopicsForm from '../../../components/Bundles/Meeting/TopicsForm';
import ParticipantsForm from '../../../components/Bundles/Meeting/ParticipantsForm';
import LoadingIcon from '../../../components/LoadingIcon';
import Button from '../../../components/Button';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  saveMeeting,
  fetchMeeting
} from '../../../store/features/meetings/meetingSlice';

import { notify } from '../../../store/features/snackbar/snackbarSlice';

import styles from '../../../styles/MeetingPage.module.css';

const Meeting = ( props ) => {
  const router = useRouter();

  const [ loading, setLoading ] = useState( true );
  const [ saving, setSaving ]   = useState( false );

  const [ name, setName ]                 = useState('');
  const [ participants, setParticipants ] = useState([]);
  const [ topics, setTopics ]             = useState([]);

  const user = useSelector( ( state ) => state.user );
  const meeting = useSelector( ( state ) => state.meetings.openMeeting );

  const clearPage = () => {
    setName('');
    setParticipants([]);
    setTopics([]);
  };

  useEffect( () => {
    const loadMeeting = async() => {
      const meeting_id = router.query.id || '';
      const real_id = meeting_id.length === 24;

      if ( real_id ) {
        try {
          await props.store.dispatch( fetchMeeting( meeting_id ) );

          const { meetings } = props.store.getState();

          setName( meetings.openMeeting.name );
          setParticipants( meetings.openMeeting.participants );
          setTopics( meetings.openMeeting.topics );
        } catch ( err ) {
          props.store.dispatch(
            notify({
              message: 'Failed to fetch meeting: ' + err.message,
              type: 'danger'
            })
          );
        }
      } else {
        clearPage();
      }

      setLoading( false );
    };

    loadMeeting();
  }, [ user, props.store, router.query ] );

  useEffect( () => {
    const save = async() => {
      try {
        await props.store.dispatch(
          saveMeeting({
            name,
            owner_id: user._id,
            meeting_id: meeting._id || undefined,
            date: new Date(),
            participants,
            topics
          })
        );

        setSaving( false );
        props.store.dispatch(
          notify({
            message: 'Save Successful'
          })
        );
      } catch ( err ) {
        setSaving( false );
        props.store.dispatch(
          notify({
            message: 'Save Failed: ' + err.message,
            type: 'danger',
            success: false
          })
        );
      }
    };

    if ( saving ) {
      save();
    }
  });

  const setNameHandler = ( event ) => {
    setName( event.target.value );
  };

  if ( loading ) {
    return <LoadingIcon />;
  }

  return (
    <div>
      <HeaderForm setMeetingName={setNameHandler} meetingName={name} />
      <ParticipantsForm
        owner={user.email}
        participants={participants}
        setParticipants={setParticipants}
      />
      <TopicsForm
        topics={topics}
        setTopics={setTopics}
      />
      <Button
        size='large'
        customClass={styles.meetingButton}
        onClick={() => setSaving( true )}
        text="save"
      />
    </div>
  );
};

export default Meeting;

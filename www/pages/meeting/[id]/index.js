import HeaderForm from '../../../components/Bundles/Meeting/HeaderForm';
import TopicsForm from '../../../components/Bundles/Meeting/TopicsForm';
import ParticipantsForm from '../../../components/Bundles/Meeting/ParticipantsForm';
import LoadingIcon from '../../../components/LoadingIcon';
import Button from '../../../components/Button';
import client from '../../../store/client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { notify } from '../../../store/features/snackbar/snackbarSlice';

import styles from '../../../styles/MeetingPage.module.css';
import shared from '../../../styles/Shared.module.css';

const Meeting = ( props ) => {
  const router = useRouter();

  const [ loading, setLoading ] = useState( true );
  const [ saving, setSaving ]   = useState( false );

  const [ name, setName ]                 = useState('');
  const [ participants, setParticipants ] = useState([]);
  const [ topics, setTopics ]             = useState([]);

  const user = useSelector( ( state ) => state.user );

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
          const { data } = await client.get(
            `meeting/${ meeting_id }/aggregate`
          );

          setName( data.name );
          setParticipants( data.participants );
          setTopics( data.topics );

          setLoading( false );
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
  }, [ user, props.store, router.query.id ] );

  useEffect( () => {
    const save = async() => {
      const meeting_id = router.query.id || '';
      const real_id = meeting_id.length === 24;

      try {
        const res = await client.post(
          'meeting/aggregate',
          {
            name,
            owner_id: user._id,
            ...( real_id && { meeting_id } ),
            date: new Date(),
            participants,
            topics
          }
        );

        setSaving( false );

        props.store.dispatch(
          notify({
            message: 'Save Successful'
          })
        );

        if ( !real_id ) { router.push( `/meeting/${ res.data._id }` ); }
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
  }, [ saving ] );

  const setNameHandler = ( event ) => {
    setName( event.target.value );
  };

  if ( loading ) {
    return <LoadingIcon />;
  }

  return (
    <div className={shared.page}>
      <div className={shared.container}>
        <h3>Meeting Details</h3>
        <HeaderForm setMeetingName={setNameHandler} meetingName={name} />
        <h3>Participants</h3>
        <ParticipantsForm
          owner={user.email}
          participants={participants}
          setParticipants={setParticipants}
        />
        <h3>Topics</h3>
        <TopicsForm
          store={props.store}
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
    </div>
  );
};

export default Meeting;

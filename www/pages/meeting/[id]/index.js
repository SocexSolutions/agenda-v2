import HeaderForm from '../../../components/Bundles/Meeting/HeaderForm';
import CardBoard from '../../../components/CardBoard';
import ParticipantsForm from '../../../components/Bundles/Meeting/ParticipantsForm';
import LoadingIcon from '../../../components/LoadingIcon';
import Button from '../../../components/Button';

import meetingAPI from '../../../api/meeting';
import topicAPI   from '../../../api/topic';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { notify } from '../../../store/features/snackbar';

import styles from '../../../styles/MeetingPage.module.css';
import shared from '../../../styles/Shared.module.css';

const Meeting = ( props ) => {
  const router = useRouter();
  const user   = useSelector( ( state ) => state.user );

  const meeting_id = router.query.id || '';

  const [ loading, setLoading ] = useState( true );
  const [ saving, setSaving ]   = useState( false );

  const [ name, setName ]                 = useState('');
  const [ participants, setParticipants ] = useState([]);
  const [ topics, setTopics ]             = useState([]);

  const clearPage = () => {
    setName('');
    setParticipants([]);
    setTopics([]);
  };

  useEffect( () => {
    const loadMeeting = async() => {
      const real_id = meeting_id.length === 24;

      if ( real_id ) {
        const res = await meetingAPI.aggregate( meeting_id );

        setName( res.meeting.name );
        setParticipants( res.participants );
        setTopics( res.topics );

        setLoading( false );
      } else {
        clearPage();
      }

      setLoading( false );
    };

    loadMeeting();
  }, [ user, props.store, router.query.id ] );

  useEffect( () => {
    const save = async() => {
      const real_id = meeting_id.length === 24;

      const res = await meetingAPI.aggregateSave({
        meeting: {
          name,
          owner_id: user._id,
          ...( real_id && { _id: meeting_id } )
        },
        participants,
        topics
      });

      setSaving( false );

      props.store.dispatch(
        notify({
          message: 'Save Successful'
        })
      );

      if ( !real_id ) {
        router.push( `/meeting/${ res.data._id }` );
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
        <CardBoard
          key={meeting_id}
          getAll={ () => {
            if ( meeting_id !== 'new' ) {
              return meetingAPI.getTopics( meeting_id );
            }
          }}
          create={ ( payload ) => topicAPI.create({
            meeting_id,
            ...payload
          })}
          update={ ( id, payload ) => topicAPI.update( id, payload ) }
          destroy={ ( id ) => topicAPI.destroy( id ) }
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

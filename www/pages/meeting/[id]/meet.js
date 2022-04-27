import LoadingIcon    from '../../../components/LoadingIcon';

import { useEffect, useState } from 'react';
import { useRouter }           from 'next/router';

import { useSelector } from 'react-redux';

import { fetchMeeting } from '../../../store/features/meetings/meetingSlice';

import styles       from '../../../styles/Meet.module.css';
import sharedStyles from '../../../styles/Shared.module.css';

const Meet = ( props ) => {
  const [ loading, setLoading ]         = useState( true );
  const [ savingTopic, setSavingTopic ] = useState( null );

  const meeting = useSelector( state => state.meetings.openMeeting );
  const router  = useRouter();

  useEffect( () => {
    const loadMeeting = async() => {
      const meeting_id = router.query.id;

      if ( meeting_id ) {
        await props.store.dispatch( fetchMeeting( meeting_id ) );
        setLoading( false );
      }
    };

    loadMeeting();
  }, [ router.query.id, props.store ] );

  useEffect( () => {
    const saveTopic = async() => {
      setSavingTopic( false );
    };

    if ( savingTopic ) {
      saveTopic();
    }
  });

  if ( loading ) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingIcon />
      </div>
    );
  }

  let liveTopic = [];
  let openTopics = [];
  let closedTopics = [];

  if ( meeting.topics ) {
    liveTopic = meeting.topics.filter( topic => topic.status === 'live' );

    openTopics = meeting.topics.filter(
      topic => topic.status === 'open'
    ).map( topic => {
      return (
        <div className={sharedStyles.card} key={ topic.name }>
          {topic.name}
        </div>
      );
    });

    closedTopics = meeting.topics.filter(
      topic => topic.status === 'closed'
    ).map( topic => {
      return (
        <div className={sharedStyles.card} key={ topic.name }>
          {topic.name}
        </div>
      );
    });
  }


  return (
    <div className={styles.container}>
      <div className={styles.sideContainer}>
        { openTopics }
      </div>
      <div className={styles.mainContainer}>
      </div>
      <div className={styles.sideContainer}>
        { closedTopics }
      </div>
    </div>
  );
};

export default Meet;

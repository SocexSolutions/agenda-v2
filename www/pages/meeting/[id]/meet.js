import LoadingIcon    from '../../../components/LoadingIcon';
import DiscussionForm from '../../../components/Bundles/Meeting/DiscussionForm';

import { useEffect, useState } from 'react';
import { useRouter }           from 'next/router';

import { fetchMeeting } from '../../../store/features/meetings/meetingSlice';

import styles       from '../../../styles/Meet.module.css';
import sharedStyles from '../../../styles/Shared.module.css';

const Meet = ( props ) => {
  const [ takeaways, setTakeaways ]     = useState([]);
  const [ loading, setLoading ]         = useState( true );
  const [ meeting, setMeeting ]         = useState( null );
  const [ savingTopic, setSavingTopic ] = useState( false );

  const router = useRouter();

  useEffect( () => {
    const loadMeeting = async() => {
      const meeting_id = router.query.id;

      if ( meeting_id ) {
        await props.store.dispatch( fetchMeeting( meeting_id ) );

        const { meetings: { openMeeting } } = props.store.getState();

        setMeeting({
          ...openMeeting,
          topics: openMeeting.topics.map( topic => {
            return {
              ...topic,
              discussed: false
            };
          })
        });

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

  const addTakeaway = ( takeaway ) => {
    setTakeaways([ ...takeaways, takeaway ]);
  };

  if ( loading ) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingIcon />
      </div>
    );
  }

  const liveTopic = meeting.topics.filter( topic => topic.status === 'live' );

  const openTopics = meeting.topics.filter(
    topic => topic.status === 'open'
  ).map( topic => {
    return (
      <div className={sharedStyles.card} key={ topic.name }>
        {topic.name}
      </div>
    );
  });

  const closedTopics = meeting.topics.filter(
    topic => topic.status === 'closed'
  ).map( topic => {
    return (
      <div className={sharedStyles.card} key={ topic.name }>
        {topic.name}
      </div>
    );
  });


  const discussionForm = <DiscussionForm
    title={liveTopic.name}
    addTakeaway={addTakeaway}
    close={closeTopic}
  />;

  return (
    <div className={styles.container}>
      <div className={styles.sideContainer}>
        { openTopics }
      </div>
      <div className={styles.mainContainer}>
        { discussionForm }
      </div>
      <div className={styles.sideContainer}>
        { closedTopics }
      </div>
    </div>
  );
};

export default Meet;

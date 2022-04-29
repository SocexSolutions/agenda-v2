import LoadingIcon    from '../../../components/LoadingIcon';
import DiscussionForm from '../../../components/Bundles/Meeting/DiscussionForm';

import { useEffect, useState } from 'react';
import { useRouter }           from 'next/router';

import { fetchMeeting } from '../../../store/features/meetings/meetingSlice';

import styles       from '../../../styles/Meet.module.css';
import sharedStyles from '../../../styles/Shared.module.css';

const Meet = ( props ) => {
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

  if ( loading ) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingIcon />
      </div>
    );
  }

  const sorted = meeting.topics.sort( ( a, b ) => {
    return a.name[ 0 ].toLowerCase() - b.name[ 0 ].toLowerCase();
  });


  const splitIndex = sorted.findIndex( topic => {
    return topic.discussed === false;
  });

  const discussedTopics = sorted.slice( 0, splitIndex ).map( topic => {
    return (
      <div className={sharedStyles.card} key={ topic.name }>
        {topic.name}
      </div>
    );
  });

  const unDiscussedTopics = sorted.slice( splitIndex + 1 ).map( topic => {
    return (
      <div className={sharedStyles.card} key={ topic.name }>
        {topic.name}
      </div>
    );
  });

  const discussionForm = <DiscussionForm
    topic_id={sorted[ splitIndex ]._id}
  />;

  return (
    <div className={styles.container}>
      <div className={styles.sideContainer}>
        { unDiscussedTopics }
      </div>
      <div className={styles.mainContainer}>
        <div
          style={{ border: '2px black dotted' }}
        >{sorted[ splitIndex ].name}</div>
        { discussionForm }
      </div>
      <div className={styles.sideContainer}>
        { discussedTopics }
      </div>
    </div>
  );
};

export default Meet;

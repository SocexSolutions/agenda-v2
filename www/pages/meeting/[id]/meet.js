import TopicSelectBar from '../../../components/pages/Meet/TopicSelectBar/TopicSelectBar';
import ActionItemBar from '../../../components/pages/Meet/ActionItemBar/ActionItemBar';
import TopicDisplay from '../../../components/pages/Meet/TopicDisplay/TopicDisplay';
import CardBoard from '../../../components/shared/CardBoard/CardBoard';
import CardForm from '../../../components/shared/CardForm/CardForm';

import meetingAPI from '../../../api/meeting';
import topicAPI from '../../../api/topic';
import takeawayAPI from '../../../api/takeaway';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import styles from '../../../styles/pages/meeting/[id]/meet.module.scss';
import shared from '../../../styles/Shared.module.css';

export default function MeetRevamp() {
  const router = useRouter();
  const user = useSelector( ( state ) => state.user );

  const meeting_id = router.query.id;

  const [ name, setName ] = useState('');
  const [ date, setDate ] = useState( null );
  const [ topics, setTopics ] = useState([]);

  const loadMeeting = async( meeting_id ) => {
    const meeting = await meetingAPI.get( meeting_id );

    setName( meeting.name );
    setDate( meeting.date );
  };

  const loadTopics = async( meeting_id ) => {
    const res = await meetingAPI.getTopics( meeting_id );

    setTopics( res );
  };

  const switchToTopic = async( topic_id ) => {
    await topicAPI.switch( topic_id );

    loadTopics( meeting_id );
  };

  const closeTopic = async( topic_id ) => {
    await topicAPI.close( topic_id );

    loadTopics( meeting_id );
  };

  useEffect( () => {
    if ( meeting_id ) {
      loadMeeting( meeting_id );
      loadTopics( meeting_id );
    }
  }, [ user, meeting_id ] );

  const liveTopic = topics.find( ( topic ) => topic.status === 'live' );

  return (
    <div className={shared.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Meet: {name}</h2>
        </div>
        <div className={styles.main_grid}>
          <div>
            <TopicSelectBar
              meetingName={name}
              topics={topics}
              switchToTopic={switchToTopic}
            />
          </div>
          <div>
            {liveTopic ? (
              <TopicDisplay topic={liveTopic} closeTopic={closeTopic} />
            ) : (
              <p>No topic selected. Select a topic on the left to begin.</p>
            )}
            <div className={styles.takeaways_container}>
              <h3>Takeaways</h3>
              {liveTopic ? (
                <CardBoard
                  change={liveTopic._id}
                  getAll={() => topicAPI.getTakeaways( liveTopic._id )}
                  create={( payload ) =>
                    takeawayAPI.create({
                      topic_id: liveTopic._id,
                      meeting_id,
                      ...payload
                    })
                  }
                  update={( id, payload ) => takeawayAPI.update( id, payload )}
                  destroy={( id ) => takeawayAPI.destroy( id )}
                  Card={CardForm}
                />
              ) : (
                <p>Select a topic to view takeaways.</p>
              )}
            </div>
          </div>
          <div>
            <ActionItemBar
              meetingId={meeting_id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

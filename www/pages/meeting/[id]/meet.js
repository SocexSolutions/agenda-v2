import SideBar from '../../../components/pages/Meet/SideBar/SideBar';
import TopicDisplay from '../../../components/pages/Meet/TopicDisplay/TopicDisplay';
import CardBoard from '../../../components/shared/CardBoard/CardBoard';

import meetingAPI from '../../../api/meeting';
import topicAPI from '../../../api/topic';
import takeawayAPI from '../../../api/takeaway';
import actionItemAPI from '../../../api/action-item';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import styles from '../../../styles/pages/meeting/[id]/meet.module.scss';

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
    <div className={styles.meet_revamp}>
      <nav className={styles.side_bar_container}>
        <SideBar
          meetingName={name}
          topics={topics}
          switchToTopic={switchToTopic}
        />
      </nav>
      <div className={styles.main_container}>
        <section className={styles.topic_container}>
          {liveTopic ? (
            <TopicDisplay topic={topics[ 0 ]} closeTopic={closeTopic} />
          ) : (
            <p>No topic selected. Select a topic on the left to begin.</p>
          )}
        </section>
        <section className={styles.takeaways_container}>
          <div className={styles.board_background}>
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
              />
            ) : (
              <p>Select a topic to view takeaways.</p>
            )}
          </div>
        </section>
        <section className={styles.actions_container}>
          <div className={styles.board_background}>
            <h3>Action Items</h3>
            {liveTopic ? (
              <CardBoard
                change={liveTopic._id}
                getAll={() => topicAPI.getActionItems( liveTopic._id )}
                create={( payload ) =>
                  actionItemAPI.create({
                    topic_id: liveTopic._id,
                    meeting_id,
                    ...payload
                  })
                }
                update={( id, payload ) => actionItemAPI.update( id, payload )}
                destroy={( id ) => actionItemAPI.destroy( id )}
              />
            ) : (
              <p>Select a topic to view action items.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

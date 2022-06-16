import LoadingIcon from '../../../components/LoadingIcon';
import Button      from '../../../components/Button';
import CardBoard   from '../../../components/CardBoard';

import takeawayAPI from '../../../api/takeaway';
import topicAPI    from '../../../api/topic';
import meetingAPI  from '../../../api/meeting';

import { useEffect, useState } from 'react';
import { useRouter }           from 'next/router';

import { notify } from '../../../store/features/snackbar';

import client from '../../../api/client';

import styles       from '../../../styles/pages/meeting/[id]/meet.module.css';
import sharedStyles from '../../../styles/Shared.module.css';

const Meet = ( props ) => {
  const [ meetingLoading, setMeetingLoading ]           = useState( true );
  const [ topicsLoading, setTopicsLoading ]             = useState( true );
  const [ participantsLoading, setParticipantsLoading ] = useState( true );

  const [ meeting, setMeeting ]           = useState( null );
  const [ topics, setTopics ]             = useState([]);
  const [ participants, setParticipants ] = useState([]);

  const [ switchingTopics, setSwitchingTopics ] = useState( null );
  const [ closingTopic, setClosingTopic ]       = useState( null );

  const router     = useRouter();
  const meeting_id = router.query.id ?? null;

  useEffect( () => {
    const loadTopics = async() => {
      const topics = await meetingAPI.getTopics( meeting_id );

      setTopics( topics );
      setTopicsLoading( false );
    };

    if ( topicsLoading && meeting_id ) {
      loadTopics();
    }
  }, [ router.query.id, topicsLoading ] );

  useEffect( () => {
    const loadParticipants = async() => {
      const participants = await meetingAPI.getParticipants( meeting_id );
      setParticipants( participants );
      setParticipantsLoading( false );
    };

    if ( participantsLoading && meeting_id ) {
      loadParticipants();
    }
  }, [ router.query.id, participantsLoading ] );

  useEffect( () => {
    const loadMeeting = async() => {
      const meeting = await meetingAPI.get( meeting_id );
      setMeeting( meeting );
      setMeetingLoading( false );
    };

    if ( meeting_id && meetingLoading ) {
      loadMeeting();
    }
  }, [ router.query.id, meetingLoading, props.store ] );

  useEffect( () => {
    const switchTopics = async() => {
      try {
        const promises = [];

        const tmp = topics.map( t => {
          if ( t.status === 'live' ) {
            promises.push(
              client.patch(
                `topic/${ t._id }/status`,
                { status: 'open' }
              )
            );

            return { ...t, status: 'open' };

          } else if ( t._id === switchingTopics ) {
            promises.push(
              client.patch(
                `topic/${ t._id }/status`,
                { status: 'live' }
              )
            );

            return { ...t, status: 'live' };

          } else {
            return t;
          }
        });

        setTopics( tmp );
        setSwitchingTopics( null );

        await Promise.all( promises );

      } catch ( err ) {
        props.store.dispatch(
          notify({
            message: 'Failed to switch topics: ' + err.message,
            type: 'danger'
          })
        );
      }
    };

    if ( switchingTopics ) {
      switchTopics();
    }
  }, [ switchingTopics ] );

  useEffect( () => {
    const closeTopic = async() => {
      try {
        const res = await client.patch(
          `/topic/${ closingTopic }/status`,
          { status: 'closed' }
        );

        if ( res.status === 200 ) {
          const tmp = topics.map( t => {
            if ( t.status === 'live' ) {
              return { ...t, status: 'closed' };
            } else {
              return t;
            }
          });

          setTopics( tmp );
          setClosingTopic( null );
        }

      } catch ( err ) {
        props.store.dispatch(
          notify({
            message: 'Failed to close topic: ' + err.message,
            type: 'danger'
          })
        );
      }
    };

    if ( closingTopic ) {
      closeTopic();
    }
  }, [ closingTopic ] );

  if ( !meeting || topicsLoading ) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingIcon />
      </div>
    );
  }

  let live;
  let closed = [];
  let open   = [];

  const sortedByLikesInsert = ( topicArray, topic ) => {
    const tmp = [ ...topicArray ];

    for ( let i = 0; i < topicArray.length; i++ ) {
      if ( topic.likes >= tmp[ i ].likes ) {
        tmp.splice( i, 0, topic );
        return tmp;
      }
    }

    tmp.push( topic );

    return tmp;
  };

  for ( const topic of topics ) {
    switch ( topic.status ) {
      case 'open':
        open = sortedByLikesInsert( open, topic );
        break;
      case 'closed':
        closed = sortedByLikesInsert( closed, topic );
        break;
      default:
        live = topic;
        break;
    }
  }

  const openCards = open.map( t => {
    return (
      <div
        className={sharedStyles.card + ' ' + styles.card} key={ t.name }
        onClick={ () => setSwitchingTopics( t._id ) }
      >
        <p>{t.name}</p>
      </div>
    );
  });

  const closedCards = closed.map( t => {
    return (
      <div
        className={sharedStyles.card + ' ' + styles.card} key={ t.name }
        onClick={ () => setSwitchingTopics( t._id ) }
      >
        <p>{t.name}</p>
      </div>
    );
  });

  return (
    <div className={sharedStyles.page}>
      <h2 className={styles.page_title}>Live Meeting: {meeting.name}</h2>
      <div className={styles.container}>
        <div className={styles.side_container}>
          <h3>Open Topics</h3>
          { openCards }
        </div>
        <div className={styles.main_container}>
          <h3>Under Discussion</h3>
          <div className={styles.discussion_container}>
            { live &&
            <div className={sharedStyles.card + ' ' + styles.discussion_card }>
              <h3>{live.name}</h3>
              <p>{live.description}</p>
              <Button
                onClick={() => setClosingTopic( live._id )}
                variant='outlined'
                text='close'
              />
            </div>
            }
          </div>

          { live &&
          <>
            <h3>Takeaways</h3>
            <div className={styles.takeaway_container}>
              <CardBoard
                key={ live._id }
                getAll={ () => topicAPI.getTakeaways( live._id )}
                create={ ( payload ) => takeawayAPI.create({
                  topic_id: live._id,
                  ...payload
                })}
                update={ ( id, payload ) => takeawayAPI.update( id, payload ) }
                destroy={ ( id ) => takeawayAPI.destroy( id )}
              />
            </div>
          </>
          }
        </div>
        <div className={styles.side_container}>
          <h3>Closed Topics</h3>
          { closedCards }
        </div>
      </div>
    </div>
  );
};

export default Meet;

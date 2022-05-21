import LoadingIcon   from '../../../components/LoadingIcon';
import TakeawayBoard from '../../../components/Bundles/Meeting/TakeawayBoard';
import Button        from '../../../components/Button';

import { useEffect, useState } from 'react';
import { useRouter }           from 'next/router';

import { notify } from '../../../store/features/snackbar/snackbarSlice';

import client from '../../../store/client';

import styles       from '../../../styles/Meet.module.css';
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
      try {
        const { data: topics } = await client.get(
          `/meeting/${ meeting_id }/topics`
        );

        setTopics( topics );
        setTopicsLoading( false );
      } catch ( err ) {
        props.store.dispatch(
          notify({
            message: 'Failed to fetch topics: ' + err.message,
            type: 'danger'
          })
        );
      }
    };

    if ( topicsLoading && meeting_id ) {
      loadTopics();
    }
  }, [ router.query.id, topicsLoading ] );

  useEffect( () => {
    const loadParticipants = async() => {
      try {
        const { data: participants } = await client.get(
          `/meeting/${ meeting_id }/participants`
        );

        setParticipants( participants );
        setParticipantsLoading( false );
      } catch ( err ) {
        props.store.dispatch(
          notify({
            message: 'Failed to fetch participants: ' + err.message,
            type: 'danger'
          })
        );
      }
    };

    if ( meeting_id && participantsLoading ) {
      loadParticipants();
    }
  }, [ router.query.id, participantsLoading ] );

  useEffect( () => {
    const loadMeeting = async() => {
      try {
        const { data: meeting } = await client.get(
          `/meeting/${ meeting_id }`
        );

        setMeeting( meeting );
        setMeetingLoading( false );
      } catch ( err ) {
        props.store.dispatch(
          notify({
            message: 'Failed to fetch participants: ' + err.message,
            type: 'danger'
          })
        );
      }
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

        const res = await Promise.all( promises );

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
        className={sharedStyles.card} key={ t.name }
        onClick={ () => setSwitchingTopics( t._id ) }
      >
        {t.name}
      </div>
    );
  });

  const closedCards = closed.map( t => {
    return (
      <div
        className={sharedStyles.card} key={ t.name }
        onClick={ () => setSwitchingTopics( t._id ) }
      >
        {t.name}
      </div>
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.sideContainer}>
        <h3>Open Topics</h3>
        { openCards }
      </div>
      <div className={styles.mainContainer}>
        <h3>Under Discussion</h3>
        { live &&
          <div className={sharedStyles.card}>
            <h3>{live.name}</h3>
            <p>{live.description}</p>
            <Button
              onClick={() => setClosingTopic( live._id )}
              variant='outlined'
              size='small'
              text='close'
            />
          </div>
        }
        { live &&
          <TakeawayBoard topic_id={ live._id } />
        }
      </div>
      <div className={styles.sideContainer}>
        <h3>Closed Topics</h3>
        { closedCards }
      </div>
    </div>
  );
};

export default Meet;

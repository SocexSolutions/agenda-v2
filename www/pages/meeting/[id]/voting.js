import LoadingIcon from '../../../components/LoadingIcon';

import ArrowCircleUp from '@mui/icons-material/ThumbUp';

import styles from '../../../styles/Voting.module.css';

import client from '../../../store/client';

import { useEffect, useState } from 'react';

import { useSelector }  from 'react-redux';
import { fetchMeeting } from '../../../store/features/meetings/meetingSlice';
import { useRouter }    from 'next/router';

const selectUser = state => state.user;

// TODO get meeting id based on route
const Voting = ( props ) => {
  const [ liking, setLiking ]   = useState('');
  const [ loading, setLoading ] = useState( true );
  const [ meeting, setMeeting ] = useState( null );

  const user = useSelector( selectUser );
  const router = useRouter();

  useEffect( () => {
    const loadMeeting = async() => {
      const meeting_id = router.query.id;

      await props.store.dispatch( fetchMeeting( meeting_id ) );

      const { meetings: { openMeeting } } = props.store.getState();

      setMeeting({
        ...openMeeting,
        topics: openMeeting.topics.map( topic => {
          const userLiked = topic.likes.includes( user.email );

          return {
            ...topic,
            discussed: false,
            userLiked
          };
        })
      });

      setLoading( false );
    };

    loadMeeting();
  }, [ loading ] );


  useEffect( () => {
    const likeTopic = async() => {
      await client.patch(
        'topic/' + liking + '/like',
        { email: user.email }
      );

      setLiking( false );
      setLoading( true );
    };

    if ( liking.length ) {
      likeTopic();
    }
  }, [ liking ] );


  const onLike = ( topic_id ) => {
    meeting.topics = meeting.topics.map( t => {
      if ( t._id === topic_id ) {
        t.userLiked = !t.userLiked;
      }

      return t;
    });

    setLiking( topic_id );
  };

  if ( !meeting ) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingIcon />
      </div>
    );
  }

  const topicCards = meeting.topics.map( t => {
    const classNames = t.userLiked ?
      styles.dislike :
      styles.like;

    return (
      <div className={styles.topic} key={t.name}>
        <h2>{t.name}</h2>
        <ArrowCircleUp
          fontSize='large'
          className={classNames}
          onClick={() => onLike( t._id )}
        />
      </div>
    );
  });

  // dynamically generate topics cards
  return (
    <div className={styles.container}>
      { topicCards }
    </div>
  );
};

export default Voting;

import LoadingIcon from '../../../components/shared/LoadingIcon/LoadingIcon';
import Button      from '../../../components/shared/Button/Button';

import ThumbsUpIcon from '@mui/icons-material/ThumbUp';

import styles from '../../../styles/pages/meeting/[id]/voting.module.css';
import shared from '../../../styles/Shared.module.css';

import meetingAPI from '../../../api/meeting';
import topicAPI   from '../../../api/topic';

import { useEffect, useState } from 'react';
import { useSelector }         from 'react-redux';
import { useRouter }           from 'next/router';

const selectUser = state => state.user;

const Vote = ( props ) => {
  const [ liking, setLiking ]   = useState('');
  const [ loading, setLoading ] = useState( true );
  const [ meeting, setMeeting ] = useState( null );

  const user   = useSelector( selectUser );
  const router = useRouter();

  const meeting_id = router.query.id;

  useEffect( () => {
    const loadMeeting = async() => {
      const meeting = await meetingAPI.aggregate( meeting_id );

      setMeeting( meeting );
      setLoading( false );
    };

    if ( meeting_id ) {
      loadMeeting();
    }
  }, [ loading, router.query.id, props.store, user.email ] );

  useEffect( () => {
    const likeTopic = async() => {
      await topicAPI.like( liking, user.email );
      setLiking( false );
    };

    if ( liking.length ) {
      likeTopic();
    }
  }, [ liking, user.email ] );

  const onLike = ( topic_id ) => {
    meeting.topics = meeting.topics.map( t => {
      if ( t._id === topic_id ) {
        t.userLiked = !t.userLiked;
      }

      return t;
    });

    setLiking( topic_id );
  };

  if ( loading ) {
    return (
      <div className={styles.blank_container}>
        <LoadingIcon />
      </div>
    );
  }

  if ( !meeting.topics.length ) {
    return (
      <div className={styles.blank_container}>
        <h1>This Meeting Has No Topics :(</h1>
      </div>
    );
  }

  const topicCards = meeting.topics.map( t => {
    const classNames = t.userLiked ?
      styles.dislike :
      styles.like;

    return (
      <div className={shared.card + ' ' + styles.topic} key={t.name}>
        <h3>{t.name}</h3>
        <p>{t.description}</p>
        <Button
          className={styles.like}
          variant='icon'
          icon={
            <ThumbsUpIcon
              fontSize='large'
              className={classNames}
              onClick={() => onLike( t._id )}
            />
          }
        />
      </div>
    );
  });

  return (
    <div className={shared.page}>
      <div className={shared.container}>
        <h2>Voting For: {meeting.meeting.name}</h2>
        { topicCards }
      </div>
    </div>
  );
};

export default Vote;

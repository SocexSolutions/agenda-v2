import HeaderForm  from '../../../components/HeaderForm/HeaderForm';
import CardBoard   from '../../../components/CardBoard/CardBoard';
import ChipForm    from '../../../components/ChipForm/ChipForm';
import LoadingIcon from '../../../components/LoadingIcon/LoadingIcon';
import Hr          from '../../../components/Hr/hr';

import meetingAPI     from '../../../api/meeting';
import topicAPI       from '../../../api/topic';
import participantAPI from '../../../api/participant';

import { useRouter }           from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector }         from 'react-redux';

import styles from '../../../styles/pages/meeting/[id]/index.module.css';
import shared from '../../../styles/Shared.module.css';

const Meeting = ( props ) => {
  const router = useRouter();
  const user   = useSelector( ( state ) => state.user );

  const meeting_id = router.query.id;

  const [ initLoad, setInitLoad ] = useState( true );
  const [ name, setName ]         = useState('');

  useEffect( () => {
    const loadMeeting = async() => {
      const res = await meetingAPI.get( meeting_id );

      setName( res.name );

      setInitLoad( false );
    };

    if ( initLoad && meeting_id ) {
      loadMeeting();
    }
  }, [ user, props.store, router.query.id ] );

  const updateMeeting = ( name ) => {
    meetingAPI.update(
      meeting_id,
      { name }
    );

    setName( name );
  };

  if ( initLoad ) {
    return <LoadingIcon />;
  }

  return (
    <div className={shared.page}>
      <div className={shared.container}>
        <h2>Edit Meeting: {name}</h2>
        <Hr/>
        <div className={shared.bxCard + ' ' + styles.section}>
          <h3>Meeting Details</h3>
          <HeaderForm
            setMeetingName={( e ) => updateMeeting( e.target.value ) }
            meetingName={name}
          />
        </div>
        <div className={shared.bxCard + ' ' + styles.section}>
          <h3>Participants</h3>
          <ChipForm
            change={meeting_id}
            itemKey={'email'}
            itemName={'participant'}
            getAll={ () => meetingAPI.getParticipants( meeting_id ) }
            create={ ( payload ) => participantAPI.create({
              meeting_id,
              ...payload
            }) }
            destroy={ ( id ) => participantAPI.destroy( id ) }
          />
        </div>
        <div className={shared.bxCard + ' ' + styles.section}>
          <h3>Topics</h3>
          <CardBoard
            change={meeting_id}
            getAll={ () => meetingAPI.getTopics( meeting_id ) }
            create={ ( payload ) => topicAPI.create({
              meeting_id,
              ...payload
            })}
            update={ ( id, payload ) => topicAPI.update( id, payload ) }
            destroy={ ( id ) => topicAPI.destroy( id ) }
          />
        </div>
      </div>
    </div>
  );
};

export default Meeting;

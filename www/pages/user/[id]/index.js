import { useEffect, useState } from 'react';
import { useSelector }         from 'react-redux';

import Inbox       from '../../../components/Inbox';
import LoadingIcon from '../../../components/LoadingIcon';

import client from '../../../api/client';

import shared from '../../../styles/Shared.module.css';
import styles from '../../../styles/pages/user/[id]/index.module.css';

import { notify } from '../../../store/features/snackbar';


const User = ( props ) => {
  const [ loading, setLoading ]                    = useState( true );
  const [ ownedMeetings, setOwnedMeetings ]        = useState([]);
  const [ participantMeetings, setParticMeetings ] = useState([]);

  const user = useSelector( state => state.user );

  useEffect( () => {
    async function load() {
      try {
        const res = await Promise.all([
          client.get( `participant/meetings/${ user.email }` ),
          client.get( `user/meetings/${ user._id }` )
        ]);

        setParticMeetings( res[ 0 ].data );
        setOwnedMeetings( res[ 1 ].data );

        setLoading( false );
      } catch ( err ) {
        props.store.dispatch(
          notify({
            message: 'Failed to fetch meeting: ' + err.message,
            type: 'danger'
          })
        );
      }
    }

    if ( user._id ) {
      load();
    }
  }, [ user ] );

  if ( loading ) {
    return (
      <>
        <LoadingIcon size="large" />
      </>
    );
  }

  const meetings = ownedMeetings.concat( participantMeetings );

  return (
    <div className={shared.page}>
      <div className={shared.container}>
        <h1 className={styles.page_title}>My Meetings</h1>
        <Inbox
          meetings={ meetings }
        />
      </div>
    </div>
  );
};

export default User;

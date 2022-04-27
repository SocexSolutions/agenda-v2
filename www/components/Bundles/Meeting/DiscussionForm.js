import styles from '../../../styles/Bundles/Meeting/DiscussionForm.module.css';
import Input from '../../../components/Input.js';
import Button from '../../../components/Button.js';
import saveTakeaway from '../../../store/features/takeaway/takeawaySlice';
import { notify } from '../../../store/features/snackbar/snackbarSlice';

import { useEffect, useState } from 'react';

const DiscussionForm = ( props ) => {

  const [ takeawayTitle, setTakeawayTitle ] = useState('');
  const [ takeawayDescription, setTakeawayDescription ] = useState('');
  const [ showInput, setShowInput ] = useState( false );
  const [ saving, setSaving ] = useState( false );

  useEffect( () => {
    const save = async() => {
      try {
        await props.store.dispatch(
          saveTakeaway({
            title: props.takeawayTitle,
            description: props.takeawayDescription,
            topicId: props.topicId
          })
        );


      } catch ( err ) {
        props.store.dispatch(
          notify({
            message: 'Add Takeaway Failed: ' + err.message,
            type: 'danger',
            success: false
          })
        );
      }
    };

    if ( saving ) {
      save();
    }

    setSaving( false );
  }, [ saving ] );

  function handleEnter( e ) {
    if ( e.key === 'Enter' && e.target.value ) {
      addTakeaway( e.target.value );
      setTakeawayTitle('');
      setTakeawayDescription('');
    }
  }

  function handleSubmit( e ) {
    if ( takeawayTitle ) {
      setTakeawayTitle('');
      setTakeawayDescription('');
      setSaving( true );
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>{props.title}</div>
        <Button
          text="Finish"
          onClick={props.finish}
        />
      </div>
      {!showInput &&
      <Button text='Add Takeaway' onClick={() => setShowInput( !showInput )}/>
      }
      <div className={styles.inputContainer}>
        { showInput &&
        <div className={styles.container}>
          <Input
            value={takeawayTitle}
            onChange={ ( e ) => setTakeawayTitle( e.target.value )}
            onKeyPress={ ( e ) => handleEnter( e )}
            size='large'
          />
          <Input
            value={takeawayDescription}
            variant='outlined'
            size='xl'
            onChange={ ( e ) => setTakeawayDescription( e.target.value )}
            onKeyPress={ ( e ) => handleEnter( e )}
            multiLine={true}
            rows='4'
            cols='50'
          />
          <Button text="Submit" onClick={( e ) => handleSubmit( e )}/>
        </div>
        }
      </div>
    </>
  );
};

export default DiscussionForm;

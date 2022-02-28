import styles from '../../../styles/Bundles/Meeting/DiscussionForm.module.css';
import Input from '../../../components/Input.js';
import Button from '../../../components/Button.js';

import { useState } from 'react';

const DiscussionForm = ({ title, finish, addTakeaway }) => {
  const [ takeaway, setTakeaway ] = useState('');

  function handleEnter( e ) {
    if ( e.key === 'Enter' && e.target.value ) {
      addTakeaway( e.target.value );
      setTakeaway('');
    }
  }

  function handleSubmit( e ) {
    if ( takeaway ) {
      addTakeaway( takeaway );
      setTakeaway('');
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>{title}</div>
        <Button
          text="Finish"
          onClick={finish}
        />
      </div>
      <div className={styles.inputContainer}>
        <Input
          value={takeaway}
          variant='outlined'
          onChange={ ( e ) => setTakeaway( e.target.value )}
          onKeyPress={ ( e ) => handleEnter( e )}
          size='xl'
        />
        <Button text="Submit" />
      </div>
    </>
  );
};

export default DiscussionForm;

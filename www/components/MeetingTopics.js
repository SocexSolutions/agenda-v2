import PropTypes from 'prop-types';
import styles from '../styles/MeetingTopics.module.css';
import Chip from './Chip';
import Input from './Input';
import Button from '../components/Button';
import { useState } from 'react';



function MeetingTopics( props ) {
  const [ topic, setTopic ] = useState();

  function handleChange( event ) {
    setTopic( event.target.value );
  }

  function handleEnter( event ) {
    if ( event.key === 'Enter' ) {
      handleSubmit();
    }
  }

  function handleSubmit() {
    if ( topic ) {
      props.addTopic( topic );
      setTopic('');
    }
  }

  const topics = [];

  props.topics.forEach( ( topic ) => {
    topics.push(
      <Chip
        editing={true}
        text={topic}
        key={topic}
        deleteFunc={() => props.deleteTopic( topic )}
      />
    );
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.topicsTitle}>Topics</h2>
      <div className={styles.topics}>{topics}</div>
      <p>Add Topic</p>
      <div className={styles.inputContainer}>
        <Input name="topic" value={topic} onChange={handleChange} onKeyPress={handleEnter} />
        <Button text="add" varient="secondary" onClick={handleSubmit} />
      </div>
    </div>
  );
}

MeetingTopics.propTypes = {
  addTopic: PropTypes.func,
  deleteTopic: PropTypes.func,
  topics: PropTypes.object
};
export default MeetingTopics;

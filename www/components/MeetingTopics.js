import PropTypes from "prop-types";
import styles from "../styles/MeetingTopics.module.css";
import Chip from "./Chip";
import Input from "./Input";
import Button from "../components/Button";
import { useState } from "react";

MeetingTopics.PropTypes = {
  topics: PropTypes.string,
};

function MeetingTopics( props ) {
  const [ topic, setTopic ] = useState();

  function handleChange( event ) {
    setTopic( event.target.value );
  }

  function handleSubmit() {
    if ( topic ) {
      props.addTopic( topic );
      setTopic( "" );
    }
  }

  const topics = props.topics.map( ( topic ) => {
    return (
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
        <Input name="topic" value={topic} onChange={handleChange} />
        <Button text="add" varient="primary" onClick={handleSubmit} />
      </div>
    </div>
  );
}

export default MeetingTopics;

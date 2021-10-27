import PropTypes from "prop-types";
import styles from "../styles/MeetingParticipants.module.css";
import Chip from "./Chip";
import Input from "./Input";
import Button from "./Button";
import { useState } from "react";

MeetingParticipants.PropTypes = {
  participants: PropTypes.Array,
  owner: PropTypes.string,
};

function MeetingParticipants( props ) {
  const [ participant, setParticipant ] = useState( "" );

  function handleChange( event ) {
    setParticipant( event.target.value );
  }

  function handleEnter( event ) {
    if ( event.key === "Enter" ) {
      handleSubmit();
    }
  }

  function handleSubmit() {
    if ( participant ) {
      props.addParticipant( participant );
      setParticipant( "" );
    }
  }

  const participants = [];

  props.participants.forEach( ( participant ) => {
    participants.push(
      <Chip
        editing={true}
        text={participant}
        key={participant}
        deleteFunc={() => {
          props.deleteParticipant( participant );
        }}
      />
    );
  });

  return (
    <div className={styles.container}>
      <h2>Participants</h2>
      <p>Owner</p>
      <Chip text={props.owner} icon={true} />
      <p>Participant(s)</p>
      <div className={styles.participantContainer}>{participants}</div>
      <p>Add Participant</p>
      <Input
        placeholder="Email"
        value={participant}
        onChange={handleChange}
        onKeyPress={handleEnter}
      />
      <Button
        name="submit"
        varient="secondary"
        onClick={handleSubmit}
        text="add"
      />
    </div>
  );
}

export default MeetingParticipants;

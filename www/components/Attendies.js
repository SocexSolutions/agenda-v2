import PropTypes from "prop-types";
import styles from "../styles/Attendies.module.css";
import Chip from "./Chip";
import Input from "./Input";

Attendies.PropTypes = {
  participants: PropTypes.Array,
  owner: PropTypes.string,
};

function Attendies( props ) {
  const participants = props.participants.map( ( participant ) => {
    return <Chip text={participant} key={participant} />;
  });

  return (
    <div className={styles.container}>
      <h2>Attendies</h2>
      <p>Owner</p>
      <Chip text={props.owner} icon={true} />
      <p>Participant(s)</p>
      <div className={styles.participantContainer}>{participants}</div>
      <p>Add Participant</p>
      <Input placeholder="Email" />
    </div>
  );
}

export default Attendies;

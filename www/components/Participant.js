import React from "react";
import PropTypes from "prop-types";
import Chip from "./Chip";
import styles from "../styles/Participant.module.css";

function Participant({ text, owner }) {
  return (
    <div>
      <Chip className={styles.text} text={text} editing={true}
        deleteFunc={true} icon={true}/>
    </div>
  );
}

Participant.propTypes = {
  text: PropTypes.string,
};

Participant.defaultProps = {
  text: "Who this??"

};
export default Participant;

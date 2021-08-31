import PropTypes from "prop-types";
import styles from "../styles/Chip.module.css";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

const Chip = ({ text, editing, deleteFunc }) => {
  return (
    <div className={styles.container}>
      <p>{text}</p>
      { editing &&
        <CancelRoundedIcon
          className={styles.deleteIcon}
          onClick={deleteFunc}
        />
      }
    </div>
  );
};

Chip.propTypes = {
  text: PropTypes.string,
  editing: PropTypes.bool,
  deleteFunc: PropTypes.func
};

module.exports = Chip;

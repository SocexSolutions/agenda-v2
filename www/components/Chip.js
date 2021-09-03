import PropTypes from "prop-types";
import styles from "../styles/Chip.module.css";
import CancelOutlined from "@material-ui/icons/CancelOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
const Chip = ({ text, editing, deleteFunc }) => {
  return (
    <div className={styles.container}>
      <AccountCircleIcon className={styles.icons} />
      <p>{text}</p>
      { editing &&
        <CancelOutlined
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

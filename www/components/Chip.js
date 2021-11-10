import PropTypes from "prop-types";
import styles from "../styles/Chip.module.css";
import CancelOutlined from "@material-ui/icons/CancelOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const Chip = ({ text, editing, deleteFunc, icon }) => {
  if ( icon == true ) {
    icon=<AccountCircleIcon className={styles.icons} />;
  }

  return (
    <div className={styles.container}>
      {icon}
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
  deleteFunc: PropTypes.func,
  icon: PropTypes.object
};

module.exports = Chip;

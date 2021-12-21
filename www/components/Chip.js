import styles from '../styles/Chip.module.css';
import CancelOutlined from '@material-ui/icons/CancelOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const Chip = ({ text, editing, deleteFunc, icon }) => {

  if ( icon ) {
    icon = <AccountCircleIcon className={styles.icons} />;
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

module.exports = Chip;

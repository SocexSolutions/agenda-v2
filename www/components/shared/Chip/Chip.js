import CancelIcon        from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import styles from './Chip.module.css';

const Chip = ({ text, editing, deleteFunc, icon }) => {

  if ( icon ) {
    icon = <AccountCircleIcon className={styles.icons} />;
  }

  return (
    <div className={styles.container}>
      {icon}
      <p>{text}</p>
      { editing &&
        <CancelIcon
          className={styles.deleteIcon}
          onClick={deleteFunc}
        />
      }
    </div>
  );
};

module.exports = Chip;

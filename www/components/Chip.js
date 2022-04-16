import styles from '../styles/Chip.module.css';

import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import AccountCircleIcon       from '@mui/icons-material/AccountCircle';

const Chip = ({ text, editing, deleteFunc, icon }) => {

  if ( icon ) {
    icon = <AccountCircleIcon className={styles.icons} />;
  }

  return (
    <div className={styles.container}>
      {icon}
      <p>{text}</p>
      { editing &&
        <HighlightOffRoundedIcon
          className={styles.deleteIcon}
          onClick={deleteFunc}
        />
      }
    </div>
  );
};

module.exports = Chip;

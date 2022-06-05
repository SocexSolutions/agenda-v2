import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import AccountCircleIcon       from '@mui/icons-material/AccountCircle';

import styles from '../styles/components/Chip.module.css';

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

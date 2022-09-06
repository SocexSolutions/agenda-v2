import { useSelector } from 'react-redux';

import Button from '@mui/material/Button';

import DoubleArrowIcon      from '@mui/icons-material/DoubleArrow';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CancelOutlinedIcon   from '@mui/icons-material/CancelOutlined';

import styles from './Drawer.module.css';


const selectDrawer = state => state.drawer;

const Drawer = () => {
  const open = useSelector( selectDrawer ).open;

  return (
    <div className={styles.god_container}>
      <div className={`${ styles.container } ${ !open && styles.closed }`}>
        <Button
          startIcon={<DoubleArrowIcon />}
          variant="text"
          size="large"
          className={styles.icon_button}
        >
          Upcoming
        </Button>
        <Button
          startIcon={<CheckBoxOutlinedIcon />}
          variant="text"
          size="large"
          className={styles.icon_button + ' ' + styles.orange}
        >
          Completed
        </Button>
        <Button
          startIcon={<CancelOutlinedIcon />}
          variant="text"
          size="large"
          className={styles.icon_button + ' ' + styles.indigo}
        >
          Voting
        </Button>
      </div>
    </div>
  );
};

export default Drawer;

import { useSelector, useDispatch } from 'react-redux';
import { toggleDrawer }             from '../store/features/drawer';

import Button from '../components/Button';

import ArrowForwardIosIcon  from '@mui/icons-material/ArrowForwardIosTwoTone';
import DoubleArrowIcon      from '@mui/icons-material/DoubleArrow';
import CheckBoxOutlinedIcon from '@mui/icons-material/Checkboxoutlined';
import CancelOutlinedIcon   from '@mui/icons-material/CancelOutlined';

import styles from '../styles/Drawer.module.css';


const selectDrawer = state => state.drawer;

const Drawer = () => {
  const dispatch = useDispatch();
  const open     = useSelector( selectDrawer ).open;

  return (
    <div className={styles.god_container}>
      <div className={`${ styles.container } ${ !open && styles.closed }`}>
        <Button
          text="Upcoming"
          size="medium"
          stretch="wide"
          variant="menu"
          icon={<DoubleArrowIcon style={{ color: 'var(--agendaPurple)' }} />}
        />
        <Button
          text="Voting"
          size="medium"
          stretch="wide"
          variant="menu"
          icon={
            <CheckBoxOutlinedIcon style={{ color: 'var(--success)' }} />
          }
        />
        <Button
          text="Completed"
          size="medium"
          stretch="wide"
          variant="menu"
          icon={<CancelOutlinedIcon style={{ color: 'var(--danger)' }} />}
        />
      </div>
      <div
        className={styles.arrow_container}
        onClick={() => dispatch( toggleDrawer() )}
      >
        <div className={styles.arrow}>
          <div className={open ? styles.arrow_close : styles.arrow_open}>
            <ArrowForwardIosIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;

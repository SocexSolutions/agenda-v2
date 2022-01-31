import styles from '../styles/Drawer.module.css';

import Button from '../components/Button';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIosTwoTone';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import CheckBoxOutlinedIcon from '@material-ui/icons/Checkboxoutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

import { useSelector, useDispatch } from 'react-redux';
import { toggleDrawer } from '../store/features/ui/uiSlice';


const selectDrawer = state => state.ui.drawerOpen;

const Drawer = () => {
  const dispatch = useDispatch();
  const drawerOpen = useSelector( selectDrawer );

  return (
    <div className={styles.godContainer}>
      <div className={`${ styles.container } ${ !drawerOpen && styles.closed }`}>
        <h2>Socnet</h2>
        <Button
          text="Upcoming"
          size="large"
          stretch="wide"
          varient="menu"
          icon={<DoubleArrowIcon style={{ color: 'var(--agendaPurple)' }} />}
        />
        <Button
          text="Voting"
          size="large"
          stretch="wide"
          varient="menu"
          icon={
            <CheckBoxOutlinedIcon style={{ color: 'var(--agendaGreen)' }} />
          }
        />
        <Button
          text="Completed"
          size="large"
          stretch="wide"
          varient="menu"
          icon={<CancelOutlinedIcon style={{ color: 'var(--danger)' }} />}
        />
      </div>
      <div
        className={styles.arrowContainer}
        onClick={() => dispatch( toggleDrawer() )}
      >
        <div className={styles.arrow}>
          <div className={drawerOpen ? styles.arrowClose : styles.arrowOpen}>
            <ArrowForwardIosIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;

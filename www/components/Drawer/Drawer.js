import { useSelector } from 'react-redux';

import Button from '../Button/Button';

import DoubleArrowIcon      from '@mui/icons-material/DoubleArrow';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CancelOutlinedIcon   from '@mui/icons-material/CancelOutlined';

import styles from './Drawer.module.css';


const selectDrawer = state => state.drawer;

const Drawer = () => {
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
    </div>
  );
};

export default Drawer;

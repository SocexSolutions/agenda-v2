import { useSelector } from 'react-redux';

import Button from '@mui/material/Button';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DescriptionIcon from '@mui/icons-material/Description';

import { useRouter } from 'next/router';

import styles from './Drawer.module.scss';

const selectDrawer = ( state ) => state.drawer;
const selectUser = ( state ) => state.user;

const Drawer = () => {
  const open = useSelector( selectDrawer ).open;
  const router = useRouter();
  const user = useSelector( selectUser );

  return (
    <div className={styles.container}>
      <div className={`${ styles.drawer } ${ !open && styles.closed }`}>
        <Button
          startIcon={<CalendarMonthIcon />}
          variant="text"
          size="large"
          className={styles.icon_button + ' ' + styles.blue}
          onClick={() => router.push( `/user/${ user._id }` )}
        >
          Upcoming
        </Button>
        <Button
          startIcon={<EventAvailableIcon />}
          variant="text"
          size="large"
          className={styles.icon_button + ' ' + styles.green}
        >
          Completed
        </Button>
        <Button
          startIcon={<DescriptionIcon />}
          variant="text"
          size="large"
          className={styles.icon_button + ' ' + styles.purple}
        >
          Drafts
        </Button>
      </div>
    </div>
  );
};

export default Drawer;

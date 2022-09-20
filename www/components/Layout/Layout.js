import Nav from '../Nav/Nav';
import Drawer from '../Drawer/Drawer';
import Fab from '../Fab/Fab';
import meetingAPI from '../../api/meeting';
import AddIcon from '@mui/icons-material/Add';

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { refreshTheme } from '../../store/features/theme';

import styles from './Layout.module.css';

const pagesWithoutDrawer = new Set([ '', 'login', 'register' ]);

const Layout = ( props ) => {
  const user = useSelector( ( s ) => s.user );
  const drawerOpen = useSelector( ( s ) => s.drawer );

  const router = useRouter();

  const page = router.pathname.split('/').pop();
  const showDrawer = !pagesWithoutDrawer.has( page );

  useEffect( () => {
    async function themeRefresh() {
      props.store.dispatch( refreshTheme() );
    }

    themeRefresh();
  }, [ user ] );

  const createMeeting = async() => {
    // create a draft meeting before redirect so that created participants
    // and topics have a meeting_id to reference
    const res = await meetingAPI.create({ name: 'Draft', date: new Date() });

    router.push( `/meeting/${ res._id }` );
  };

  return (
    <>
      <Nav drawerOpen={drawerOpen} />
      <div className={styles.container}>
        {showDrawer && <Drawer drawerOpen={drawerOpen} />}
        <main>
          <content>{props.children}</content>
        </main>
      </div>
      { user._id &&
        <Fab
          color="primary"
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => createMeeting()}
        >
            Create
        </Fab>
      }
    </>
  );
};

export default Layout;

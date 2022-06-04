import Nav    from './Nav';
import Drawer from './Drawer';

import { useEffect }   from 'react';
import { useRouter }   from 'next/router';
import { useSelector } from 'react-redux';
import { refreshTheme } from '../store/features/theme';

import styles from '../styles/Layout.module.css';

const pagesWithoutDrawer = new Set([
  '',
  'login',
  'register'
]);

const pagesNeedingAuth = new Set([
  'meeting',
  'user',
  '[id]'
]);

const selectUser = state => state.user;

const Layout = ( props ) => {
  const drawerOpen = useSelector( ( state ) => state.drawer );

  const router = useRouter();

  const user = useSelector( selectUser );

  const page       = router.pathname.split('/').pop();
  const showDrawer = !pagesWithoutDrawer.has( page );
  const blockPage  = pagesNeedingAuth.has( page );

  useEffect( () => {
    if ( !user._id && blockPage ) {
      router.push('/login');
    }
  }, [ router ] );

  useEffect( () => {
    async function themeRefresh() {
      props.store.dispatch(
        refreshTheme()
      );
    }

    themeRefresh();
  }, [ user ] );

  return (
    <>
      <Nav
        drawerOpen={drawerOpen}
      />
      <div className={styles.container}>
        { showDrawer &&
          <Drawer
            drawerOpen={drawerOpen}
          />
        }
        <main>
          <content>
            {props.children}
          </content>
        </main>
      </div>
    </>
  );
};

export default Layout;

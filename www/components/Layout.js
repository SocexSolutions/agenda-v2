import Nav    from './Nav';
import Drawer from './Drawer';

import { useEffect }   from 'react';
import { useRouter }   from 'next/router';
import { useSelector } from 'react-redux';

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

const Layout = ({ children }) => {
  const drawerOpen = useSelector( ( state ) => state.drawer );
  const storeTheme = useSelector( ( state ) => state.theme );

  const router = useRouter();

  const user = useSelector( selectUser );

  const page       = router.pathname.split('/').pop();
  const showDrawer = !pagesWithoutDrawer.has( page );
  const blockPage  = pagesNeedingAuth.has( page );

  useEffect( () => {
    document.documentElement.setAttribute(
      'data-theme', storeTheme.theme.theme
    );

    if ( !user._id && blockPage ) {
      router.push('/login');
    }
  }, [ storeTheme, router ] );

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
            {children}
          </content>
        </main>
      </div>
    </>
  );
};

export default Layout;

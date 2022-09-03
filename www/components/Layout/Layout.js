import Nav    from '../Nav/Nav';
import Drawer from '../Drawer/Drawer';

import { useRouter }    from 'next/router';
import { useEffect }    from 'react';
import { useSelector }  from 'react-redux';
import { refreshTheme } from '../../store/features/theme';

import styles from './Layout.module.css';

const pagesWithoutDrawer = new Set([
  '',
  'login',
  'register'
]);

const Layout = ( props ) => {
  const user       = useSelector( s => s.user );
  const drawerOpen = useSelector( s => s.drawer );

  const router = useRouter();

  const page       = router.pathname.split('/').pop();
  const showDrawer = !pagesWithoutDrawer.has( page );

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

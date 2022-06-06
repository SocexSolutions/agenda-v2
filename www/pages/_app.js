import { useEffect } from 'react';
import { Provider }  from 'react-redux';

import { useStore }    from '../store';
import { userRefresh } from '../store/features/user';
import { useRouter }   from 'next/router';

import Snackbar from '../components/Snackbar';
import Layout   from '../components/Layout';

import '../styles/globals.css';
import Script from 'next/script';

const pagesNeedingAuth = new Set([
  'meeting',
  'user',
  '[id]'
]);

const App = ( props ) => {
  const store  = useStore();
  const router = useRouter();

  const user = store.getState().user;

  useEffect( () => {
    async function refresh() {
      if ( !store.getState().user._id ) {
        await store.dispatch( userRefresh() );
      }

      const user       = store.getState().user;
      const page       = router.pathname.split('/').pop();
      const blockPage  = pagesNeedingAuth.has( page );

      if ( !user._id && blockPage ) {
        router.push('/login');
      }
    }

    refresh();
  }, [ user ] );

  const Component = props.Component;

  return (
    <>
      <Script src="/theme.js" strategy="beforeInteractive" />
      <Provider store={store}>
        <Layout store={store}>
          <Component store={store} {...props.pageProps} />
        </Layout>
        <Snackbar />
      </Provider>
    </>
  );
};

export default App;

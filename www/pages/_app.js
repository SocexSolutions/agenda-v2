import { useEffect } from 'react';
import { Provider }  from 'react-redux';

import { useStore }    from '../store';
import { userRefresh } from '../store/features/user';

import { useRouter }   from 'next/router';

import { StyledEngineProvider } from '@mui/material/styles';

import { AdapterDayjs }         from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Snackbar from '../components/Snackbar/Snackbar';
import Layout   from '../components/Layout/Layout';

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
      {/* inject MUI styles first so that custom css/scss takes presidence */}
      <StyledEngineProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Script src="/theme.js" strategy="beforeInteractive" />
          <Provider store={store}>
            <Layout store={store}>
              <Component store={store} {...props.pageProps} />
            </Layout>
            <Snackbar />
          </Provider>
        </LocalizationProvider>
      </StyledEngineProvider>
    </>
  );
};

export default App;

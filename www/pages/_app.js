import Layout          from '../components/Layout';
import { Provider }    from 'react-redux';
import { useStore }    from '../store/store';
import { useEffect }   from 'react';
import { userRefresh } from '../store/features/user/userSlice';
import parseCookie     from '../utils/parseCookie';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const store = useStore({});

  useEffect( () => {
    const token = parseCookie( document.cookie, 'agenda-auth' );

    if ( token ) {
      store.dispatch(
        userRefresh( token )
      );
    }
  });

  return (
    <Provider store={store}>
      <Layout>
        <Component store={store} {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;

import Layout          from '../components/Layout';
import { Provider }    from 'react-redux';
import { useStore }    from '../store/store';
import { useEffect }   from 'react';
import { userRefresh } from '../store/features/user/userSlice';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const store = useStore({});

  useEffect( () => {
    const pair = document.cookie.split('; ').filter( str => {
      return 'agenda-auth' === str.split('=')[ 0 ];
    });

    const token = pair[ 0 ].split('=')[ 1 ];

    if ( pair.length ) {
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

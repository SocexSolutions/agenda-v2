import { useEffect } from 'react';
import { Provider }  from 'react-redux';

import { useStore }    from '../store/store';
import { userRefresh } from '../store/features/user/userSlice';


import Snackbar from '../components/Snackbar';
import Layout   from '../components/Layout';

import '../styles/globals.css';
import Script from 'next/script';

const App = ( props ) => {
  const store = useStore();

  useEffect( () => {
    async function refresh() {
      store.dispatch(
        userRefresh()
      );
    }

    if ( !store.getState().user._id ) {
      refresh();
    }
  });

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

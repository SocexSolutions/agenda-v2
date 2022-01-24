import Layout          from '../components/Layout';
import { Provider }    from 'react-redux';
import { useStore }    from '../store/store';
import { useEffect }   from 'react';
import { userRefresh } from '../store/features/user/userSlice';

import '../styles/globals.css';

function MyApp( props ) {
  const store  = useStore({});

  useEffect( () => {
    store.dispatch(
      userRefresh()
    );
  });

  const Component = props.Component;

  return (
    <Provider store={store}>
      <Layout>
        <Component store={store} {...props.pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;

import Layout           from '../components/Layout';
import { Provider }     from 'react-redux';
import { useStore }     from '../store/store';
import { useEffect }    from 'react';
import { useState }     from 'react';
import { userRefresh }  from '../store/features/user/userSlice';
import { changeTheme }  from '../utils/theme';

import Snackbar         from '../components/Snackbar';

import '../styles/globals.css';

const wait = ( ms, fn ) => {
  return new Promise( res => setTimeout( () => {
    fn();
    res();
  }, ms ) );
};

const App = props => {
  const store  = useStore({});

  const [ snackMessage, setSnackMessage ] = useState('');
  const [ snackType, setSnackType ]       = useState('');
  const [ snackOpen, setSnackOpen ]       = useState( false );

  const notify = async({
    message = 'Congradalashun',
    type = 'success',
    ms = 3000
  }) => {
    setSnackMessage( message );
    setSnackType( type );
    setSnackOpen( true );

    return wait( ms, () => setSnackOpen( false ) );
  };

  useEffect( () => {
    store.dispatch(
      userRefresh()
    );
  });

  const Component = props.Component;

  return (
    <Provider store={store}>
      <Layout>
        <Component
          store={store}
          notify={notify}
          {...props.pageProps}
        />
      </Layout>
      <Snackbar
        message={snackMessage}
        type={snackType}
        open={snackOpen}
        setOpen={setSnackOpen}
      />
    </Provider>
  );
};

export default App;

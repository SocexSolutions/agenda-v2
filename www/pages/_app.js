import Layout           from '../components/Layout';
import { Provider }     from 'react-redux';
import { useStore }     from '../store/store';
import { useEffect }    from 'react';
import { useState }     from 'react';
import { userRefresh }  from '../store/features/user/userSlice';
import { refreshTheme } from '../store/features/ui/uiSlice';

import Snackbar         from '../components/Snackbar';

import '../styles/globals.css';

const wait = ( ms, fn ) => {
  return new Promise( res => setTimeout( () => {
    fn();
    res();
  }, ms ) );
};

const App = props => {
  const store = useStore({});
  const state = store.getState();

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

  const theme = state.ui.theme;
  const user  = state.user;

  console.log( theme );

  useEffect( () => {
    async function refresh() {
      // if ( !user ) {
      await store.dispatch(
        userRefresh()
      );
      // }
    }

    refresh();
  });

  useEffect( () => {
    async function refresh() {
      await store.dispatch(
        refreshTheme()
      );
    }
    refresh();
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

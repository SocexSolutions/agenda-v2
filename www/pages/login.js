import Button    from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useState }  from 'react';
import { useEffect } from 'react';

import { useRouter } from 'next/router';
import Link          from 'next/link';

import { userLogin } from '../store/features/user';
import { notify }    from '../store/features/snackbar';

import styles from '../styles/pages/login.module.css';

const initialState = {
  username: '',
  password: ''
};

const Login = ( props ) => {
  const [ fields, setFields ]       = useState( initialState );
  const [ loggingIn, setLoggingIn ] = useState( false );

  const router = useRouter();

  useEffect( () => {
    const login = async() => {
      try {
        await props.store.dispatch(
          userLogin( fields )
        );

        await props.store.dispatch(
          notify({
            message: 'Login Successful',
            ms: 1500
          })
        );

        const user = props.store.getState().user;

        router.push( `/user/${ user._id }` );

      } catch ( err ) {
        await props.store.dispatch(
          notify({
            message: 'Login Failed: ' + err.message,
            type: 'danger',
            ms: 3000
          })
        );
      }

      setLoggingIn( false );
      setFields( initialState );
    };

    if ( loggingIn ) {
      login();
    }
  }, [ loggingIn ] );

  const handleSubmit = ( event ) => {
    event.preventDefault();
    setLoggingIn( true );
  };

  const handleChange = ( event ) => {
    setFields({ ...fields, [ event.target.name ]: event.target.value });
  };

  return (
    <div className={styles.form_container}>
      <form>
        <h1 className={styles.form_title}>Login</h1>
        <TextField
          name='username'
          label='username'
          variant='standard'
          value={fields.username}
          onChange={e => handleChange( e )}
          className={styles.text_field}
        />
        <TextField
          name='password'
          label='password'
          variant='standard'
          type='password'
          value={fields.password}
          onChange={e => handleChange( e )}
          className={styles.text_field}
        />
        <div className={styles.login_button_container}>
          <Button
            onClick={handleSubmit}
            className={styles.login_button}
            variant='contained'
            disableElevation
          >
            Login
          </Button>
        </div>
        <p className={styles.new_to_agenda}>
          New to agenda?
          <Link
            href={'/register'}
            className={styles.register_link}
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

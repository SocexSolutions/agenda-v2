import { useRouter } from 'next/router';
import Link          from 'next/link';

import Button    from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { notify } from '../store/features/snackbar';

import { useState }     from 'react';
import { useEffect }    from 'react';
import { userRegister } from '../store/features/user';

import client from '../api/client';

import styles from '../styles/pages/register.module.css';

const initialState = {
  email:    '',
  username: '',
  password: ''
};

const Register = props => {
  const [ registering, setRegistering ] = useState( false );

  const router = useRouter();
  const [ fields, setFields ]               = useState( initialState );
  const [ emailError, setEmailError ]       = useState( false );
  const [ usernameError, setUsernameError ] = useState( false );

  const handleChange = ( event ) => {
    setFields({ ...fields, [ event.target.name ]: event.target.value });
  };

  useEffect( () => {
    const register = async() => {
      try {
        await props.store.dispatch(
          userRegister( fields )
        );

        await props.store.dispatch(
          notify({
            message: 'Registration Successful',
            ms: 1500
          })
        );

        const user = props.store.getState().user;

        router.push( `/user/${ user._id }` );

      } catch ( err ) {
        await props.store.dispatch(
          notify({
            message: 'Registration Failed: ' + err.message,
            type: 'danger',
            ms: 3000
          })
        );
      }

      setFields( initialState );
      setRegistering( false );
    };

    if ( registering ) {
      register();
    }
  }, [ registering ] );

  const handleSubmit = ( event ) => {
    event.preventDefault();
    setRegistering( true );
  };

  useEffect( () => {
    const checkEmail = async() => {
      try {
        await client.post(
          'user/checkexistingemail',
          { email: fields.email }
        );

        if ( emailError ) {
          setEmailError( false );
        }

      } catch ( err ) {
        if ( err.response.status === 409 ) {
          setEmailError('username already in use');
        }
      }
    };

    checkEmail();
  }, [ fields.email ] );

  useEffect( () => {
    const checkUsername = async() => {
      try {
        await client.post(
          'user/checkexistingusername',
          { username: fields.username }
        );

        if ( usernameError ) {
          setEmailError( false );
        }
      } catch ( err ) {
        if ( err.response.status === 409 ) {
          setUsernameError('username already in use');
        }
      }
    };
    checkUsername();
  }, [ fields.username ] );

  return (
    <div className={styles.form_container}>
      <form>
        <h1 className={styles.form_title}>
          Sign Up
        </h1>
        <TextField
          name='email'
          label='email'
          variant='standard'
          value={fields.email}
          onChange={handleChange}
          className={styles.text_field}
          error={emailError}
        />
        <TextField
          name='username'
          label='username'
          variant='standard'
          value={fields.username}
          onChange={handleChange}
          className={styles.text_field}
          error={usernameError}
        />
        <TextField
          name='password'
          label='password'
          type='password'
          variant='standard'
          value={fields.password}
          onChange={handleChange}
          className={styles.text_field}
        />
        <div className={styles.login_button_container}>
          <Button
            variant='contained'
            onClick={handleSubmit}
            className={styles.login_button}
            disableElevation
          >
            Sign Up
          </Button>
        </div>
        <p className={styles.have_an_account}>
          Have an account?
          <Link
            href={'/login'}
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

import { useRouter } from 'next/router';

import { notify } from '../store/features/snackbar';

import Input  from '../components/Input/Input';
import Button from '../components/Button/Button';

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
        <Input
          name='email'
          type='email'
          id='email'
          placeholder='Email'
          size='medium'
          value={fields.email}
          onChange={handleChange}
          errorMessage={emailError}
        />
        <Input
          name='username'
          type='text'
          id='username'
          placeholder='Username'
          size='medium'
          value={fields.username}
          onChange={handleChange}
          errorMessage={usernameError}
        />
        <Input
          name='password'
          type='password'
          id='password'
          placeholder='Password'
          size='medium'
          value= {fields.password}
          onChange={handleChange}
        />
        <Button
          onClick={handleSubmit}
          text='Sign Up'
          size='medium'
          customClass={styles.login_button}
          variant='outlined'
        />
      </form>
    </div>
  );
};

export default Register;

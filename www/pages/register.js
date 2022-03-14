import Input  from '../components/Input';
import Button from '../components/Button';

import { useState }  from 'react';
import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { userRegister } from '../store/features/user/userSlice';
import { notify }       from '../store/features/snackbar/snackbarSlice';

import styles from '../styles/Register.module.css';

const initialState = {
  email:    '',
  username: '',
  password: ''
};

const Register = props => {
  const [ fields, setFields ]           = useState( initialState );
  const [ registering, setRegistering ] = useState( false );

  const router = useRouter();

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

  return (
    <div className={styles.formContainer}>
      <form>
        <h1 className={styles.formTitle}>
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
        />
        <Input
          name='username'
          type='text'
          id='username'
          placeholder='Username'
          size='medium'
          value={fields.username}
          onChange={handleChange}
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
          customClass={styles.loginButton}
          variant='outlined'
        />
      </form>
    </div>
  );
};

export default Register;

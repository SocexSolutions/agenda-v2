import Button from '../components/Button';
import Input  from '../components/Input';

import { useState }  from 'react';
import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { userLogin } from '../store/features/user';
import { notify }    from '../store/features/snackbar';

import styles from '../styles/Register.module.css';

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
          value={fields.password}
          onChange={handleChange}
        />
        <Button
          onClick={handleSubmit}
          text='Login'
          size='medium'
          variant='outlined'
          customClass={styles.login_button}
        />
      </form>
    </div>
  );
};

export default Login;

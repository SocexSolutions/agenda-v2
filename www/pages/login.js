import styles from '../styles/Register.module.css';
import Button from '../components/Button';
import Input  from '../components/Input';

import { userLogin }   from '../store/features/user/userSlice';
import { useState }    from 'react';
import { useEffect }   from 'react';
import { useSelector } from 'react-redux';

const initialState = {
  username: '',
  password: ''
};

const Login = props => {
  const [ fields, setFields ]       = useState( initialState );
  const [ loggingIn, setLoggingIn ] = useState( false );

  const user = useSelector( state => state.user );

  useEffect( () => {
    const login = async() => {
      try {
        await props.store.dispatch(
          userLogin( fields )
        );

        await props.notify({
          message: 'Login Successful',
          ms: 1500
        });

      } catch ( err ) {
        await props.notify({
          message: 'Login Failed: ' + err.message,
          success: false,
          ms: 3000
        });
      }

      setFields( initialState );
      setLoggingIn( false );

      window.location = `user/${ user._id }`;
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
    <div className={styles.formContainer}>
      <form>
        <h1 className={styles.formTitle}>Login</h1>
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
          customClass={styles.loginButton}
        />
      </form>
    </div>
  );
};

export default Login;

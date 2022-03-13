import styles from '../styles/Register.module.css';

import Input  from '../components/Input';
import Button from '../components/Button';

import { useState }    from 'react';
import { useEffect }   from 'react';
import { useSelector } from 'react-redux';

import { userRegister } from '../store/features/user/userSlice';

const initialState = {
  email:    '',
  username: '',
  password: ''
};

const Register = props => {
  const [ fields, setFields ]           = useState( initialState );
  const [ registering, setRegistering ] = useState( false );

  const user = useSelector( state => state.user );

  const handleChange = ( event ) => {
    setFields({ ...fields, [ event.target.name ]: event.target.value });
  };

  useEffect( () => {
    const login = async() => {
      try {
        await props.store.dispatch(
          userRegister( fields )
        );

        await props.notify({
          message: 'Registration Successful',
          ms: 1500
        });

      } catch ( err ) {
        await props.notify({
          message: 'Registration Failed: ' + err.message,
          success: false,
          ms: 3000
        });
      }

      setFields( initialState );
      setRegistering( false );

      window.location = `user/${ user._id }`;
    };

    if ( registering ) {
      login();
    }
  }, [ registering ] );

  const handleSubmit = ( event ) => {
    setRegistering( true );

    setFields( initialState );

    event.preventDefault();
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

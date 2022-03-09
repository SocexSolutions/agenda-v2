import styles from '../styles/Register.module.css';
import Input  from '../components/Input';
import Button from '../components/Button';

import { useState }     from 'react';
import { useEffect }    from 'react';
import { userRegister } from '../store/features/user/userSlice';
import { useSelector }  from 'react-redux';

import client from '../store/client';


const initialState = {
  email:    '',
  username: '',
  password: ''
};

const Register = props => {
  const [ fields, setFields ]               = useState( initialState );
  const [ emailError, setEmailError ]       = useState( false );
  const [ usernameError, setUsernameError ] = useState( false );

  const handleChange = ( event ) => {
    setFields({ ...fields, [ event.target.name ]: event.target.value });
  };

  const handleSubmit = ( event ) => {
    props.store.dispatch(
      userRegister( fields )
    );

    setFields( initialState );

    event.preventDefault();
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
          setEmailError( 'username already in use' );
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
          setUsernameError( 'username already in use' );
        }
      }
    };
    checkUsername();
  }, [ fields.username ] );

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
          customClass={styles.loginButton}
          variant='outlined'
        />
      </form>
    </div>
  );
};

export default Register;

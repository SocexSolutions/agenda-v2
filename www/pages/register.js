import styles from '../styles/Register.module.css';
import Input  from '../components/Input';
import Button from '../components/Button';

import { useState }     from 'react';
import { useEffect }    from 'react';
import { userRegister } from '../store/features/user/userSlice';
import { useSelector }  from 'react-redux';

import client from '../store/client';
import { checkExistingEmail } from '../../api/lib/controllers/user';


const initialState = {
  email:    '',
  username: '',
  password: ''
};

const Register = props => {
  const [ fields, setFields ]               = useState( initialState );
  const [ emailError, setEmailError ]       = useState( false );
  const [ usernameError, setUsernameError ] = useState( false );

  const user_id = useSelector( state => state.user._id );j

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
    checkEmail = async() => {
      try{
        await client.post(
          '/checkexistingemail',
          { user_id }
        )
        } catch {
          setEmailError(true)
        }
    }

    checkEmail();
  }, [ fields.email ] );

  useEffect( () => {
    checkUsername = async() => {
      try {
        await client.post(
          '/checkexistingusername',
          { user_id }
        )
      } catch ( err ) {
        setUsernameError( true );
      }
    }
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
        />
        {emailError && <p>THE EMAIL EXISTS</p>}
        <Input
          name='username'
          type='text'
          id='username'
          placeholder='Username'
          size='medium'
          value={fields.username}
          onChange={handleChange}
        />
        {usernameError && <p>THE Username EXISTS</p>}
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

import styles from '../styles/Register.module.css';
import Button from '../components/Button';
import Input from '../components/Input';
import { userLogin } from '../store/features/user/userSlice';
import { useState } from 'react';

const initialState = {
  username: '',
  password: ''
};

const Login = props => {
  const [ fields, setFields ] = useState( initialState );

  const handleChange = ( event ) => {
    setFields({ ...fields, [ event.target.name ]: event.target.value });
  };

  const handleSubmit = ( event ) => {
    props.store.dispatch(
      userLogin( fields )
    );

    setFields( initialState );

    event.preventDefault();
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
          varient='secondary'
          customClass={styles.loginButton}
        />
      </form>
    </div>
  );
};

export default Login;

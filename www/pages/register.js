import styles from '../styles/Register.module.css';
import Input from '../components/Input';
import Button from '../components/Button';
import { useState } from 'react';
import { userRegister } from '../store/features/user/userSlice';


const initialState = {
  email:    '',
  username: '',
  password: ''
};

const Register = props => {
  const [ fields, setFields ] = useState( initialState );

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

  return (
    <div className={styles.formContainer}>
      <form>
        <h1 className={styles.formTitle}>
            Register
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
          text='Register'
          size='medium'
          stretch='wide'
          varient='secondary'
        />
      </form>
    </div>
  );
};

export default Register;

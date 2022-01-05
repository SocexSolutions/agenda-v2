import { Component } from 'react';
import { userLogin } from '../store/features/user/userSlice';
import styles from '../styles/Register.module.css';
import Button from '../components/Button';
import Input from '../components/Input';

const initialState = {
  username: '',
  password: ''
};

class Login extends Component {
  constructor( props ) {
    super( props );

    this.state = initialState;

    this.handleChange = this.handleChange.bind( this );
    this.handleSubmit = this.handleSubmit.bind( this );
  }

  handleChange( event ) {
    this.setState({
      [ event.target.name ]: event.target.value
    });
  }

  handleSubmit( event ) {
    this.props.store.dispatch(
      userLogin(
        this.state.username,
        this.state.password
      )
    );

    // this.setState( initialState );
    event.preventDefault();
  }

  render() {
    return (
      <div className={styles.formContainer}>
        <form>
          <h1 className={styles.formTitle}>
            Login
          </h1>
          <Input
            name='username'
            type='text'
            id='username'
            placeholder='Username'
            size='medium'
            value={this.state.username}
            onChange={this.handleChange}
          />
          <Input
            name='password'
            type='password'
            id='password'
            placeholder='Password'
            size='medium'
            value= {this.state.password}
            onChange={this.handleChange}
          />
          <Button
            onClick={this.handleSubmit}
            text='Login'
            size='medium'
            stretch='wide'
            varient='secondary'
          />
        </form>
      </div>
    );
  }
}


export default Login;

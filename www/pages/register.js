import { Component } from 'react';
import { userRegister } from '../store/features/user/userSlice';
import store from '../store/store';

const initialState = {
  email:    '',
  username: '',
  password: ''
}

class Register extends Component {
  constructor( props ) {
    super( props );

    this.state = initialState;

    this.handleChange = this.handleChange.bind( this );
    this.handleSubmit = this.handleSubmit.bind( this );
  }

  handleChange(event) {
    this.setState(
      {
        [event.target.name]: event.target.value
      }
    );
  }

  handleSubmit(event) {
    store.dispatch(
      userRegister(
        this.state.email,
        this.state.username,
        this.state.password
      )
    )

    this.setState( initialState );

    event.preventDefault();
  }

  render() {
    return (
      <>
        <h1>Register Page</h1>
        <form>
          <label htmlFor='email'>Email:</label>
          <input 
            name='email'
            type='email' 
            id='email' 
            value={this.state.email}
            onChange={this.handleChange} 
          />
          <label htmlFor='username'>Username:</label>
          <input
            name='username' 
            type='text' 
            id='username'
            value={this.state.username}
            onChange={this.handleChange}
          />
          <label htmlFor='password'>Password:</label>
          <input
            name='password'
            type='password' 
            id='password'
            value= {this.state.password}
            onChange={this.handleChange}
          />
          <input type='submit' value='Submit' onClick={this.handleSubmit}/>
        </form>
      </>
    )
  }
}

export default Register;

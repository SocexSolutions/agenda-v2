import { Component } from "react";
import { userRegister } from "../store/features/user/userSlice";
import styles from "../styles/Register.module.css";
import Input from "../components/Input";
import Button from "../components/Button";

const initialState = {
  email:    "",
  username: "",
  password: ""
};

class Register extends Component {

  constructor( props ) {
    super( props );

    this.state = initialState;

    this.handleChange = this.handleChange.bind( this );
    this.handleSubmit = this.handleSubmit.bind( this );
  }

  handleChange( event ) {
    this.setState(
      {
        [event.target.name]: event.target.value
      }
    );
  }

  handleSubmit( event ) {
    this.props.store.dispatch(
      userRegister(
        this.state.email,
        this.state.username,
        this.state.password
      )
    );

    this.setState( initialState );

    event.preventDefault();
  }

  render() {
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
            value={this.state.email}
            onChange={this.handleChange}
          />
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
            text='Register'
            size='medium'
            stretch='wide'
            varient='secondary'
          />
        </form>
      </div>
    );
  }
}

export default Register;

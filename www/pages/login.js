import { Component } from "react";
import { userRegister } from "../store/features/user/userSlice";
import styles from "../styles/LogReg.module.css";
import store from "../store/store";
import Button from "../components/Button";
import Input from "../components/Input";

const initialState = {
  email: "",
  username: "",
  password: "",
};

class Register extends Component {
  constructor( props ) {
    super( props );

    this.state = initialState;

    this.handleChange = this.handleChange.bind( this );
    this.handleSubmit = this.handleSubmit.bind( this );
  }

  handleChange( event ) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit( event ) {
    store.dispatch(
      userRegister( this.state.email, this.state.username, this.state.password )
    );

    this.setState( initialState );

    event.preventDefault();
  }

  render() {
    return (
      <form className={styles.formContainer}>
        <Input label="username" placeholder="Username" varient="outlined" />
        <Input placeholder="Username" varient="outlined" size="xs" />
        <Input label="username" varient="outlined" size="large" />
        <Input placeholder="SSN" size="large" />
        <Input label="Password" />
        <Button text="submit" onClick={this.handleSubmit} />
      </form>
    );
  }
}

export default Register;

import { useRouter } from "next/router";
import Link from "next/link";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { notify } from "../store/features/snackbar";

import useDebounce from "../hooks/use-debounce";

import { useState } from "react";
import { useEffect } from "react";
import { userRegister } from "../store/features/user";

import client from "../api/client";

import styles from "../styles/pages/register.module.css";

const Register = (props) => {
  const router = useRouter();

  const [registering, setRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  const debouncedEmail = useDebounce(email, 500);
  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    const register = async () => {
      try {
        await props.store.dispatch(
          userRegister({
            email,
            username,
            password,
          })
        );

        await props.store.dispatch(
          notify({
            message: "Registration Successful",
            ms: 1500,
          })
        );

        const user = props.store.getState().user;

        router.replace(`/user/${user._id}/home`);
      } catch (err) {
        await props.store.dispatch(
          notify({
            message: "Registration Failed: " + err.message,
            type: "danger",
            ms: 3000,
          })
        );
      }

      setRegistering(false);
    };

    if (registering) {
      register();
    }
  }, [registering]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setRegistering(true);
  };

  useEffect(() => {
    const checkEmail = async () => {
      if (!email) {
        return;
      }

      try {
        await client.post("user/checkexistingemail", { email });

        if (emailError) {
          setEmailError(false);
        }
      } catch (err) {
        if (err.response.status === 409) {
          setEmailError("email already in use");
        }
      }
    };

    checkEmail();
  }, [debouncedEmail]);

  useEffect(() => {
    const checkUsername = async () => {
      if (!username) {
        return;
      }

      try {
        await client.post("user/checkexistingusername", {
          username: username,
        });

        if (usernameError) {
          setUsernameError(false);
        }
      } catch (err) {
        if (err.response.status === 409) {
          setUsernameError("username already in use");
        }
      }
    };

    checkUsername();
  }, [debouncedUsername]);

  return (
    <div className={styles.form_container}>
      <form>
        <h1 className={styles.form_title}>Sign Up</h1>
        <TextField
          name="email"
          label="email"
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.text_field}
          helperText={emailError}
        />
        <TextField
          name="username"
          label="username"
          variant="standard"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.text_field}
          helperText={usernameError}
        />
        <TextField
          name="password"
          label="password"
          type="password"
          variant="standard"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.text_field}
        />
        <div className={styles.login_button_container}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            className={styles.login_button}
            disableElevation
          >
            Sign Up
          </Button>
        </div>
        <p className={styles.have_an_account}>
          Have an account?
          <Link href={"/login"}>Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

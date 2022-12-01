import { Button } from "@mui/material";
import { TextField } from "@mui/material";

import styles from "../styles/pages/forgot-password.module.scss";

import useDebounce from "../hooks/use-debounce";

import { notify } from "../store/features/snackbar";

import { useDispatch } from "react-redux";

import client from "../api/client";

import { useRouter } from "next/router";

import { useState, useEffect } from "react";
export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [resetLoading, setResetLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordConfirmTouched, setPasswordConfirmTouched] = useState(false);

  const [error, setError] = useState(false);

  const debouncedPassword = useDebounce(password, 500);
  const debouncedPasswordConfirm = useDebounce(passwordConfirm, 500);

  const resetPassword = async () => {
    setResetLoading(true);

    try {
      await client.post("/user/reset-password", {
        userId: router.query.userId,
        resetCode: router.query.code,
        password,
      });

      dispatch(
        notify({
          type: "success",
          message: "Your password has been reset successfully!",
        })
      );

      setResetLoading(false);
    } catch (err) {
      dispatch(
        notify({
          type: "danger",
          message: "Oops, something went wrong.",
        })
      );

      setResetLoading(false);
    }
  };

  useEffect(() => {
    if (passwordTouched && passwordConfirmTouched) {
      if (debouncedPassword !== debouncedPasswordConfirm) {
        setError(true);
      } else {
        setError(false);
      }
    }
  }, [debouncedPassword, debouncedPasswordConfirm]);

  return (
    <div className={styles.form_container}>
      <form>
        <h2>Forgot Password</h2>
        <p>Enter your new password.</p>
        <TextField
          name="password"
          label="Password"
          type="password"
          variant="standard"
          size="small"
          onChange={(e) => {
            setPasswordTouched(true);
            setPassword(e.target.value);
          }}
          value={password}
          className={styles.text_field}
        />
        <TextField
          name="passwordConfirm"
          label="Confirm Password"
          type="password"
          variant="standard"
          size="small"
          onChange={(e) => {
            setPasswordConfirmTouched(true);
            setPasswordConfirm(e.target.value);
          }}
          value={passwordConfirm}
          className={styles.text_field}
          error={error}
          helperText={error ? "Passwords do not match." : ""}
        />
        <Button
          sx={{ marginTop: "1em", marginLeft: "auto", display: "block" }}
          onClick={() => resetPassword()}
          variant="contained"
          disableElevation
          disabled={resetLoading || password !== passwordConfirm}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}

import { Button } from "@mui/material";
import { TextField } from "@mui/material";

import { notify } from "../store/features/snackbar";

import { useDispatch } from "react-redux";

import styles from "../styles/pages/forgot-password.module.scss";

import client from "../api/client";

import { useState } from "react";
export default function ForgotPassword() {
  const dispatch = useDispatch();

  const [resetLoading, setResetLoading] = useState(false);

  const [email, setEmail] = useState("");

  const requestReset = async () => {
    setResetLoading(true);

    try {
      await client.post("/user/reset-request", { email });

      dispatch(
        notify({
          type: "success",
          message: "A password reset link has been sent to your email.",
        })
      );

      setResetLoading(false);
    } catch (err) {
      dispatch(
        notify({
          type: "danger",
          message: err.response.data.message || "Oops, something went wrong.",
        })
      );

      setResetLoading(false);
    }
  };

  return (
    <div className={styles.form_container}>
      <form>
        <h1>Forgot Password</h1>
        <p>Enter your email to request a password reset code.</p>
        <TextField
          name="email"
          label="email"
          size="small"
          variant="standard"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className={styles.text_field}
        />
        <Button
          onClick={() => requestReset()}
          variant="contained"
          disableElevation
          disabled={resetLoading}
          sx={{ marginTop: "1em", marginLeft: "auto", display: "block" }}
        >
          Request Reset
        </Button>
      </form>
    </div>
  );
}

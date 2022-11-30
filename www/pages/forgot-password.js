import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";

import styles from "../styles/pages/forgot-password.module.scss";

import client from "../api/client";

import { useState } from "react";
export default function ForgotPassword() {
  const [resetLoading, setResetLoading] = useState(false);

  const [email, setEmail] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const requestReset = async () => {
    setResetLoading(true);

    try {
      await client.post("/user/reset-request", { email });

      setSnackbarOpen(true);
      setSnackbarSeverity("info");
      setSnackbarMessage("A password reset link has been sent to your email.");

      setResetLoading(false);
    } catch (err) {
      setSnackbarSeverity("error");
      setSnackbarMessage(
        err.response.data.message || "Oops, something went wrong."
      );
      setSnackbarOpen(true);
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

// @ts-nocheck
import React, { useState } from "react";
import { TextField, Button, Typography, Avatar } from "@material-ui/core";
import useStyles from "./LoginFromStyle";
import { Link } from "react-router-dom";
import LockClockIcon from "@mui/icons-material/LockClock";

export default function ForgotPassword() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isDone, setIsDone] = useState(false);

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setIsValidEmail(newEmail !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail));
  };

  const isSignInDisabled = !(email && isValidEmail);

  return (
    <div className={classes.formContainer}>
      <div style={{
        width: "100%",
        maxWidth: "440px",
        background: "rgba(24,27,38,0.85)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "40px",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Top accent line */}
        <div style={{
          position: "absolute",
          top: 0, left: "20%", right: "20%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #00d4d8, transparent)",
        }} />

        <Avatar className={classes.avatar} style={{ background: "linear-gradient(135deg, #00d4d8, #a8ff78)" }}>
          <LockClockIcon style={{ color: "#071014" }} />
        </Avatar>

        <Typography variant="h5" component="h1" className={classes.heading} style={{ marginBottom: "8px" }}>
          Forgot Password?
        </Typography>
        <Typography style={{ fontSize: "0.875rem", color: "rgba(240,242,255,0.5)", marginBottom: "28px", lineHeight: 1.6 }}>
          Enter your email and we'll send you a reset link.
        </Typography>

        {isDone && (
          <div style={{
            background: "rgba(0,212,216,0.1)",
            border: "1px solid rgba(0,212,216,0.25)",
            borderRadius: "12px",
            padding: "14px 16px",
            marginBottom: "20px",
          }}>
            <Typography style={{ fontSize: "0.875rem", color: "#00d4d8", lineHeight: 1.6 }}>
              ✓ Reset link sent! Check your inbox and spam folder.
            </Typography>
          </div>
        )}

        <form className={classes.form}>
          <TextField
            label="Email address"
            variant="outlined"
            fullWidth
            className={`${classes.emailInput} ${classes.textField}`}
            value={email}
            onChange={handleEmailChange}
            error={!isValidEmail}
            helperText={!isValidEmail && "Please enter a valid email address."}
          />
          <Button
            variant="contained"
            className={classes.loginButton}
            fullWidth
            disabled={isSignInDisabled}
            onClick={() => setIsDone(true)}
            style={{ marginTop: "8px" }}
          >
            Send Reset Link
          </Button>
          <Typography variant="body1" align="center" style={{ marginTop: "16px", fontSize: "0.875rem", color: "rgba(240,242,255,0.45)" }}>
            Remember it?{" "}
            <Link to="/" className={classes.createAccount}>Back to login</Link>
          </Typography>
        </form>
      </div>
    </div>
  );
}

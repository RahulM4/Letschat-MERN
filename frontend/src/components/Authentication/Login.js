import React, { useState } from "react";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Grid,
  Avatar,
} from "@material-ui/core";
import useStyles from "./LoginFromStyle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory, Link } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import Loader from "../layouts/Loader";

const heroHighlights = [
  "Real-time conversations with collaborators",
  "End-to-end encryption on every message",
  "Custom channels and smart notifications",
];

const LoginPageContent = ({
  classes,
  email,
  handleEmailChange,
  isValidEmail,
  password,
  handlePasswordChange,
  showPassword,
  handleShowPasswordClick,
  isSignInDisabled,
  submitHandler,
}) => (
  <div className={classes.authWrapper}>
    <div className={classes.heroSection}>
      <span className={classes.heroBadge}>LetsChat Pro</span>
      <Typography variant="h3" className={classes.heroTitle}>
        Collaborate faster, no matter where you are.
      </Typography>
      <Typography className={classes.heroSubtitle}>
        Secure messaging, effortless channels, and notifications that keep you in sync.
      </Typography>
      <ul className={classes.heroList}>
        {heroHighlights.map((highlight) => (
          <li key={highlight} className={classes.heroItem}>
            <span className={classes.heroCircle} />
            {highlight}
          </li>
        ))}
      </ul>
      <Button
        variant="contained"
        className={classes.secondaryButton}
        component={Link}
        to="/signup"
      >
        Create free account
      </Button>
    </div>
    <div className={classes.formSection}>
      <div className={classes.formCard}>
        <div className={classes.formHeader}>
          <Avatar className={classes.avatar}>
            <LockOpenIcon />
          </Avatar>
          <Typography variant="h5" component="h1" className={classes.heading}>
            Sign in to Your Account
          </Typography>
          <Typography className={classes.formDescription}>
            Welcome back! Enter your credentials to continue the conversation.
          </Typography>
        </div>
        <form className={classes.form}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            className={`${classes.emailInput} ${classes.textField}`}
            value={email}
            onChange={handleEmailChange}
            error={!isValidEmail}
            helperText={!isValidEmail && "Please enter a valid email address."}
          />
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            className={`${classes.passwordInput} ${classes.textField}`}
            InputProps={{
              endAdornment: (
                <Button
                  variant="outlined"
                  className={classes.showPasswordButton}
                  onClick={handleShowPasswordClick}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </Button>
              ),
            }}
            value={password}
            onChange={handlePasswordChange}
          />
          <Grid container className={classes.rememberMeContainer}>
            <Grid item>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Remember me"
              />
            </Grid>
            <Grid item>
              <Link
                to="/forgot/password"
                className={classes.forgotPasswordLink}
              >
                Forgot your password?
              </Link>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            className={classes.loginButton}
            fullWidth
            disabled={isSignInDisabled}
            onClick={submitHandler}
          >
            Sign in
          </Button>
          <Typography variant="body1" align="center" style={{ marginTop: "0.5rem" }}>
            Don't have an account?
            <Link to="/signup" className={classes.createAccount}>
              Create Account
            </Link>
          </Typography>
        </form>
      </div>
    </div>
  </div>
);

const Login = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  // const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const { isAuth, setIsAuth, setUser } = ChatState();
  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setIsValidEmail(
      newEmail !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)
    );
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  const isSignInDisabled = !(email && password && isValidEmail);

  const submitHandler = async () => {
    setIsAuth(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // setLoading(false);
      return;
    }

    // console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setTimeout(() => {
        setIsAuth(false);
        history.push("/chats");
      }, 2000);
    } catch (error) {
      setIsAuth(false);
      toast({
        title: "Error Occured!",
        description: error.response.statusText,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // setLoading(false);
    }
  };

  return (
    <>
      {isAuth ? (
        <Loader />
      ) : (
        <div className={classes.formContainer}>
          <LoginPageContent
            classes={classes}
            email={email}
            handleEmailChange={handleEmailChange}
            isValidEmail={isValidEmail}
            password={password}
            handlePasswordChange={handlePasswordChange}
            showPassword={showPassword}
            handleShowPasswordClick={handleShowPasswordClick}
            isSignInDisabled={isSignInDisabled}
            submitHandler={submitHandler}
          />
        </div>
      )}
    </>
  );
};

export default Login;

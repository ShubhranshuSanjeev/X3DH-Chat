import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles, useTheme } from "@material-ui/styles";

import { loginUser } from "../../redux/actions/auth/auth.actions";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    position: "relative",
    minHeight: "100vh",
    backgroundColor: theme.palette.grey[100],

    [theme.breakpoints.down("xs")]: {
      backgroundColor: "#fff",
    },
  },
  logo: {
    fontFamily: "Special Elite",
    fontSize: "2rem",
    color: theme.palette.primary.main,
    textDecoration: "none",
  },
  formWrapper: {
    padding: "4.5em 2.5em 4em 2.5em",

    [theme.breakpoints.down("xs")]: {
      border: "none",
      padding: "3em 0em",
    },
  },
  formTitleWrapper: {
    marginBottom: "1.5em",
  },
  formTitle: {
    color: theme.palette.grey[700],
  },
  formSubTitle: {
    color: theme.palette.grey[700],
    fontSize: "1rem",
  },
  inputLabel: {
    color: theme.palette.grey[500],
    fontSize: "0.9rem",
  },
  formButton: {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  formLink: {
    fontFamily: '"Open Sans", sans-serif',
    color: theme.palette.primary.main,
    fontSize: "0.9rem",
    fontWeight: "700",
    textDecoration: "none",
  },
}));

const LoginForm = ({ loginUser }) => {
  /**
   * State of LoginForm component consists of ->
   *  1. email: for email input field
   *  2. password: for password input field
   *  3. formFieldErrors: for any field validation errors.
   */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formFieldErrors, setFormFieldErrors] = useState({
    emailFieldError: { err: false, msg: "" },
    passwordFieldError: { err: false, msg: "" },
  });

  /**
   * Consuming material-ui hook
   */
  const classes = useStyles();
  const theme = useTheme();
  const matchXS = useMediaQuery(theme.breakpoints.down("xs"));

  /**
   * Function for validating the form inputs.
   * Current validation rules only consists of checking whether the fields have been filled or not
   */
  const validateFields = () => {
    const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    let emailErr = { err: false, msg: "" };
    let passErr = { err: false, msg: "" };
    let errorFlag = false;

    if (!email) {
      errorFlag = true;
      emailErr = { err: true, msg: "Email field is required" };
    } else if (!email.match(emailFormat)) {
      errorFlag = true;
      emailErr = { err: true, msg: "Enter a valid email id" };
    }
    if (!password) {
      errorFlag = true;
      passErr = { err: true, msg: "Password field is required" };
    }

    return [errorFlag, emailErr, passErr];
  };

  /**
   * handles the submit event.
   */
  const onSubmit = (event) => {
    event.preventDefault();

    const [errorFlag, emailErr, passErr] = validateFields();

    if (
      emailErr.err !== formFieldErrors.emailFieldError.err ||
      passErr.err !== formFieldErrors.passwordFieldError.err
    ) {
      setFormFieldErrors({
        emailFieldError: { ...emailErr },
        passwordFieldError: { ...passErr },
      });
    }

    if (!errorFlag) {
      loginUser({ email, password });
    }
  };

  return (
    <Grid
      container
      justify="center"
      alignItems={matchXS ? undefined : "center"}
      className={classes.mainContainer}
    >
      <Grid item xs={11} sm={8} md={5} style={{ maxWidth: "450px" }}>
        <Paper variant="outlined" className={classes.formWrapper}>
          <Grid container direction="column" spacing={4}>
            <Grid item className={classes.formTitleWrapper}>
              <Grid container direction="column" alignItems="center">
                <Grid item style={{ marginBottom: "1em" }}>
                  <Link to="/" className={classes.logo}>
                    X3DH Chat
                  </Link>
                </Grid>
                <Grid item>
                  <Typography
                    variant="h5"
                    align="center"
                    className={classes.formTitle}
                  >
                    Sign in
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="h5"
                    align="center"
                    className={classes.formSubTitle}
                  >
                    Continue to X3D Chat
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <form onSubmit={onSubmit}>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <FormControl
                      variant="outlined"
                      error={formFieldErrors.emailFieldError.err}
                      style={{ width: "100%" }}
                    >
                      <InputLabel
                        htmlFor="email"
                        className={classes.inputLabel}
                      >
                        Email
                      </InputLabel>
                      <OutlinedInput
                        id="email"
                        value={email}
                        name="email"
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        label="Email"
                      />
                      <FormHelperText>
                        {formFieldErrors.emailFieldError.msg}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl
                      variant="outlined"
                      error={formFieldErrors.passwordFieldError.err}
                      style={{ width: "100%" }}
                    >
                      <InputLabel
                        htmlFor="password"
                        className={classes.inputLabel}
                      >
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="password"
                        value={password}
                        name="password"
                        onChange={(event) => setPassword(event.target.value)}
                        type="password"
                        label="Password"
                      />
                      <FormHelperText>
                        {formFieldErrors.passwordFieldError.msg}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <Grid container alignItems="center" justify="space-between">
                      <Grid item>
                        <Link to="/register" className={classes.formLink}>
                          Create account
                        </Link>
                      </Grid>
                      <Grid item>
                        <Button
                          type="submit"
                          variant="contained"
                          className={classes.formButton}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

const mapDispatchToProps = {
  loginUser,
};

export default connect(null, mapDispatchToProps)(LoginForm);

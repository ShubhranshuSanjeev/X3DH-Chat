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

import { registerUser } from "../../redux/actions/auth/auth.actions";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    position: "relative",
    minHeight: "100vh",
    backgroundColor: theme.palette.grey[100],

    [theme.breakpoints.down("sm")]: {
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

    [theme.breakpoints.down("sm")]: {
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

    [theme.breakpoints.down("xs")]: {
      fontSize: "0.7rem",
    },
  },
  formButton: {
    display: "block",
    color: "#fff",
    marginLeft: "auto",
    boxShadow: "none",
    backgroundColor: theme.palette.primary.main,

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

const SignupForm = ({ registerUser }) => {
  /**
   * State of SignupForm component consists of ->
   *  1. email: for email input field
   *  2. password: for password input field
   *  3. formFieldErrors: for any field validation errors.
   */
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    password2: "",
  });
  const [formFieldErrors, setFormFieldErrors] = useState({
    usernameFieldError: { err: false, msg: "" },
    emailFieldError: { err: false, msg: "" },
    firstNameFieldError: { err: false, msg: "" },
    lastNameFieldError: { err: false, msg: "" },
    passwordFieldError: { err: false, msg: "" },
  });

  /**
   * Consuming material-ui hooks
   */
  const classes = useStyles();
  const theme = useTheme();
  const matchSM = useMediaQuery(theme.breakpoints.down("sm"));

  /**
   * Function for validating the form inputs.
   * Current validation rules only consists of checking whether the fields have been filled or not
   */
  const validateFields = () => {
    const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    let fieldErrors = {
      usernameFieldError: { err: false, msg: "" },
      emailFieldError: { err: false, msg: "" },
      firstNameFieldError: { err: false, msg: "" },
      lastNameFieldError: { err: false, msg: "" },
      passwordFieldError: { err: false, msg: "" },
    };
    let errorFlag = false;

    const {
      username,
      email,
      firstName,
      lastName,
      password,
      password2,  
    } = formValues;

    if (!username) {
      errorFlag = true;
      fieldErrors.usernameFieldError = {
        err: true,
        msg: "Username field is required!",
      };
    } else if (username.length < 4) {
      errorFlag = true;
      fieldErrors.usernameFieldError = {
        err: true,
        msg: "Username should altleast contain 4 characters",
      };
    }
    if (!email) {
      errorFlag = true;
      fieldErrors.emailFieldError = {
        err: true,
        msg: "Email field is required!",
      };
    } else if (!email.match(emailFormat)) {
      errorFlag = true;
      fieldErrors.emailFieldError = {
        err: true,
        msg: "Enter a valid email id",
      };
    }
    if (!firstName) {
      errorFlag = true;
      fieldErrors.firstNameFieldError = {
        err: true,
        msg: "First name field is required!",
      };
    }
    if (!lastName) {
      errorFlag = true;
      fieldErrors.lastNameFieldError = {
        err: true,
        msg: "Last Name field is required!",
      };
    }
    if (!password) {
      errorFlag = true;
      fieldErrors.passwordFieldError = {
        err: true,
        msg: "Password field is required!",
      };
    }
    if (password !== password2) {
      errorFlag = true;
      fieldErrors.passwordFieldError = {
        err: true,
        msg: "Passwords don't match",
      };
    }

    setFormFieldErrors({ ...fieldErrors });
    return errorFlag;
  };

  const onChange = (event) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  /**
   * handles the submit event.
   */
  const onSubmit = (event) => {
    event.preventDefault();
    const errorFlag = validateFields();

    if (!errorFlag) {
      registerUser(formValues);
    }
  };

  return (
    <Grid
      container
      justify="center"
      alignItems={matchSM ? "flex-start" : "center"}
      className={classes.mainContainer}
    >
      <Grid item xs={11} sm={8} md={7} style={{ maxWidth: "600px" }}>
        <Paper variant="outlined" className={classes.formWrapper}>
          <Grid container direction="column" spacing={4}>
            <Grid item xs className={classes.formTitleWrapper}>
              <Grid container direction="column" alignItems="center">
                <Grid item style={{ marginBottom: "1em" }}>
                  <Link to="/" className={classes.logo}>
                    X3D Chat
                  </Link>
                </Grid>
                <Grid item>
                  <Typography
                    variant="h5"
                    align="center"
                    className={classes.formTitle}
                  >
                    Create your X3D Chat account
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="h5"
                    align="center"
                    className={classes.formSubTitle}
                  >
                    Connect with your friends and family.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <form onSubmit={onSubmit} noValidate>
                <Grid container direction="column" spacing={4}>
                  <Grid xs item>
                    <Grid container spacing={2}>
                      <Grid xs item>
                        <FormControl
                          required
                          variant="outlined"
                          size="small"
                          error={formFieldErrors.firstNameFieldError.err}
                          style={{ width: "100%" }}
                        >
                          <InputLabel
                            htmlFor="email"
                            className={classes.inputLabel}
                          >
                            First Name
                          </InputLabel>
                          <OutlinedInput
                            value={formValues.firstName}
                            name="firstName"
                            onChange={onChange}
                            type="text"
                            label="First Name"
                          />
                          <FormHelperText>
                            {formFieldErrors.firstNameFieldError.msg}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid xs item>
                        <FormControl
                          required
                          variant="outlined"
                          size="small"
                          error={formFieldErrors.lastNameFieldError.err}
                          style={{ width: "100%" }}
                        >
                          <InputLabel
                            htmlFor="email"
                            className={classes.inputLabel}
                          >
                            Last Name
                          </InputLabel>
                          <OutlinedInput
                            value={formValues.lastName}
                            name="lastName"
                            onChange={onChange}
                            type="text"
                            label="Last Name"
                          />
                          <FormHelperText>
                            {formFieldErrors.lastNameFieldError.msg}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid xs item>
                    <FormControl
                      required
                      variant="outlined"
                      size="small"
                      error={formFieldErrors.usernameFieldError.err}
                      style={{ width: "100%" }}
                    >
                      <InputLabel
                        htmlFor="username"
                        className={classes.inputLabel}
                      >
                        Username
                      </InputLabel>
                      <OutlinedInput
                        value={formValues.username}
                        name="username"
                        onChange={onChange}
                        type="text"
                        label="Username"
                      />
                      <FormHelperText>
                        {formFieldErrors.usernameFieldError.msg}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid xs item>
                    <FormControl
                      required
                      variant="outlined"
                      size="small"
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
                        value={formValues.email}
                        name="email"
                        onChange={onChange}
                        type="email"
                        label="Email"
                      />
                      <FormHelperText>
                        {formFieldErrors.emailFieldError.msg}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid xs item>
                    <Grid container spacing={2}>
                      <Grid xs item>
                        <FormControl
                          required
                          variant="outlined"
                          size="small"
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
                            value={formValues.password}
                            name="password"
                            onChange={onChange}
                            type="password"
                            label="Password"
                          />
                          <FormHelperText>
                            {formFieldErrors.passwordFieldError.msg}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid xs item>
                        <FormControl
                          required
                          variant="outlined"
                          size="small"
                          style={{ width: "100%" }}
                        >
                          <InputLabel
                            htmlFor="password2"
                            className={classes.inputLabel}
                          >
                            Confirm
                          </InputLabel>
                          <OutlinedInput
                            value={formValues.password2}
                            name="password2"
                            onChange={onChange}
                            type="password"
                            label="Confirm"
                          />
                          <FormHelperText>
                            Retype your password here
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid xs item>
                    <Grid container alignItems="center" justify="space-between">
                      <Grid xs item>
                        <Link to="/login" className={classes.formLink}>
                          Alredy have an account
                        </Link>
                      </Grid>
                      <Grid xs item>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
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

const mapDispatchToProps = { registerUser };

export default connect(null, mapDispatchToProps)(SignupForm);

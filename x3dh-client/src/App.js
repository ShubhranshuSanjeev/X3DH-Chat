import React, { useEffect } from "react";
import { Router, Switch } from "react-router-dom";
import { connect } from "react-redux";

import { loadUser } from "./redux/actions/auth/auth.actions";

import { ThemeProvider } from '@material-ui/styles';
import theme from "./theme/theme";

import history from './history';
import CustomRoute from "./components/custom-route/custom-route";
import SignupForm from "./components/signup-form/signup-form";
import LoginForm from "./components/login-form/login-form";
import Snackbar from "./components/snackbar/snackbar";
import Chat from "./components/chat/chat";

const App = ({ loadUser }) => {
  useEffect(() => {
    loadUser();
  },[loadUser]);

  return (
    <ThemeProvider theme={theme}>
      <Snackbar />
      <Router history={history}>
        <Switch>
          <CustomRoute path="/register" exact component={SignupForm} guestRoute />
          <CustomRoute path="/login" exact component={LoginForm} guestRoute />
          <CustomRoute path="/" exact component={Chat} privateRoute />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

const mapDispatchToProps = {
  loadUser,
};

export default connect(null, mapDispatchToProps)(App);

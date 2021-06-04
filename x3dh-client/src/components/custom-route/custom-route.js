import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const CustomRoute = ({
  component: Component,
  auth,
  guestRoute,
  privateRoute,
  teacherRoute,
  ...otherProps
}) => {
  const route = (
    <Route {...otherProps} render={(props) => <Component {...props} />} />
  );

  if (auth.isAuthenticated) {
    /**
     * If the user is aready authenticated and he trying to visit any of the guest routes like
     * "home page", "login page", "signup page" he/she will be redirected to the dashboard
     */
    if (guestRoute) {
      return <Redirect to="/" />;
    }

    return route;
  }

  /**
   * If the user tries to access any private route which require the user to be
   * logged-in but he/she is still not authenticated redirect to "login page"
   */
  if (privateRoute) {
    return <Redirect to="/login" />;
  }
  return route;
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

export default connect(mapStateToProps)(CustomRoute);

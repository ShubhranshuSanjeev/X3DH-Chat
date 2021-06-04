import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGN_OUT,
  REGISTER_USER_START,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  USER_LOADING,
  USER_LOADED,
} from "./auth.types";
import axios from "../../../axios";

import { enqueueSnackbar } from "../snackbar/snackbar.actions";


export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  const token = getState().auth.token;
  const config = {
    headers: { "Content-Type": "application/json" },
  };

  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  axios
    .get("/auth", config)
    .then(res => {
      console.log(res);
      dispatch({ type: USER_LOADED, payload: res.data });
    })
    .catch(err => {
      console.log(err.response);
      dispatch({ type: LOGIN_FAILURE });
    });
};

export const registerUser = formValues => dispatch => {
  dispatch({ type: REGISTER_USER_START });

  const config = {
    headers: { "Content-Type": "application/json" },
  };
  const {
    username,
    email,
    password,
    password2,
    firstName,
    lastName,
  } = formValues;

  const body = JSON.stringify({
    username,
    email,
    password,
    password2,
    firstName,
    lastName,
  });
  axios
    .post("/auth/signup", body, config)
    .then(res => {
      console.log(res);
      dispatch(
        enqueueSnackbar({
          message: "Your account has been successfully created.",
          variant: "success",
        })
      );
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: res.data,
      });
    })
    .catch(err => {
      console.log(err.response);
      const { data = {} } = err.response;
      Object.keys(data).forEach(key => {
        dispatch(
          enqueueSnackbar({
            message: data[key],
            variant: "error"
        }));
      });
      dispatch({ type: REGISTER_USER_FAILURE });
    });
};

export const loginUser = formValues => dispatch => {
  dispatch({ type: LOGIN_START });

  const config = {
    headers: { "Content-Type": "application/json" },
  };
  const {email, password} = formValues;
  const body = JSON.stringify({ email, password });

  axios
    .post("/auth/login", body, config)
    .then(res => {
      console.log(res);
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    })
    .catch(err => {
      console.log(err.response);
      const { data = {} } = err.response;
      Object.keys(data).forEach(key => {
        dispatch(
          enqueueSnackbar({
            message: data[key],
            variant: "error"
        }));
      });
      dispatch({ type: LOGIN_FAILURE });
    });
};

export const logoutUser = () => (dispatch, getState) => {
  const { token } = getState().auth;
  const config = {
    headers: { "Content-Type": "application/json" },
  };

  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  axios.post('/auth/logout', {}, config)
    .then(res => {
      console.log(res);
      dispatch({ type: SIGN_OUT });
    })
    .catch(err => {
      console.log(err.response);
    })
}

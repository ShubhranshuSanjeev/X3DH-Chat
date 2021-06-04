import {
  ENQUEUE_SNACKBAR,
  CLOSE_SNACKBAR,
  REMOVE_SNACKBAR,
} from "./snackbar.types";

export const enqueueSnackbar = ({ message, variant }) => {
  const notification = {
    message,
    options: {
      key: new Date().getTime() + Math.random(),
      variant,
    },
  }
  const key = notification.options.key;
  console.log(notification);
  return {
    type: ENQUEUE_SNACKBAR,
    payload: {
      notification,
      key: key || new Date().getTime() + Math.random(),
    },
  };
};

export const closeSnackbar = (key) => {
  return {
    type: CLOSE_SNACKBAR,
    payload: {
      dismissAll: !key, // dismiss all if no key has been defined
      key,
    },
  };
};

export const removeSnackbar = (key) => {
  return {
    type: REMOVE_SNACKBAR,
    payload: {
      key,
    },
  };
};

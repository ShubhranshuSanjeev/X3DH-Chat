import React from "react";
import { useSnackbar } from "notistack";

import { connect } from "react-redux";
import {
  removeSnackbar as removeSnackbarAction,
  closeSnackbar as closeSnackbarAction,
} from "../../redux/actions/snackbar/snackbar.actions";

import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  button: {
    color: "#fff"
  }
}));

let displayed = [];

const Snackbar = ({
  notifications,
  removeSnackbarAction,
  closeSnackbarAction,
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();

  const storeDisplayed = (id) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  React.useEffect(() => {
    notifications.forEach(
      ({ key, message, options = {}, dismissed = false }) => {
        if (dismissed) {
          closeSnackbar(key);
          return;
        }

        if (displayed.includes(key)) return;

        enqueueSnackbar(message, {
          key,
          ...options,
          action: (myKey) => (
            <Button className={classes.button} onClick={() => closeSnackbarAction(myKey)}>
              dismiss
            </Button>
          ),
          onClose: (event, reason, myKey) => {
            if (options.onClose) {
              options.onClose(event, reason, myKey);
            }
          },
          onExited: (event, myKey) => {
            removeSnackbarAction(myKey);
            removeDisplayed(myKey);
          },
        });

        storeDisplayed(key);
      }
    );
  }, [
    notifications,
    closeSnackbar,
    enqueueSnackbar,
    removeSnackbarAction,
    closeSnackbarAction,
    classes.button
  ]);

  return null;
};

const mapStateToProps = (state) => ({
  notifications: state.snackbar.notifications,
});

const mapDispatchToProps = (dispatch) => ({
  removeSnackbarAction: (key) => dispatch(removeSnackbarAction(key)),
  closeSnackbarAction: (key) => dispatch(closeSnackbarAction(key)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);
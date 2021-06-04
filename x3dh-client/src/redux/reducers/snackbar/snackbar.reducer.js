import {
  ENQUEUE_SNACKBAR,
  CLOSE_SNACKBAR,
  REMOVE_SNACKBAR,
} from "../../actions/snackbar/snackbar.types";

const defaultState = {
  notifications: [],
};

export default (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ENQUEUE_SNACKBAR:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            key: payload.key,
            ...payload.notification,
          },
        ],
      };

    case CLOSE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          payload.dismissAll || notification.key === payload.key
            ? { ...notification, dismissed: true }
            : { ...notification }
        ),
      };

    case REMOVE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.key !== payload.key
        ),
      };

    default:
      return state;
  }
};

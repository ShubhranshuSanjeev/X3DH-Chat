import {
  X3DH_CONSTANTS_LOADING,
  X3DH_CONSTANTS_LOAD_SUCCESS,
  PUBLISH_KEY_BUNDLE,
  PUBLISH_IDENTITY_KEY,
  SAVE_INITIAL_MESSAGE,
  SAVE_SHARED_KEY,
  INITIAL_MESSAGE_SUCCESSFULL
} from "../../actions/x3dh/x3dh.types";

const INITIAL_STATE = {
  x3dhLoading: false,
  x3dhLoaded: false,
  identityKey: null,
  prekeyBundle: null,
  sharedKeys: null,
  initialMessages: null,
  publishIdentityKeyFlag: false,
  publishPreKeyBundleFlag: false,
};

const saveToLocalStorage = (state, username) => {
  const string = JSON.stringify(state);
  localStorage.setItem(username, string);
};

const x3dhReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  let newState = {};
  switch (type) {
    case X3DH_CONSTANTS_LOADING:
      return { ...state, x3dhLoading: true, x3dhLoaded: false}
    case X3DH_CONSTANTS_LOAD_SUCCESS:
      newState = { ...state, ...payload.data, x3dhLoading: false, x3dhLoaded: true};
      saveToLocalStorage(newState, payload.username);
      return newState;
    case PUBLISH_KEY_BUNDLE:
      newState = { ...state, publishPreKeyBundleFlag: false };
      saveToLocalStorage(newState, payload.username);
      return newState;
    case PUBLISH_IDENTITY_KEY:
      newState = { ...state, publishIdentityKeyFlag: false };
      saveToLocalStorage(newState, payload.username);
      return newState;
    case SAVE_INITIAL_MESSAGE:
      const initialMessages = {
        ...state.initialMessages,
      };
      payload.dispatchDataList.forEach(data => {
        initialMessages[data.otherUserId]= data.initialMessage;
      });
      newState = { ...state, initialMessages };
      saveToLocalStorage(newState, payload.username);
      return newState;
    case INITIAL_MESSAGE_SUCCESSFULL:
      // delete the initial message
      // extract shared key from initial message
      // save the shared key
      const { sharedKey } = state.initialMessages[payload.otherUser];
      return { ...state, sharedKeys: { ...state.sharedKeys, [payload.otherUser]: sharedKey } };
    case SAVE_SHARED_KEY:
      const sharedKeys = {
        ...state.sharedKeys,
      };
      payload.dispatchDataList.forEach(data => {
        sharedKeys[data.otherUserId]= { sharedKey: data.sharedKey, usable: data.usable };
      });
      newState = { ...state, sharedKeys };
      saveToLocalStorage(newState, payload.username)
      return newState;
    default:
      return state;
  }
};

export default x3dhReducer;

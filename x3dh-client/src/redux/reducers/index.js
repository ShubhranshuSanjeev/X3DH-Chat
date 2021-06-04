import { combineReducers } from "redux";
import auth from "./auth/auth.reducer";
import snackbar from "./snackbar/snackbar.reducer";
import contact from "./contacts/contacts.reducer";
import x3dh from "./x3dh/x3dh.reducer";

export default combineReducers({
  auth,
  contact,
  snackbar,
  x3dh
});

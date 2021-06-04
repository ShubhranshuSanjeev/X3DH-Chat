import axios from "../../../axios";
import { FETCH_CONTACTS_SUCCESS, FETCH_CONTACT_CHAT } from "./contacts.types";

export const fetchContacts = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  const config = {
    headers: { "Content-Type": "application/json" },
  };

  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  try{
    const response = await axios.get('/contact', config);
    dispatch({ type: FETCH_CONTACTS_SUCCESS, payload: response.data });
  } catch(error) {
    console.log(error);
  }
}

export const fetchChat = (contactId) => async (dispatch, getState) => {
  const token = getState().auth.token;
  const config = {
    headers: { "Content-Type": "application/json" },
  };

  if(token){
    config.headers["Authorization"] = `Token ${token}`;
  }

  try{
    const response = await axios.get(`/contact/chat/${contactId}`, config);
    dispatch({ type: FETCH_CONTACT_CHAT, payload: response.data });
  } catch (error) {
    console.log(error);
  }
};
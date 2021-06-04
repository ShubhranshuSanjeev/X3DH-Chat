import { FETCH_CONTACTS_SUCCESS, FETCH_CONTACT_CHAT } from "../../actions/contacts/contacts.types";

const INITIAL_STATE = {};

const contactReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_CONTACTS_SUCCESS:
      const contacts = new Map();
      payload.contacts.map(
        (contact) =>
          (contacts[contact._id] = {
            user: { _id: contact._id, ...contact.user },
            chat: [],
          })
      );
      return { ...contacts };
    case FETCH_CONTACT_CHAT:
      const { _id, chat } = payload;
      return { ...state, [_id]: { user: { ...state[_id].user }, chat: [ ...chat ] } };
    default:
      return state;
  }
};

export default contactReducer;

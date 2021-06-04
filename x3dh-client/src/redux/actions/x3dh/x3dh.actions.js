import {
  INITIAL_MESSAGE_SUCCESSFULL,
  X3DH_CONSTANTS_LOAD_SUCCESS,
  PUBLISH_IDENTITY_KEY,
  PUBLISH_KEY_BUNDLE,
  SAVE_INITIAL_MESSAGE,
  SAVE_SHARED_KEY,
  X3DH_CONSTANTS_LOADING
} from "./x3dh.types";

import { LOGIN_FAILURE } from "../auth/auth.types";
import { generateKey, exportJWK } from "../../../x3dh/elliptic-curve";
import { diffieHellman } from "../../../x3dh/diffie-hellman";
import { decrypt, encrypt } from "../../../x3dh/aes";
import { hkdf } from "../../../x3dh/hkdf";
import { v4 as uuidv4 } from 'uuid';
import axios from "../../../axios";

export const initialX3DHLoad = () => async (dispatch, getState) => {
  dispatch({type: X3DH_CONSTANTS_LOADING});
  const auth = getState().auth;
  const initialData = {
    identityKey: null,
    prekeyBundle: null,
    sharedKeys: null,
    publishIdentityKeyFlag: false,
    publishPreKeyBundleFlag: false,
    initialMessages: null
  };

  const userData = JSON.parse(localStorage.getItem(auth.user.username)) || initialData;
  // const userData = initialData;
  let {
    identityKey,
    prekeyBundle,
    sharedKeys,
    initialMessages,
    publishIdentityKeyFlag,
    publishPreKeyBundleFlag
  } = userData;
  console.log(userData);
  if(!identityKey){
    const idKeyPair = await generateKey();
    const privateIdKeyJWK = await exportJWK(idKeyPair.privateKey);
    const publicIdKeyJWK = await exportJWK(idKeyPair.publicKey);
    identityKey = { privateIdKeyJWK, publicIdKeyJWK };
    publishIdentityKeyFlag = true;
  }
  if(!prekeyBundle){
    const bundle = {};
    for(let i = 0; i < 10; i++){
      const keyPair = await generateKey();
      const privateKeyJWK = await exportJWK(keyPair.privateKey);
      const publicKeyJWK = await exportJWK(keyPair.publicKey);

      const preKeyIdentifier = uuidv4().replaceAll('-', '');
      bundle[preKeyIdentifier] = { privateKeyJWK, publicKeyJWK };
    }
    prekeyBundle = { ...bundle };
    publishPreKeyBundleFlag = true;
  }
  if(sharedKeys === null) sharedKeys = {};

  const { token, user: { username } } = auth;
  const config = {
    headers: { "Content-Type": "application/json" },
  };

  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  try{
    const res = await axios.get("/chat/initialMessages", config);
    console.log(res);
    const messagesToBeProcessed = res.data.initialMessages;
    for(const key in messagesToBeProcessed){
      const {
        encryptedData,
        ephimeralKey,
        identityKey: publicIdKey,
        preKeyIdentifier
      } = messagesToBeProcessed[key];
      console.log(prekeyBundle);
      const privatePrekey = prekeyBundle[preKeyIdentifier].privateKeyJWK;
      const privateIdenityKey = identityKey.privateIdKeyJWK;
      const otherUserId = key;

      const bdh1 = await diffieHellman(privatePrekey, publicIdKey);
      const bdh2 = await diffieHellman(privateIdenityKey, ephimeralKey);
      const bdh3 = await diffieHellman(privatePrekey, ephimeralKey);

      const sharedKey = await hkdf(bdh1, bdh2, bdh3);
      const message = await decrypt(encryptedData, sharedKey);

      sharedKeys[otherUserId] = { sharedKey, usable: true };

      const res2 = await axios.delete(`/chat/initialMessage/${otherUserId}`, config);
      const res3 = await axios.patch(`/chat/x3dhProtocolStatus/${otherUserId}`, {}, config);
    }
  } catch (err){
    if(err.response && err.response.status === 401){
      dispatch({ type: LOGIN_FAILURE });
    }
  }

  for(const k in sharedKeys){
    if(sharedKeys[k].usable === "false"){
      try{
        console.log(k, sharedKeys[k]);
        const res4 = await axios.get(`/chat/x3dhProtocolStatus/${k}`, config);
        sharedKeys[k].usable = res4.data.protocolStatus.recieverSuccess ? "true": "false";
      } catch (err) {
        if(err.response.status === 401){
          dispatch({ type: LOGIN_FAILURE });
        }
      }
    }
  }

  const data = {
    identityKey,
    prekeyBundle,
    sharedKeys,
    initialMessages,
    publishIdentityKeyFlag,
    publishPreKeyBundleFlag,
  }

  dispatch({ type: X3DH_CONSTANTS_LOAD_SUCCESS, payload: { data, username: auth.user.username } });
}

export const publishIdentityKey = () => async (dispatch, getState) => {
  const { token, user: { username } } = getState().auth;
  const config = {
    headers: { "Content-Type": "application/json" },
  };

  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  const { identityKey: { publicIdKeyJWK } } = getState().x3dh;
  const body = JSON.stringify({ idenityKey: { publicIdKeyJWK } });
  // axios post req to publish identity key
  try {
    const res = await axios.post("/chat/identityKey", body, config);
    dispatch({ type: PUBLISH_IDENTITY_KEY, payload: { username } });
  } catch(err) {
    console.log(err);
  }
}

export const publishPreKeyBundle = () => async (dispatch, getState) => {
  const { token, user: { username } } = getState().auth;
  const config = {
    headers: { "Content-Type": "application/json" },
  };

  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  const { prekeyBundle } = getState().x3dh;
  const bundle = {};
  for(const key in prekeyBundle) {
    bundle[key] = { "publicKeyJWK" : prekeyBundle[key].publicKeyJWK };
  }
  const body = JSON.stringify({ "prekeyBundle": bundle });

  // axios post req to publish identity key
  try {
    const res = await axios.post("/chat/prekeybundle", body, config);
    dispatch({ type: PUBLISH_KEY_BUNDLE, payload: { username } });
  } catch(err) {
    console.log(err);
  }
}

export const generateIntialMessage = (otherUserList) => async (dispatch, getState) => {
  // Fetch otherUser key bundle from the server.
  // Do the verification of the prekeys
  // perform x3dh
  // send the intial message to the server
  // save the initial message on the client
  const {
    auth : { token, user: { username } },
    x3dh: {
      identityKey: { privateIdKeyJWK, publicIdKeyJWK }
    }
  } = getState();

  const config = {
    headers: { "Content-Type": "application/json" },
  };

  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  const dispatchDataList = [];
  console.log(otherUserList);
  const asyncForLoop = async () => {
    for(let i = 0; i < otherUserList.length; ++i) {
      const otherUser = otherUserList[i];
      try{
        const res = await axios.get(`/chat/keybundle/${otherUser._id}`, config);
        const {
          data: {
            _id: otherUserId,
            identityKey: identityKeyString,
            prekey: preKeyString
          }
        } = res;

        const identityKey = JSON.parse(identityKeyString);
        const preKeyIdentifier = preKeyString._id;
        const prekey = JSON.parse(preKeyString.key);

        const ephimeralKeyPair = await generateKey();
        const privateEphimeralKey = await exportJWK(ephimeralKeyPair.privateKey);
        const publicEphimeralKey = await exportJWK(ephimeralKeyPair.publicKey);

        const adh1 = await diffieHellman(privateIdKeyJWK, prekey);
        const adh2 = await diffieHellman(privateEphimeralKey, identityKey);
        const adh3 = await diffieHellman(privateEphimeralKey, prekey);

        const sharedKey = await hkdf(adh1, adh2, adh3);
        console.log(sharedKey);

        const initialText = "Initial Message";
        const message = await encrypt(initialText, uuidv4(), sharedKey);
        const body = JSON.stringify({
          encryptedData: message,
          preKeyIdentifier: preKeyIdentifier,
          ephimeralKey: publicEphimeralKey,
          identityKey: publicIdKeyJWK,
          sentFor: otherUserId
        });

        const res2 = await axios.post('/chat/initialMessage', body, config);
        dispatchDataList.push({ otherUserId, sharedKey, usable: "false" });
      } catch(err) {
        console.log(err);
      }
    }
  }

  await asyncForLoop();
  console.log(dispatchDataList);
  dispatch({type: SAVE_SHARED_KEY, payload: { dispatchDataList, username } });
}
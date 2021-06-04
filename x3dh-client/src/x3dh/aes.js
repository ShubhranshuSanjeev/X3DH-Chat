import { importAESKeys } from "./elliptic-curve";

export const encrypt = async (message, iv, key) => {
  key = await importAESKeys(key);
  const encodedText = new TextEncoder().encode(message);
  const initializationVector = new TextEncoder().encode(iv);
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: initializationVector },
    key,
    encodedText
  );
  const uintArray = new Uint8Array(encryptedData);
  const string = String.fromCharCode.apply(null, uintArray);
  const base64Data = btoa(string);
  const messageObject = { data: base64Data, initializationVector };
  return messageObject;
};

export const decrypt = async (messageObject, key) => {
  try{
    key = await importAESKeys(key);

    const text = messageObject.data;
    const initializationVector = new Uint8Array(messageObject.initializationVector);

    const string = atob(text);
    const uintArray = new Uint8Array(
      [...string].map((char) => char.charCodeAt(0))
    );
    const algorithm = {
      name: "AES-GCM",
      iv: initializationVector,
    };
    const decryptedData = await crypto.subtle.decrypt(
      algorithm,
      key,
      uintArray
    );
    return new TextDecoder().decode(decryptedData);
  }
  catch(e) {
    const error = new Error("Decryption Failed");
    throw error;
  }
};
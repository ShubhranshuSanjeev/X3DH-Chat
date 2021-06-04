import { exportJWK } from "./elliptic-curve";
const salt = new TextEncoder().encode(process.env.REACT_APP_HKDF_SALT);

console.log(process.env.REACT_APP_HKDF_SALT);

const concatArrayBuffers = (buffers) => {
  let offset = 0;
  let bytes = 0;
  let bufs2 = buffers.map((buf, total) => {
    bytes += buf.byteLength;
    return buf;
  });
  let buffer = new ArrayBuffer(bytes);
  let store = new Uint8Array(buffer);
  bufs2.forEach((buf) => {
    store.set(new Uint8Array(buf.buffer||buf,buf.byteOffset),offset);
    offset += buf.byteLength;
  });
  return buffer
}

export const hkdf = async (key1, key2, key3) => {
  const keyMaterial = concatArrayBuffers([key1, key2, key3]);
  const cryptoKeyMaterial = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    "HKDF",
    false,
    ["deriveKey", "deriveBits"]
  );
  const sharedKey =  await crypto.subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: salt, info: new Uint8Array(0)},
    cryptoKeyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    [ "encrypt", "decrypt" ]
  );
  return exportJWK(sharedKey);
};
const __ECDH__PARAMS__ = {
  name: "ECDH",
  namedCurve: "P-256"
}

export const generateKey = () => crypto.subtle.generateKey(
  __ECDH__PARAMS__,
  true,
  ["deriveBits", "deriveKey"]
);

export const exportJWK = (key) => crypto.subtle.exportKey(
  "jwk",
  key
);

export const importPublicKey = (publicKeyJwk) => crypto.subtle.importKey(
  "jwk",
  publicKeyJwk,
  __ECDH__PARAMS__,
  true,
  []
);

export const importPrivateKey = (privateKeyJwk) => crypto.subtle.importKey(
  "jwk",
  privateKeyJwk,
  __ECDH__PARAMS__,
  true,
  ["deriveKey", "deriveBits"]
);

export const importKeyFromJWK = (keyJWK) => crypto.subtle.importKey(
  "jwk",
  keyJWK,
  __ECDH__PARAMS__,
  true,
  ["deriveKey", "deriveBits"]
);

export const importAESKeys = (keyJWK) => crypto.subtle.importKey(
  "jwk",
  keyJWK,
  "AES-GCM",
  true,
  ["encrypt", "decrypt"]
);
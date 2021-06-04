import { importPublicKey, importKeyFromJWK } from "./elliptic-curve";

export const diffieHellman = async (privateKeyJWK, publicKeyJWK) => {
  const publicKey = await importPublicKey(publicKeyJWK);
  const privateKey = await importKeyFromJWK(privateKeyJWK);

  return crypto.subtle.deriveBits(
    { name: "ECDH", namedCurve: "P-256", public: publicKey },
    privateKey,
    256
  );
}
import { ml_kem768 } from '@noble/post-quantum/ml-kem';
import type { PqcKeyPair } from './types.js';

export interface KemEncapsulateResult {
  ciphertext: Uint8Array;
  sharedSecret: Uint8Array;
}

export function kemGenerateKeyPair(): PqcKeyPair {
  // ml_kem768.keygen accepts an optional seed; called without seed uses internal randomness
  return ml_kem768.keygen();
}

export function encapsulate(publicKey: Uint8Array): KemEncapsulateResult {
  // The library returns { cipherText, sharedSecret } — note capital T in cipherText
  const result = ml_kem768.encapsulate(publicKey);
  return {
    ciphertext: result.cipherText,
    sharedSecret: result.sharedSecret,
  };
}

export function decapsulate(secretKey: Uint8Array, ciphertext: Uint8Array): Uint8Array {
  // Library signature: decapsulate(cipherText, secretKey)
  return ml_kem768.decapsulate(ciphertext, secretKey);
}

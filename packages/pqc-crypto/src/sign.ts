import { ml_dsa65 } from '@noble/post-quantum/ml-dsa';
import { randomBytes } from '@noble/hashes/utils';
import type { PqcKeyPair } from './types.js';

// ml_dsa65.keygen requires a 32-byte seed
const SEED_BYTES = 32;

export function generateKeyPair(): PqcKeyPair {
  const seed = randomBytes(SEED_BYTES);
  return ml_dsa65.keygen(seed);
}

export function sign(message: Uint8Array, secretKey: Uint8Array): Uint8Array {
  return ml_dsa65.sign(secretKey, message);
}

export function verify(
  message: Uint8Array,
  signature: Uint8Array,
  publicKey: Uint8Array
): boolean {
  return ml_dsa65.verify(publicKey, message, signature);
}

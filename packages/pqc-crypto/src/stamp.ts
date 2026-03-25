import { bytesToHex } from '@noble/hashes/utils';
import { hashPayload } from './hash.js';
import { sign } from './sign.js';
import type { PqcStamp, StampableEntity } from './types.js';

export function createStamp(
  entity: StampableEntity,
  secretKey: Uint8Array,
  publicKey: Uint8Array
): PqcStamp {
  const hash = hashPayload(entity.payload);

  // Sign the hash string encoded as UTF-8 bytes
  const hashBytes = new TextEncoder().encode(hash);
  const signatureBytes = sign(hashBytes, secretKey);

  return {
    hash,
    signature: bytesToHex(signatureBytes),
    publicKey: bytesToHex(publicKey),
    algorithm: 'ML-DSA-65',
    timestamp: Date.now(),
  };
}

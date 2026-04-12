import { sha256 } from '@noble/hashes/sha2';
import { shake256 } from '@noble/hashes/sha3';
import { bytesToHex } from '@noble/hashes/utils';

export function hashPayload(data: unknown): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  return bytesToHex(sha256(bytes));
}

export function hashBytes(data: Uint8Array): string {
  return bytesToHex(sha256(data));
}

/**
 * Hash payload using SHAKE-256 (quantum-native, same Keccak family as ML-DSA-65).
 * Produces a 32-byte (256-bit) digest by default.
 */
export function hashPayloadQuantum(data: unknown, dkLen: number = 32): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  return bytesToHex(shake256(bytes, { dkLen }));
}

/**
 * Hash raw bytes using SHAKE-256.
 */
export function hashBytesQuantum(data: Uint8Array, dkLen: number = 32): string {
  return bytesToHex(shake256(data, { dkLen }));
}

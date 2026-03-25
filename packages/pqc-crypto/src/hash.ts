import { sha256 } from '@noble/hashes/sha2';
import { bytesToHex } from '@noble/hashes/utils';

export function hashPayload(data: unknown): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  return bytesToHex(sha256(bytes));
}

export function hashBytes(data: Uint8Array): string {
  return bytesToHex(sha256(data));
}

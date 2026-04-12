/**
 * Quantum-native key derivation using HKDF-SHA3-256.
 *
 * SHA3-256 belongs to the Keccak family — the same family as SHAKE-256
 * used internally by ML-DSA-65 (FIPS 204). This keeps the entire
 * cryptographic chain in the same quantum-native family.
 *
 * HKDF (RFC 5869) separates key derivation into two phases:
 *   Extract: condenses input key material into a pseudorandom key
 *   Expand:  derives one or more output keys with domain-specific info
 */

import { hkdf } from '@noble/hashes/hkdf';
import { sha3_256 } from '@noble/hashes/sha3';

const encoder = new TextEncoder();

/**
 * Derive a key using HKDF-SHA3-256.
 *
 * @param ikm  - Input key material (master seed or key)
 * @param salt - Domain separator / version tag (e.g. "taurus-ai-org-v1")
 * @param info - Context-specific info string (e.g. "pqc-secret-key:orgId")
 * @param length - Output key length in bytes (default: 32)
 */
export function deriveKey(
  ikm: Uint8Array | string,
  salt: Uint8Array | string,
  info: string,
  length: number = 32,
): Uint8Array {
  const ikmBytes = typeof ikm === 'string' ? encoder.encode(ikm) : ikm;
  const saltBytes = typeof salt === 'string' ? encoder.encode(salt) : salt;
  const infoBytes = encoder.encode(info);
  return hkdf(sha3_256, ikmBytes, saltBytes, infoBytes, length);
}

/**
 * Derive a 32-byte seed for ML-DSA-65 agent key generation.
 * Replaces raw SHA-256(masterSeed ║ context).
 */
export function deriveAgentSeed(
  masterSeed: Uint8Array,
  swarmId: string,
  agentId: string,
): Uint8Array {
  return deriveKey(
    masterSeed,
    'taurus-ai-agent-v1',
    `agent:${swarmId}:${agentId}`,
    32,
  );
}

/**
 * Derive a 32-byte AES-256-GCM key for encrypting org secret keys.
 * Replaces HMAC-SHA256(masterKey, "pqc-secret-key:orgId").
 */
export function deriveOrgEncryptionKey(
  masterKey: Uint8Array | string,
  orgId: string,
): Uint8Array {
  return deriveKey(
    masterKey,
    'taurus-ai-org-v1',
    `pqc-secret-key:${orgId}`,
    32,
  );
}

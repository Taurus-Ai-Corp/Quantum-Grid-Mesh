import { describe, it, expect } from 'vitest';
import { createStamp } from '../src/stamp.js';
import { generateKeyPair, verify } from '../src/sign.js';
import { hashPayload } from '../src/hash.js';
import { hexToBytes } from '@noble/hashes/utils';
import type { StampableEntity } from '../src/types.js';

describe('PQC stamp creation', () => {
  it('creates a valid stamp with hash and ML-DSA-65 algorithm', () => {
    const { publicKey, secretKey } = generateKeyPair();
    const entity: StampableEntity = {
      type: 'assessment',
      id: 'assess-001',
      payload: { score: 95, criteria: ['A', 'B'] },
      jurisdiction: 'na',
    };

    const stamp = createStamp(entity, secretKey, publicKey);

    expect(stamp.algorithm).toBe('ML-DSA-65');
    expect(stamp.hash).toHaveLength(64);
    expect(stamp.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(stamp.signature).toBeTruthy();
    expect(stamp.publicKey).toBeTruthy();
    expect(stamp.timestamp).toBeTypeOf('number');
  });

  it('stamp hash matches an independent hash of the payload', () => {
    const { publicKey, secretKey } = generateKeyPair();
    const entity: StampableEntity = {
      type: 'report',
      id: 'report-007',
      payload: { finding: 'compliant', details: ['ok'] },
      jurisdiction: 'eu',
    };

    const stamp = createStamp(entity, secretKey, publicKey);
    const independentHash = hashPayload(entity.payload);

    expect(stamp.hash).toBe(independentHash);
  });

  it('stamp signature is verifiable with the stored public key', () => {
    const { publicKey, secretKey } = generateKeyPair();
    const entity: StampableEntity = {
      type: 'audit',
      id: 'audit-999',
      payload: { entries: 42 },
      jurisdiction: 'ae',
    };

    const stamp = createStamp(entity, secretKey, publicKey);

    // Reconstruct what was signed: the hash bytes encoded as UTF-8
    const msgBytes = new TextEncoder().encode(stamp.hash);
    const sigBytes = hexToBytes(stamp.signature);
    const pubKeyBytes = hexToBytes(stamp.publicKey);

    expect(verify(msgBytes, sigBytes, pubKeyBytes)).toBe(true);
  });
});

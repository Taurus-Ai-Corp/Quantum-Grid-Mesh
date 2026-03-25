import { describe, it, expect } from 'vitest';
import { generateOrgKeyPair, encryptSecretKey, decryptSecretKey } from '../src/keys.js';
import { sign, verify } from '../src/sign.js';

describe('Key encryption/decryption', () => {
  it('encrypts and decrypts a secret key (roundtrip)', () => {
    const { secretKey } = generateOrgKeyPair();
    const masterKey = 'test-master-key-for-org-12345';
    const orgId = 'org-abc-001';

    const encrypted = encryptSecretKey(secretKey, masterKey, orgId);
    expect(encrypted.ciphertext).toBeTruthy();
    expect(encrypted.iv).toBeTruthy();
    expect(encrypted.authTag).toBeTruthy();

    const decrypted = decryptSecretKey(encrypted, masterKey, orgId);
    expect(decrypted).toBeInstanceOf(Uint8Array);
    expect(decrypted).toEqual(secretKey);
  });

  it('decrypted key can still sign and verify messages', () => {
    const { secretKey, publicKey } = generateOrgKeyPair();
    const masterKey = 'another-master-key-xyz';
    const orgId = 'org-002';

    const encrypted = encryptSecretKey(secretKey, masterKey, orgId);
    const decrypted = decryptSecretKey(encrypted, masterKey, orgId);

    const msg = new TextEncoder().encode('roundtrip sign test');
    const sig = sign(msg, decrypted);
    expect(verify(msg, sig, publicKey)).toBe(true);
  });

  it('fails to decrypt with the wrong master key', () => {
    const { secretKey } = generateOrgKeyPair();
    const encrypted = encryptSecretKey(secretKey, 'correct-master-key', 'org-003');

    expect(() => {
      decryptSecretKey(encrypted, 'wrong-master-key', 'org-003');
    }).toThrow();
  });
});

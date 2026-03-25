import { describe, it, expect } from 'vitest';
import { generateKeyPair, sign, verify } from '../src/sign.js';

describe('ML-DSA-65 signing', () => {
  it('generates a valid keypair with non-empty Uint8Arrays', () => {
    const kp = generateKeyPair();
    expect(kp.publicKey).toBeInstanceOf(Uint8Array);
    expect(kp.secretKey).toBeInstanceOf(Uint8Array);
    expect(kp.publicKey.length).toBeGreaterThan(0);
    expect(kp.secretKey.length).toBeGreaterThan(0);
  });

  it('signs a message and verifies it successfully', () => {
    const { publicKey, secretKey } = generateKeyPair();
    const msg = new TextEncoder().encode('hello pqc world');
    const sig = sign(msg, secretKey);
    expect(verify(msg, sig, publicKey)).toBe(true);
  });

  it('rejects a tampered message', () => {
    const { publicKey, secretKey } = generateKeyPair();
    const msg = new TextEncoder().encode('original message');
    const sig = sign(msg, secretKey);
    const tampered = new TextEncoder().encode('tampered message');
    expect(verify(tampered, sig, publicKey)).toBe(false);
  });

  it('rejects verification with the wrong public key', () => {
    const kp1 = generateKeyPair();
    const kp2 = generateKeyPair();
    const msg = new TextEncoder().encode('test message');
    const sig = sign(msg, kp1.secretKey);
    expect(verify(msg, sig, kp2.publicKey)).toBe(false);
  });
});

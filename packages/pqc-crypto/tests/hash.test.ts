import { describe, it, expect } from 'vitest';
import { hashPayload, hashBytes, hashPayloadQuantum, hashBytesQuantum } from '../src/hash.js';

describe('SHA-256 hashing', () => {
  it('produces a consistent 64-char hex hash for the same input', () => {
    const result1 = hashPayload({ foo: 'bar', num: 42 });
    const result2 = hashPayload({ foo: 'bar', num: 42 });
    expect(result1).toBe(result2);
    expect(result1).toHaveLength(64);
    expect(result1).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces different hashes for different inputs', () => {
    const h1 = hashPayload({ a: 1 });
    const h2 = hashPayload({ a: 2 });
    expect(h1).not.toBe(h2);
  });

  it('hashes raw Uint8Array bytes and returns 64-char hex', () => {
    const bytes = new Uint8Array([1, 2, 3, 4, 5]);
    const result = hashBytes(bytes);
    expect(result).toHaveLength(64);
    expect(result).toMatch(/^[0-9a-f]{64}$/);
    // same bytes same hash
    expect(hashBytes(bytes)).toBe(result);
  });
});

describe('SHAKE-256 hashing (quantum-native)', () => {
  it('produces a consistent 64-char hex hash for the same input', () => {
    const result1 = hashPayloadQuantum({ foo: 'bar', num: 42 });
    const result2 = hashPayloadQuantum({ foo: 'bar', num: 42 });
    expect(result1).toBe(result2);
    expect(result1).toHaveLength(64); // 32 bytes = 64 hex chars
    expect(result1).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces different hashes for different inputs', () => {
    const h1 = hashPayloadQuantum({ a: 1 });
    const h2 = hashPayloadQuantum({ a: 2 });
    expect(h1).not.toBe(h2);
  });

  it('produces different hashes than SHA-256 for the same input', () => {
    const sha = hashPayload({ test: true });
    const shake = hashPayloadQuantum({ test: true });
    expect(sha).not.toBe(shake);
  });

  it('supports custom output lengths', () => {
    const h16 = hashPayloadQuantum({ data: 'test' }, 16);
    const h64 = hashPayloadQuantum({ data: 'test' }, 64);
    expect(h16).toHaveLength(32);  // 16 bytes = 32 hex chars
    expect(h64).toHaveLength(128); // 64 bytes = 128 hex chars
  });

  it('hashes raw Uint8Array bytes with SHAKE-256', () => {
    const bytes = new Uint8Array([1, 2, 3, 4, 5]);
    const result = hashBytesQuantum(bytes);
    expect(result).toHaveLength(64);
    expect(result).toMatch(/^[0-9a-f]{64}$/);
    expect(hashBytesQuantum(bytes)).toBe(result);
  });
});

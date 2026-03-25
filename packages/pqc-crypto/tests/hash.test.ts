import { describe, it, expect } from 'vitest';
import { hashPayload, hashBytes } from '../src/hash.js';

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

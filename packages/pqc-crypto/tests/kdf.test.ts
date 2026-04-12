import { describe, it, expect } from 'vitest';
import { deriveKey, deriveAgentSeed, deriveOrgEncryptionKey } from '../src/kdf.js';
import { randomBytes } from '@noble/hashes/utils';

describe('HKDF-SHA3-256 key derivation', () => {
  const masterSeed = randomBytes(32);

  it('derives a 32-byte key by default', () => {
    const key = deriveKey(masterSeed, 'test-salt', 'test-info');
    expect(key).toBeInstanceOf(Uint8Array);
    expect(key.length).toBe(32);
  });

  it('derives custom-length keys', () => {
    const key16 = deriveKey(masterSeed, 'salt', 'info', 16);
    const key64 = deriveKey(masterSeed, 'salt', 'info', 64);
    expect(key16.length).toBe(16);
    expect(key64.length).toBe(64);
  });

  it('is deterministic — same inputs produce same output', () => {
    const a = deriveKey(masterSeed, 'salt', 'info');
    const b = deriveKey(masterSeed, 'salt', 'info');
    expect(a).toEqual(b);
  });

  it('different salts produce different keys', () => {
    const a = deriveKey(masterSeed, 'salt-v1', 'info');
    const b = deriveKey(masterSeed, 'salt-v2', 'info');
    expect(a).not.toEqual(b);
  });

  it('different info strings produce different keys', () => {
    const a = deriveKey(masterSeed, 'salt', 'org:alice');
    const b = deriveKey(masterSeed, 'salt', 'org:bob');
    expect(a).not.toEqual(b);
  });

  it('accepts string inputs for ikm and salt', () => {
    const key = deriveKey('master-passphrase', 'domain-v1', 'context');
    expect(key).toBeInstanceOf(Uint8Array);
    expect(key.length).toBe(32);
  });
});

describe('deriveAgentSeed', () => {
  const masterSeed = randomBytes(32);

  it('produces a 32-byte seed suitable for ml_dsa65.keygen', () => {
    const seed = deriveAgentSeed(masterSeed, 'swarm-001', 'agent-a');
    expect(seed).toBeInstanceOf(Uint8Array);
    expect(seed.length).toBe(32);
  });

  it('is deterministic per swarmId:agentId', () => {
    const a = deriveAgentSeed(masterSeed, 'swarm-001', 'agent-a');
    const b = deriveAgentSeed(masterSeed, 'swarm-001', 'agent-a');
    expect(a).toEqual(b);
  });

  it('different agents get different seeds', () => {
    const a = deriveAgentSeed(masterSeed, 'swarm-001', 'agent-a');
    const b = deriveAgentSeed(masterSeed, 'swarm-001', 'agent-b');
    expect(a).not.toEqual(b);
  });

  it('different swarms get different seeds', () => {
    const a = deriveAgentSeed(masterSeed, 'swarm-001', 'agent-a');
    const b = deriveAgentSeed(masterSeed, 'swarm-002', 'agent-a');
    expect(a).not.toEqual(b);
  });
});

describe('deriveOrgEncryptionKey', () => {
  it('produces a 32-byte AES key', () => {
    const key = deriveOrgEncryptionKey('master-key', 'org-001');
    expect(key).toBeInstanceOf(Uint8Array);
    expect(key.length).toBe(32);
  });

  it('is deterministic per orgId', () => {
    const a = deriveOrgEncryptionKey('master-key', 'org-001');
    const b = deriveOrgEncryptionKey('master-key', 'org-001');
    expect(a).toEqual(b);
  });

  it('different orgs get different keys', () => {
    const a = deriveOrgEncryptionKey('master-key', 'org-001');
    const b = deriveOrgEncryptionKey('master-key', 'org-002');
    expect(a).not.toEqual(b);
  });

  it('different master keys produce different org keys', () => {
    const a = deriveOrgEncryptionKey('master-a', 'org-001');
    const b = deriveOrgEncryptionKey('master-b', 'org-001');
    expect(a).not.toEqual(b);
  });
});

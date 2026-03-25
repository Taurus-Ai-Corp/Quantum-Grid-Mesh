export type Jurisdiction = 'na' | 'eu' | 'in' | 'ae';

export interface PqcStamp {
  hash: string;
  signature: string;
  publicKey: string;
  algorithm: 'ML-DSA-65';
  timestamp: number;
  hederaTxId?: string;
  hederaTopicId?: string;
  hederaSequence?: number;
}

export interface StampableEntity {
  type: 'assessment' | 'report' | 'scan' | 'audit' | 'system' | 'billing' | 'consent';
  id: string;
  payload: unknown;
  jurisdiction: Jurisdiction;
}

export interface PqcKeyPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

export interface EncryptedKey {
  ciphertext: string;
  iv: string;
  authTag: string;
}

import { createCipheriv, createDecipheriv, createHmac, randomBytes } from 'node:crypto';
import { generateKeyPair } from './sign.js';
import type { PqcKeyPair, EncryptedKey } from './types.js';

const AES_ALGO = 'aes-256-gcm';
const IV_BYTES = 12; // 96-bit IV recommended for GCM

/**
 * Derives a 32-byte AES key from a master key + orgId using HMAC-SHA256.
 */
function deriveKey(masterKey: string, orgId: string): Buffer {
  return Buffer.from(
    createHmac('sha256', masterKey)
      .update(`pqc-secret-key:${orgId}`)
      .digest()
  );
}

export function generateOrgKeyPair(): PqcKeyPair {
  return generateKeyPair();
}

export function encryptSecretKey(
  secretKey: Uint8Array,
  masterKey: string,
  orgId: string
): EncryptedKey {
  const key = deriveKey(masterKey, orgId);
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(AES_ALGO, key, iv);

  const encrypted = Buffer.concat([cipher.update(secretKey), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
}

export function decryptSecretKey(
  encrypted: EncryptedKey,
  masterKey: string,
  orgId: string
): Uint8Array {
  const key = deriveKey(masterKey, orgId);
  const iv = Buffer.from(encrypted.iv, 'base64');
  const ciphertext = Buffer.from(encrypted.ciphertext, 'base64');
  const authTag = Buffer.from(encrypted.authTag, 'base64');

  const decipher = createDecipheriv(AES_ALGO, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return new Uint8Array(decrypted);
}

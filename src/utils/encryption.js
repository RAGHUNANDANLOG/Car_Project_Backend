import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-32-char-encryption-key!!';

/**
 * Encrypt data using AES-256 encryption
 * @param {string} data - Plain text data to encrypt
 * @returns {string} - Encrypted data
 */
export const encrypt = (data) => {
  if (!data) return null;
  const encrypted = CryptoJS.AES.encrypt(data.toString(), ENCRYPTION_KEY).toString();
  return encrypted;
};

/**
 * Decrypt AES-256 encrypted data
 * @param {string} encryptedData - Encrypted data
 * @returns {string} - Decrypted plain text
 */
export const decrypt = (encryptedData) => {
  if (!encryptedData) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

/**
 * Hash data using SHA-256 (one-way)
 * @param {string} data - Data to hash
 * @returns {string} - Hashed data
 */
export const hash = (data) => {
  if (!data) return null;
  return CryptoJS.SHA256(data.toString()).toString();
};

export default { encrypt, decrypt, hash };




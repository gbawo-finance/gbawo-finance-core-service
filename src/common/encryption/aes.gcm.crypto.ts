import * as crypto from 'crypto';

interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
  algorithm: string;
}

interface DecryptedData {
  decrypted: string;
  verified: boolean;
}

interface KeyPair {
  key: string;
  keyHex: string;
}

export class AESGCMCrypto {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 12;

  /**
   * Generate a cryptographically secure 256-bit encryption key
   * @returns {KeyPair} Base64 and hex encoded key
   */
  generateKey(): KeyPair {
    try {
      const key = crypto.randomBytes(this.keyLength);
      return {
        key: key.toString('base64'),
        keyHex: key.toString('hex'),
      };
    } catch (error) {
      throw new Error(
        `Key generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Generate a cryptographically secure key from a password using PBKDF2
   * @param {string} password - User password
   * @param {string} salt - Base64 encoded salt (optional, will generate if not provided)
   * @param {number} iterations - Number of PBKDF2 iterations (default: 100000)
   * @returns {KeyPair & {salt: string}} Derived key and salt used
   */
  deriveKeyFromPassword(
    password: string,
    salt?: string,
    iterations: number = 100000,
  ): KeyPair & { salt: string } {
    try {
      const saltBuffer = salt
        ? Buffer.from(salt, 'base64')
        : crypto.randomBytes(16);
      const derivedKey = crypto.pbkdf2Sync(
        password,
        saltBuffer,
        iterations,
        this.keyLength,
        'sha256',
      );

      return {
        key: derivedKey.toString('base64'),
        keyHex: derivedKey.toString('hex'),
        salt: saltBuffer.toString('base64'),
      };
    } catch (error) {
      throw new Error(
        `Key derivation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Encrypt plaintext using AES-256-GCM
   * @param {string} plaintext - Data to encrypt
   * @param {string} keyBase64 - Base64 encoded encryption key
   * @param {string} additionalData - Optional additional authenticated data (AAD)
   * @returns {EncryptedData} Encrypted data with IV and authentication tag
   */
  encrypt(
    plaintext: string,
    keyBase64: string,
    additionalData?: string,
  ): EncryptedData {
    try {
      // Validate inputs
      if (!plaintext || !keyBase64) {
        throw new Error('Plaintext and key are required');
      }

      // Decode the key and validate length
      const key = Buffer.from(keyBase64, 'base64');
      if (key.length !== this.keyLength) {
        throw new Error(
          `Invalid key length. Expected ${this.keyLength} bytes, got ${key.length}`,
        );
      }

      // Generate random IV
      const iv = crypto.randomBytes(this.ivLength);

      // Create cipher with IV
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);

      // Set additional authenticated data if provided
      if (additionalData) {
        cipher.setAAD(Buffer.from(additionalData, 'utf8'));
      }

      // Encrypt the data
      let encrypted = cipher.update(plaintext, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      // Get the authentication tag
      const authTag = cipher.getAuthTag();

      return {
        encrypted,
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        algorithm: this.algorithm,
      };
    } catch (error) {
      throw new Error(
        `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Decrypt ciphertext using AES-256-GCM
   * @param {EncryptedData} encryptedData - Data to decrypt
   * @param {string} keyBase64 - Base64 encoded encryption key
   * @param {string} additionalData - Optional additional authenticated data (must match encryption)
   * @returns {DecryptedData} Decrypted plaintext and verification status
   */
  decrypt(
    encryptedData: EncryptedData,
    keyBase64: string,
    additionalData?: string,
  ): DecryptedData {
    try {
      // Validate inputs
      if (!encryptedData || !keyBase64) {
        throw new Error('Encrypted data and key are required');
      }

      const { encrypted, iv, authTag, algorithm } = encryptedData;

      if (algorithm !== this.algorithm) {
        throw new Error(
          `Algorithm mismatch. Expected ${this.algorithm}, got ${algorithm}`,
        );
      }

      // Decode components
      const key = Buffer.from(keyBase64, 'base64');
      const ivBuffer = Buffer.from(iv, 'base64');
      const authTagBuffer = Buffer.from(authTag, 'base64');

      if (key.length !== this.keyLength) {
        throw new Error(
          `Invalid key length. Expected ${this.keyLength} bytes, got ${key.length}`,
        );
      }

      // Create decipher with IV
      const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
      decipher.setAuthTag(authTagBuffer);

      // Set additional authenticated data if provided
      if (additionalData) {
        decipher.setAAD(Buffer.from(additionalData, 'utf8'));
      }

      // Decrypt the data
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return {
        decrypted,
        verified: true,
      };
    } catch {
      // If decryption fails, it's usually due to tampering or wrong key
      return {
        decrypted: '',
        verified: false,
      };
    }
  }
}

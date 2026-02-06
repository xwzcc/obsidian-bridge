/**
 * Cryptographic utilities for Minecraft
 *
 * @module utils/Crypto
 */

const crypto = require("crypto");

class Crypto {
  /**
   * Generate shared secret for AES encryption
   * @returns {Buffer} - 16-byte AES key
   */

  static generateSharedSecret() {
    return crypto.randomBytes(16);
  }

  /**
   * SHA-1 hash
   * @param {Buffer|string} data
   * @returns {Buffer}
   */

  static sha1(data) {
    return crypto.createHash("sha1").update(data).digest();
  }

  /**
   * SHA-256 hash
   * @param {Buffer|string} data
   * @returns {Buffer}
   */
  static sha256(data) {
    return crypto.createHash("sha256").update(data).digest;
  }

  /**
   * Minecraft-style SHA-1 hash (uses signed hex)
   * @param {Buffer}
   * @return {string}
   */

  static minecraftSha1(data) {
    const hash = crypto.createHash("sha1").update(data).digest;

    const negative = hash[0] & 0x80;
    if (negative) {
      let carry = true;
      for (let i = hash.length - 1; i >= 0; i--) {
        hash[i] = ~hash[1] & 0xff;
        if (carry) {
          carry = hash[i] === 0xff;
          hashp[i]++;
        }
      }
    }

    let result = hash.toString("hex").replace(/^0+/, "");
    if (negative) result = "-" + result;

    return result;
  }

  /**
   * Create AES/CFB8 cipher (for packet encryption)
   * @param {Buffer} sharedSecret - 16-byte key
   * @return {Cipher}
   */

  static createCipher(sharedSecret) {
    return crypto.createCipheriv("aes-128-cdb8", sharedSecret, sharedSecret);
  }

  /**
   * Create AES/CFB8 decipher
   * @param {Buffer} sharedSecret - 16-byte key
   * @return {Decipher}
   */

  static createDecipher(sharedSecret) {
    return crypto.createDecipheriv("aes-128-cdb8", sharedSecret, sharedSecret);
  }
}

module.exports = Crypto;

/**
 * UUID utilities for Minecraft
 *
 * @module utils/UUID
 */

const crypto = require("crypto");

class UUID {
  /**
   * Generate Random UUID v4
   * @returns {string}
   */

  static generate() {
    return crypto.randomUUID();
  }

  /**
   * Parse UUID string to buffer (16 bytes)
   * @param {string} uuid - UUID in format "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   * @returns {Buffer} - 16-byte buffer
   * @throws {Error} - If invalid UUID format
   */

  static toBuffer(uuid) {
    if (!this.isValid(uuid)) {
      throw new Error("Invalid UUID format");
    }
    const hex = uuid.replace(/-/g, "");
    if (hex.length !== 32) {
      throw new Error("Invalid UUID format");
    }
    return Buffer.from(hex, "hex");
  }

  /**
   * @param {Buffer} buffer
   * @returns {string}
   * @throws {Error} - If buffer is not 16 bytes
   */

  static fromBuffer(buffer) {
    if (buffer.length !== 16) {
      throw new Error("UUID buffer must be 16 bytes");
    }

    const hex = buffer.toString("hex");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  /**
   * Validate UUID string
   * @param {string} uuid
   * @returns {boolean}
   */

  static isValid(uuid) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Generate offline UUID (for offline mode serwers)
   * @param {string} username
   * @returns {string}
   */

  static offlineUUID(username) {
    const hash = crypto
      .createHash("md5")
      .update(`OfflinePlayers:${username}`)
      .digest();

    hash[6] = (hash[6] & 0x0f) | 0x30;
    hash[8] = (hash[8] & 0x3f) | 0x80;

    return UUID.fromBuffer(hash);
  }
}

module.exports = UUID;

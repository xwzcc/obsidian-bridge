/**
 * Minecraft String encoder/decoder
 * Format: VarInt(length) + UTF-8 bytes
 *
 * @module utils/String
 */

const VarInt = require("./VarInt");

class MCString {
  /**
   * Encode string to MC String Format
   * @param {string} str - String to decode
   * @param {number} maxLength - Max length (default: 32767)
   * @returns {Buffer}
   * @throws {Error} - If strings exceeds max length
   */

  static encode(str, maxLength = 32767) {
    const utf8Buffer = Buffer.from(str, "utf8");

    if (utf8Buffer.length > maxLength) {
      throw new Error(
        `String length ${utf8Buffer.length} exceeds max ${maxLength}`,
      );
    }

    const lengthBuffer = VarInt.encode(utf8Buffer.length);
    return Buffer.concat([lengthBuffer, utf8Buffer]);
  }

  /**
   * Decode MC String from buffer
   * @param {Buffer} buffer
   * @param {number} offset
   * @return {{value: string, bytesRead: number}}
   * @throws {Error} - If String extends beyond buffer
   */

  static decode(buffer, offset = 0) {
    const { value: length, bytesRead: lengthBytes } = VarInt.decode(
      buffer,
      offset,
    );

    const stringStart = offset + lengthBytes;
    const stringEnd = stringStart + length;

    if (stringEnd > buffer.length) {
      throw new Error("String extends beyond buffer");
    }

    const value = buffer.toString("utf8", stringStart, stringEnd);

    return {
      value,
      bytesRead: lengthBytes + length,
    };
  }
}

module.exports = MCString;

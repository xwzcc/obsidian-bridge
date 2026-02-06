/**
 * VarInt decored/encoder for Minecraft Java Edition
 * VarInt uses 1-5 bytes depending on the value
 *
 * @module utils/VarInt
 */

class VarInt {
  /**
   * Encode the number to VarInt format
   * @param {number} value - Number to encode (-2147483648 to 2147483647)
   * @returns {Buffer} - Encoded VarInt
   * @throws {RangeError} - If value is out of range
   */

  static encode(value) {
    if (
      typeof value !== "number" ||
      !Number.isInteger(value) ||
      value < -2147483648 ||
      value > 2147483647
    ) {
      throw new RangeError("VarInt value out of range");
    }

    const buffer = [];
    let val = value >>> 0;

    do {
      let byte = val & 0x7f;
      val >>>= 7;
      if (val != 0) {
        byte |= 0x80;
      }
      buffer.push(byte);
    } while (val !== 0);
    return Buffer.from(buffer);
  }

  /**
   * Decode VarInt from buffer
   * @param {Buffer} buffer - Buffer to read from
   * @param {number} offset - Start offset (default: 0)
   * @returns {{value: number, bytesRead: number}}
   * @throws {Error} - If VarInt extends beyond buffer or is too large
   */
  static decode(buffer, offset = 0) {
    let result = 0;
    let shift = 0;
    let bytesRead = 0;
    let byte;

    do {
      if (offset + bytesRead >= buffer.length) {
        throw new Error("VarInt extends beyond buffer");
      }
      byte = buffer[offset + bytesRead];
      result |= (byte & 0x7f) << shift;
      shift += 7;
      bytesRead++;

      if (bytesRead > 5) {
        throw new Error("VarInt too large");
      }
    } while ((byte & 0x80) !== 0);

    result = result | 0;

    return { value: result, bytesRead };
  }

  /**
   * Calculate VarInt length for a value without encoding
   * @param {number} value - Value to calculate length for
   * @returns {number} - Number of bytes
   */

  static getLength(value) {
    let val = value >>> 0;
    let length = 0;

    do {
      val >>>= 7;
      length++;
    } while (val !== 0);
    return length;
  }
}

module.exports = VarInt;

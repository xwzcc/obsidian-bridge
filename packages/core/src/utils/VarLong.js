/**
 * VarLong encoder/decoder for Minecraft Java Edition
 * Uses zigzag encoding for signed values
 *
 * @module utils/VarLong
 */

class VarLong {
  /**
   * Encode BigInt to VarLong format
   * @param {bigint} value - Value to encode
   * @returns {Buffer}
   */

  static encode(value) {
    const buffer = [];
    let val = BigInt(value);

    val = (val << 1n) ^ (val >> 63n);

    do {
      let byte = Number(val & 0x7fn);
      val >>= 7n;
      if (val !== 0n) {
        byte |= 0x80;
      }
      buffer.push(byte);
    } while (val !== 0n);
    return Buffer.from(buffer);
  }

  /**
   * @param {Buffer} buffer
   * @param {number} offset
   * @returns {{value: bigint, bytesRead: number}}
   * @throws {Error} - If VarLong is too large
   */

  static decode(buffer, offset = 0) {
    let result = 0n;
    let shift = 0n;
    let bytesRead = 0;
    let byte;

    do {
      if (offset + bytesRead >= buffer.length) {
        throw new Error("VarLong extends beyond buffer");
      }

      byte = buffer[offset + bytesRead];
      result |= BigInt(byte & 0x7f) << shift;
      shift += 7n;
      bytesRead++;

      if (bytesRead > 10) {
        throw new Error("VarLong too large");
      }
    } while ((byte & 0x80) !== 0);

    const decoded = (result >> 1n) ^ -(result & 1n);

    return { value: decoded, bytesRead };
  }

  /**
   * Calculate VarLong Value
   * @param {bigint} value
   * @returns {number}
   */

  static getLength(value) {
    let val = BigInt(value);
    val = (val << 1n) ^ (val >> 63n);
    let length = 0;

    do {
      val >>= 7n;
      length++;
    } while (val !== 0n);

    return length;
  }
}

module.exports = VarLong;

/**
 * Minecraft Position encoder/decoder
 * Format: X (26 bits) | Z (26 bits) | Y (12 bits) = 64 bits (Long)
 *
 * @module types/Position
 */

const BufferHelpers = require("./../utils/BufferHelpers");

class Position {
  /**
   * Encode position to long
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {bigint}
   */
  static encode(x, y, z) {
    const xBits = BigInt(x & 0x3ffffff);
    const yBits = BigInt(y & 0x3fff);
    const zBits = BigInt(z & 0x3ffffff);

    return (xBits << 38n) | (zBits << 12n) | yBits;
  }

  /**
   * Decode Long to position
   * @param {BigInt} encoded
   * @returns {{x: number, y: number, z: number}}
   */
  static decode(encoded) {
    let x = Number(encoded >> 38n);
    let y = Number(encoded & 0xfffn);
    let z = Number(encoded >> 12n) & 0x3ffffffn;

    if (x >= 0x2000000) x -= 0x4000000;
    if (y >= 0x800) y -= 0x1000;
    if (z >= 0x2000000) z -= 0x4000000;

    return { x, y, z };
  }

  /**
   * Encode to buffer (8 bytes)
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {buffer}
   */
  static toBuffer(x, y, z) {
    const encoded = Position.encode(x, y, z);
    return BufferHelpers.writeLong(encoded);
  }

  /**
   * Decode from buffer
   * @param {Buffer} buffer
   * @param {offset} offset
   * @returns {{x: number, y: number, z: number}}
   */
  static fromBuffer(buffer, offset = 0) {
    const encoded = BufferHelpers.readLong(buffer, offset);
    return Position.decode(encoded);
  }
}

module.exports = Position;

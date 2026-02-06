/**
 * BufferReader - Sequential buffer reading with auto-tracked offset
 * Simplifies packet decoding by eliminating manual offset tracking
 *
 * @module utils/BufferReader
 */

const VarInt = require("./VarInt");
const VarLong = require("./VarLong");
const MCString = require("./String");
const UUID = require("./UUID");
const Position = require("../types/Position");

class BufferReader {
  /**
   * Create a BufferReader
   * @param {Buffer} buffer - Buffer to read from
   */
  constructor(buffer) {
    if (!Buffer.isBuffer(buffer)) {
      throw new TypeError("BufferReader requires a Buffer");
    }
    this.buffer = buffer;
    this.offset = 0;
  }

  /**
   * Read VarInt
   * @returns {number}
   */
  readVarInt() {
    const { value, bytesRead } = VarInt.decode(this.buffer, this.offset);
    this.offset += bytesRead;
    return value;
  }

  /**
   * Read VarLong
   * @returns {bigint}
   */
  readVarLong() {
    const { value, bytesRead } = VarLong.decode(this.buffer, this.offset);
    this.offset += bytesRead;
    return value;
  }

  /**
   * Read Minecraft String
   * @param {number} maxLength - Max string length
   * @returns {string}
   */
  readString(maxLength = 32767) {
    const { value, bytesRead } = MCString.decode(this.buffer, this.offset);
    this.offset += bytesRead;

    if (value.length > maxLength) {
      throw new Error(`String length ${value.length} exceeds max ${maxLength}`);
    }

    return value;
  }

  /**
   * Read Boolean
   * @returns {boolean}
   */
  readBoolean() {
    const value = this.buffer[this.offset] !== 0;
    this.offset += 1;
    return value;
  }

  /**
   * Read Byte (-128 to 127)
   * @returns {number}
   */
  readByte() {
    const value = this.buffer.readInt8(this.offset);
    this.offset += 1;
    return value;
  }

  /**
   * Read Unsigned Byte (0 to 255)
   * @returns {number}
   */
  readUByte() {
    const value = this.buffer.readUInt8(this.offset);
    this.offset += 1;
    return value;
  }

  /**
   * Read Short (-32768 to 32767)
   * @returns {number}
   */
  readShort() {
    const value = this.buffer.readInt16BE(this.offset);
    this.offset += 2;
    return value;
  }

  /**
   * Read Unsigned Short (0 to 65535)
   * @returns {number}
   */
  readUShort() {
    const value = this.buffer.readUInt16BE(this.offset);
    this.offset += 2;
    return value;
  }

  /**
   * Read Int
   * @returns {number}
   */
  readInt() {
    const value = this.buffer.readInt32BE(this.offset);
    this.offset += 4;
    return value;
  }

  /**
   * Read Unsigned Int
   * @returns {number}
   */
  readUInt() {
    const value = this.buffer.readUInt32BE(this.offset);
    this.offset += 4;
    return value;
  }

  /**
   * Read Long (as BigInt)
   * @returns {bigint}
   */
  readLong() {
    const value = this.buffer.readBigInt64BE(this.offset);
    this.offset += 8;
    return value;
  }

  /**
   * Read Unsigned Long
   * @returns {bigint}
   */
  readULong() {
    const value = this.buffer.readBigUInt64BE(this.offset);
    this.offset += 8;
    return value;
  }

  /**
   * Read Float
   * @returns {number}
   */
  readFloat() {
    const value = this.buffer.readFloatBE(this.offset);
    this.offset += 4;
    return value;
  }

  /**
   * Read Double
   * @returns {number}
   */
  readDouble() {
    const value = this.buffer.readDoubleBE(this.offset);
    this.offset += 8;
    return value;
  }

  /**
   * Read UUID
   * @returns {string}
   */
  readUUID() {
    const uuidBuffer = this.buffer.slice(this.offset, this.offset + 16);
    this.offset += 16;
    return UUID.fromBuffer(uuidBuffer);
  }

  /**
   * Read Position (encoded as Long)
   * @returns {{x: number, y: number, z: number}}
   */
  readPosition() {
    const encoded = this.readLong();
    return Position.decode(encoded);
  }

  /**
   * Read raw bytes
   * @param {number} length - Number of bytes to read
   * @returns {Buffer}
   */
  readBytes(length) {
    if (this.offset + length > this.buffer.length) {
      throw new Error(
        `Cannot read ${length} bytes, only ${this.buffer.length - this.offset} remaining`,
      );
    }

    const bytes = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return bytes;
  }

  /**
   * Read remaining bytes
   * @returns {Buffer}
   */
  readRemaining() {
    const bytes = this.buffer.slice(this.offset);
    this.offset = this.buffer.length;
    return bytes;
  }

  /**
   * Skip bytes
   * @param {number} bytes - Number of bytes to skip
   */
  skip(bytes) {
    this.offset += bytes;
    if (this.offset > this.buffer.length) {
      throw new Error("Skip beyond buffer length");
    }
  }

  /**
   * Check if more data available
   * @returns {boolean}
   */
  hasMore() {
    return this.offset < this.buffer.length;
  }

  /**
   * Get current offset
   * @returns {number}
   */
  getOffset() {
    return this.offset;
  }

  /**
   * Set offset (for seeking)
   * @param {number} offset
   */
  setOffset(offset) {
    if (offset < 0 || offset > this.buffer.length) {
      throw new Error("Invalid offset");
    }
    this.offset = offset;
  }

  /**
   * Peek at data without advancing offset
   * @param {number} bytes - Number of bytes to peek
   * @returns {Buffer}
   */
  peek(bytes) {
    if (this.offset + bytes > this.buffer.length) {
      throw new Error(`Cannot peek ${bytes} bytes`);
    }
    return this.buffer.slice(this.offset, this.offset + bytes);
  }

  /**
   * Read array with length prefix
   * @param {Function} readFunc - Function to read each element
   * @param {string} lengthType - Type of length prefix ('varint', 'byte', 'short')
   * @returns {Array}
   */
  readArray(readFunc, lengthType = "varint") {
    let length;

    switch (lengthType) {
      case "varint":
        length = this.readVarInt();
        break;
      case "byte":
        length = this.readUByte();
        break;
      case "short":
        length = this.readUShort();
        break;
      default:
        throw new Error(`Unknown length type: ${lengthType}`);
    }

    const array = [];
    for (let i = 0; i < length; i++) {
      array.push(readFunc.call(this));
    }

    return array;
  }

  /**
   * Get buffer length
   * @returns {number}
   */
  getLength() {
    return this.buffer.length;
  }

  /**
   * Get remaining bytes count
   * @returns {number}
   */
  getRemaining() {
    return this.buffer.length - this.offset;
  }

  /**
   * Reset offset to beginning
   */
  reset() {
    this.offset = 0;
  }

  /**
   * Clone reader (shares same buffer, independent offset)
   * @returns {BufferReader}
   */
  clone() {
    const reader = new BufferReader(this.buffer);
    reader.offset = this.offset;
    return reader;
  }
}

module.exports = BufferReader;

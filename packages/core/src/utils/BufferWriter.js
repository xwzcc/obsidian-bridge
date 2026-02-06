/**
 * BufferWriter - Sequential buffer writing with auto-resize
 * Simplifies packet encoding by handling buffer allocation
 *
 * @module utils/BufferWriter
 */

const VarInt = require("./VarInt");
const VarLong = require("./VarLong");
const MCString = require("./String");
const UUID = require("./UUID");
const Position = require("../types/Position");

class BufferWriter {
  /**
   * Create a BufferWriter
   * @param {number} initialSize - Initial buffer size (default: 256)
   */
  constructor(initialSize = 256) {
    this.buffer = Buffer.allocUnsafe(initialSize);
    this.offset = 0;
  }

  /**
   * Ensure buffer has enough capacity
   * @private
   * @param {number} additionalBytes
   */
  ensureCapacity(additionalBytes) {
    const required = this.offset + additionalBytes;

    if (required > this.buffer.length) {
      // Double the size or use required size, whichever is larger
      const newSize = Math.max(this.buffer.length * 2, required);
      const newBuffer = Buffer.allocUnsafe(newSize);
      this.buffer.copy(newBuffer, 0, 0, this.offset);
      this.buffer = newBuffer;
    }
  }

  /**
   * Write VarInt
   * @param {number} value
   */
  writeVarInt(value) {
    const encoded = VarInt.encode(value);
    this.ensureCapacity(encoded.length);
    encoded.copy(this.buffer, this.offset);
    this.offset += encoded.length;
  }

  /**
   * Write VarLong
   * @param {bigint} value
   */
  writeVarLong(value) {
    const encoded = VarLong.encode(value);
    this.ensureCapacity(encoded.length);
    encoded.copy(this.buffer, this.offset);
    this.offset += encoded.length;
  }

  /**
   * Write String
   * @param {string} str
   * @param {number} maxLength
   */
  writeString(str, maxLength = 32767) {
    const encoded = MCString.encode(str, maxLength);
    this.ensureCapacity(encoded.length);
    encoded.copy(this.buffer, this.offset);
    this.offset += encoded.length;
  }

  /**
   * Write Boolean
   * @param {boolean} value
   */
  writeBoolean(value) {
    this.ensureCapacity(1);
    this.buffer[this.offset] = value ? 1 : 0;
    this.offset += 1;
  }

  /**
   * Write Byte
   * @param {number} value
   */
  writeByte(value) {
    this.ensureCapacity(1);
    this.buffer.writeInt8(value, this.offset);
    this.offset += 1;
  }

  /**
   * Write Unsigned Byte
   * @param {number} value
   */
  writeUByte(value) {
    this.ensureCapacity(1);
    this.buffer.writeUInt8(value, this.offset);
    this.offset += 1;
  }

  /**
   * Write Short
   * @param {number} value
   */
  writeShort(value) {
    this.ensureCapacity(2);
    this.buffer.writeInt16BE(value, this.offset);
    this.offset += 2;
  }

  /**
   * Write Unsigned Short
   * @param {number} value
   */
  writeUShort(value) {
    this.ensureCapacity(2);
    this.buffer.writeUInt16BE(value, this.offset);
    this.offset += 2;
  }

  /**
   * Write Int
   * @param {number} value
   */
  writeInt(value) {
    this.ensureCapacity(4);
    this.buffer.writeInt32BE(value, this.offset);
    this.offset += 4;
  }

  /**
   * Write Unsigned Int
   * @param {number} value
   */
  writeUInt(value) {
    this.ensureCapacity(4);
    this.buffer.writeUInt32BE(value, this.offset);
    this.offset += 4;
  }

  /**
   * Write Long
   * @param {bigint|number} value
   */
  writeLong(value) {
    this.ensureCapacity(8);
    this.buffer.writeBigInt64BE(BigInt(value), this.offset);
    this.offset += 8;
  }

  /**
   * Write Unsigned Long
   * @param {bigint|number} value
   */
  writeULong(value) {
    this.ensureCapacity(8);
    this.buffer.writeBigUInt64BE(BigInt(value), this.offset);
    this.offset += 8;
  }

  /**
   * Write Float
   * @param {number} value
   */
  writeFloat(value) {
    this.ensureCapacity(4);
    this.buffer.writeFloatBE(value, this.offset);
    this.offset += 4;
  }

  /**
   * Write Double
   * @param {number} value
   */
  writeDouble(value) {
    this.ensureCapacity(8);
    this.buffer.writeDoubleBE(value, this.offset);
    this.offset += 8;
  }

  /**
   * Write UUID
   * @param {string} uuid
   */
  writeUUID(uuid) {
    const uuidBuffer = UUID.toBuffer(uuid);
    this.ensureCapacity(16);
    uuidBuffer.copy(this.buffer, this.offset);
    this.offset += 16;
  }

  /**
   * Write Position (encoded as Long)
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  writePosition(x, y, z) {
    const encoded = Position.encode(x, y, z);
    this.writeLong(encoded);
  }

  /**
   * Write raw bytes
   * @param {Buffer} bytes
   */
  writeBytes(bytes) {
    this.ensureCapacity(bytes.length);
    bytes.copy(this.buffer, this.offset);
    this.offset += bytes.length;
  }

  /**
   * Write array with length prefix
   * @param {Array} array
   * @param {Function} writeFunc - Function to write each element
   * @param {string} lengthType - Type of length prefix ('varint', 'byte', 'short')
   */
  writeArray(array, writeFunc, lengthType = "varint") {
    // Write length
    switch (lengthType) {
      case "varint":
        this.writeVarInt(array.length);
        break;
      case "byte":
        this.writeUByte(array.length);
        break;
      case "short":
        this.writeUShort(array.length);
        break;
      default:
        throw new Error(`Unknown length type: ${lengthType}`);
    }

    // Write elements
    for (const element of array) {
      writeFunc.call(this, element);
    }
  }

  /**
   * Get final buffer (trimmed to actual size)
   * @returns {Buffer}
   */
  getBuffer() {
    return this.buffer.slice(0, this.offset);
  }

  /**
   * Get current length (bytes written)
   * @returns {number}
   */
  getLength() {
    return this.offset;
  }

  /**
   * Reset writer (clear buffer)
   */
  reset() {
    this.offset = 0;
  }

  /**
   * Get buffer capacity
   * @returns {number}
   */
  getCapacity() {
    return this.buffer.length;
  }
}

module.exports = BufferWriter;

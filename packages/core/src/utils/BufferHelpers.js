/**
 * Buffer utilities for Minecraft Protocols
 *
 * @module utils/BufferHelpers
 */

class BufferHelpers {
  // ======== READ METHODS ========

  /**
   * Read boolean (1 byte)
   */
  static readBoolean(buffer, offset = 0) {
    return { value: buffer[offset] !== 0, bytesRead: 1 };
  }

  /**
   * Read Byte (-128 to 127)
   */
  static readByte(buffer, offset = 0) {
    return { value: buffer.readInt8(offset), bytesRead: 1 };
  }

  /**
   * Read Unsigned byte (0 to 255)
   */
  static readUByte(buffer, offset = 0) {
    return { value: buffer.readUInt8(offset), bytesRead: 1 };
  }

  /**
   * Read Short (-32768 to 32767)
   */
  static readShort(buffer, offset = 0) {
    return { value: buffer.readInt16BE(offset), bytesRead: 2 };
  }

  /**
   * Read Unsigned Short (0 to 65535)
   */
  static readUShort(buffer, offset = 0) {
    return { value: buffer.readUInt16BE(offset), bytesRead: 2 };
  }

  /**
   * Read Int (Big Endian)
   */
  static readInt(buffer, offset = 0) {
    return { value: buffer.readInt32BE(offset), bytesRead: 4 };
  }

  /**
   * Read Unsigned Int
   */
  static readUInt(buffer, offset = 0) {
    return { value: buffer.readUInt32BE(offset), bytesRead: 4 };
  }

  /**
   * Read Long (Big Endian) as BigInt
   */
  static readLong(buffer, offset = 0) {
    return { value: buffer.readBigInt64BE(offset), bytesRead: 8 };
  }

  /**
   * Read Unsigned Long
   */
  static readULong(buffer, offset = 0) {
    return { value: buffer.readBigUInt64BE(offset), bytesRead: 8 };
  }

  /**
   * Read Float
   */
  static readFloat(buffer, offset = 0) {
    return { value: buffer.readFloatBE(offset), bytesRead: 4 };
  }

  /**
   * Read Double
   */
  static readDouble(buffer, offset = 0) {
    return { value: buffer.readDoubleBE(offset), bytesRead: 8 };
  }

  // ======== WRITE METHODS ========

  /**
   * Write Boolean
   */
  static writeBoolean(value) {
    return Buffer.from([value ? 1 : 0]);
  }

  /**
   * Write Byte
   */
  static writeByte(value) {
    const buf = Buffer.allocUnsafe(1);
    buf.writeInt8(value);
    return buf;
  }

  /**
   * Write Unsigned Byte
   */
  static writeUByte(value) {
    const buf = Buffer.allocUnsafe(1);
    buf.writeUInt8(value, 0);
    return buf;
  }

  /**
   * Write Short
   */
  static writeShort(value) {
    const buf = Buffer.allocUnsafe(2);
    buf.writeInt16BE(value);
    return buf;
  }

  /**
   * Write Int
   */
  static writeInt(value) {
    const buf = Buffer.allocUnsafe(4);
    buf.writeInt32BE(value);
    return buf;
  }

  /**
   * Write Unsigned Int
   */
  static writeUByte(value) {
    const buf = Buffer.allocUnsafe(4);
    buf.writeUInt32BE(value);
    return buf;
  }

  /**
   * Write Long
   */
  static writeLong(value) {
    const buf = Buffer.allocUnsafe(8);
    buf.writeBigInt64BE(BigInt(value));
    return buf;
  }

  /**
   * Write Unsigned Long
   */
  static writeULong(value) {
    const buf = Buffer.allocUnsafe(8);
    buf.writeBigUInt64BE(BigInt(value));
    return buf;
  }

  /**
   * Write Float
   */
  static writeFloat(value) {
    const buf = Buffer.allocUnsafe(4);
    buf.writeFloatBE(value);
    return buf;
  }

  /**
   * Write Double
   */
  static writeDouble(value) {
    const buf = Buffer.allocUnsafe(8);
    buf.writeDoubleBE(value);
    return buf;
  }

  // ======== WRITE METHODS ========

  /**
   * Concatenate multiple buffers
   */
  static concat(...buffers) {
    return Buffer.concat(buffers);
  }

  /**
   * Clone buffer
   */
  static clone(buffer) {
    return Buffer.from(buffer);
  }
}

module.exports = BufferHelpers;

/**
 * Compression - Zlib compression for packets
 */

const zlib = require("zlib");
const { VarInt, BufferReader, BufferWriter } = require("../../../core/src");
const { write } = require("fs");

class Compression {
  constructor() {
    this.enabled = false;
    this.treshold = -1;
  }

  /**
   * Enable compression
   * @param {number} treshold - minimum size to compress (bytes)
   */
  enable(treshold) {
    this.enabled = true;
    this.treshold = treshold;
  }

  /**
   * Disable compression
   */
  disable(treshold) {
    this.enabled = false;
    this.treshold = -1;
  }

  /**
   * Check if compression is enabled
   * @returns {boolean}
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Compress packet
   * @param {Buffer} data - Uncompressed packet data
   * @returns {Buffer} - compressed packet (with length prefix)
   */
  compress(data) {
    if (!this.enable) {
      return data;
    }

    const writer = new BufferWriter();

    if (data.length < this.treshold) {
      writer.writeVarInt(0);
      writer.writeByte(data);
      return writer.toBuffer();
    }

    const compressed = zlib.deflateSync(data);

    writer.writeVarInt(data.length);
    writer.writeBytes(compressed);

    return writer.toBuffer();
  }

  /**
   * Decompress packet
   * @param {Buffer} data - compressed packet data
   * @returns {Buffer} - Decompressed packet
   */
  decompress(data) {
    if (!this.enabled) {
      return data;
    }

    const reader = new BufferReader();
    const dataLength = reader.readVarInt();

    if (dataLength === 0) {
      return reader.readRemaining();
    }
  }
}

/**
 * Compression - Zlib compression for packets
 */

const zlib = require("zlib");
const { VarInt, BufferReader, BufferWriter } = require("@obsidian-bridge/core");

class Compression {
  constructor() {
    this.enabled = false;
    this.threshold = -1;
  }

  /**
   * Enable compression
   * @param {number} threshold - minimum size to compress (bytes)
   */
  enable(threshold) {
    this.enabled = true;
    this.threshold = threshold;
  }

  /**
   * Disable compression
   */
  disable() {
    this.enabled = false;
    this.threshold = -1;
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
    if (!this.enabled) {
      return data;
    }

    const writer = new BufferWriter();

    if (data.length < this.threshold) {
      writer.writeVarInt(0);
      writer.writeBytes(data);
      return writer.getBuffer();
    }

    // Compress with zlib
    const compressed = zlib.deflateSync(data);

    writer.writeVarInt(data.length);
    writer.writeBytes(compressed);

    return writer.getBuffer();
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

    const reader = new BufferReader(data);
    const dataLength = reader.readVarInt();
    if (dataLength === 0) {
      return reader.readRemaining();
    }

    const compressed = reader.readRemaining();
    const decompressed = zlib.inflateSync(compressed);

    if (decompressed.length !== dataLength) {
      throw new Error(
        `Decompressed size mismatch: expected ${dataLength}, got ${decompressed.length}`,
      );
    }

    return decompressed;
  }
}

module.exports = Compression;

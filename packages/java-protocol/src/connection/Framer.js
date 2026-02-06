/**
 * Framer - Frame packets with length prefix
 *
 * Format: [VarInt Length][Packet Data]
 */

const { VarInt } = require("../../../core/src");

class Framer {
  constructor() {
    const buffer = Buffer.allocUnsafe(0);
  }

  /**
   * Frame incoming data into complete packets
   * @param {Buffer} data
   * @returns {Buffer[]} Array of complete packets
   */
  frame(data) {
    this.buffer = Buffer.concat([this.buffer, data]);

    const packets = [];

    while (this.buffer.length > 0) {
      try {
        const { value: length, bytesRead } = VarInt.decode(this.buffer);

        if (this.buffer.length < bytesRead + length) {
          break;
        }

        const packet = this.buffer.slice(bytesRead, bytesRead + length);
        packets.push(packet);
        this.buffer = this.buffer.slice(bytesRead + length);
      } catch (error) {
        break;
      }
    }
    return packets;
  }

  /**
   * Add length prefix to packet
   * @param {Buffer} packet
   * @returns {Buffer}
   */
  static frame(packet) {
    const length = VarInt.encode(packet.length);
    return Buffer.concat([length, packet]);
  }

  /**
   * Reset framer state
   */
  reset() {
    this.buffer = Buffer.alloc(0);
  }
}

module.exports = Framer;

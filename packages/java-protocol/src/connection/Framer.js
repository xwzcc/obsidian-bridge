/**
 * Framer - Frame packets with VarInt length prefix
 */

const { VarInt, BufferReader, BufferWriter } = require("@obsidian-bridge/core");

class Framer {
  constructor() {
    this.buffer = Buffer.alloc(0);
  }

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
      } catch (e) {
        break;
      }
    }

    return packets;
  }

  static frame(packet) {
    const length = VarInt.encode(packet.length);
    return Buffer.concat([length, packet]);
  }

  reset() {
    this.buffer = Buffer.alloc(0);
  }
}

module.exports = Framer;

/**
 * Set Compression
 * S→C, ID: 0x03, State: Login
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../base/Packet");

class SetCompressionPacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x03;
    this.threshold = 256;
  }

  encode() {
    const writer = new BufferWriter();
    writer.writeVarInt(this.packetId);
    writer.writeVarInt(this.threshold);
    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();
    this.threshold = reader.readVarInt();
    return this;
  }

  toString() {
    return `SetCompression(threshold=${this.threshold})`;
  }
}

module.exports = SetCompressionPacket;

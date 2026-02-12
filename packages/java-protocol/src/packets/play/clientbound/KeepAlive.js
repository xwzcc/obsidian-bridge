/**
 * Keep Alive (Play) - Clientbound
 * S→C, ID: 0x2B, State: Play
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../../base/Packet");

class KeepAlivePacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x2b;
    this.keepAliveId = BigInt(0); // Long = BigInt w JavaScript
  }

  encode() {
    const writer = new BufferWriter();
    writer.writeVarInt(this.packetId);
    writer.writeLong(this.keepAliveId); // ✅ Long, nie VarInt!
    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt(); // Skip packet ID
    this.keepAliveId = reader.readLong(); // ✅ Long, nie VarInt!
    return this;
  }

  toString() {
    return `KeepAlive(id=${this.keepAliveId})`;
  }
}

module.exports = KeepAlivePacket;

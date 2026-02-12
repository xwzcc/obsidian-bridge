/**
 * Keep Alive (Play) - Serverbound
 * C→S, ID: 0x1B, State: Play
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../../base/Packet");

class KeepAliveServerboundPacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x1b;
    this.keepAliveId = BigInt(0);
  }

  encode() {
    const writer = new BufferWriter();
    writer.writeVarInt(this.packetId);
    writer.writeLong(this.keepAliveId);
    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();
    this.keepAliveId = reader.readLong();
    return this;
  }

  toString() {
    return `KeepAlive(id=${this.keepAliveId})`;
  }
}

module.exports = KeepAliveServerboundPacket;

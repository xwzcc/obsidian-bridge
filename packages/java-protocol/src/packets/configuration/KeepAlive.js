/**
 * Keep Alive (Configuration)
 * Bidirectional, ID: 0x04
 */

const Packet = require("../../base/Packet.js");
const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");

class KeepAliveConfigurationPacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x04;
    this.keepAliveId = BigInt(Date.now());
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

module.exports = KeepAliveConfigurationPacket;

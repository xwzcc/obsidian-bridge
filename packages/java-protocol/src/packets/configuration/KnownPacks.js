/**
 * Serverbound Known Packs
 * C→S, ID: 0x07, State: Configuration
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../base/Packet");

class ServerboundKnownPacksPacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x07;
    this.knownPacks = [];
  }

  encode() {
    const writer = new BufferWriter();
    writer.writeVarInt(this.packetId);
    writer.writeVarInt(this.knownPacks.length);
    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();
    const count = reader.readVarInt();
    this.knownPacks = [];
    for (let i = 0; i < count; i++) {
      const namespace = reader.readString();
      const id = reader.readString();
      const version = reader.readString();
      this.knownPacks.push({ namespace, id, version });
    }
    return this;
  }

  toString() {
    return `ServerboundKnownPacks(count=${this.knownPacks.length})`;
  }
}

module.exports = ServerboundKnownPacksPacket;

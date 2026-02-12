/**
 * Registry Data
 * S→C, ID: 0x07, State: Configuration
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../base/Packet");

class RegistryDataPacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x07;
    this.registryId = "";
    this.entries = [];
  }

  encode() {
    const writer = new BufferWriter();
    writer.writeString(this.packetId);
    writer.writeString(this.registryId);

    writer.writeVarInt(this.entries.length);
    for (const entry of this.entries) {
      writer.writeString(entry.id);
      writer.writeBoolean(entry.data !== null);
      if (entry.data) {
        writer.writeBytes(entry.data);
      }
    }

    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();
    this.registryId = reader.readString();

    const count = reader.readVarInt();
    this.entries = [];
    for (let i = 0; i < count; i++) {
      const entry = {
        id: reader.readString(),
        data: null,
      };

      if (reader.readBoolean()) {
        entry.data = reader.readRemaining();
      }
      this.entries.push(entry);
    }
    return this;
  }
  toString() {
    return `RegistryData(id=${this.registryId}, entries=${this.entries.length})`;
  }
}

module.exports = RegistryDataPacket;

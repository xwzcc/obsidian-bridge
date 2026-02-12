/**
 * Disconnect (Play)
 * S→C, ID: 0x21, State: Play
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../../base/Packet");

class DisconnectPlayPacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x21;
    this.reason = "";
  }

  static createSimple(reason) {
    const packet = new DisconnectPlayPacket();
    packet.reason = JSON.stringify(reason);
    return packet;
  }

  encode() {
    const writer = new BufferWriter();
    writer.writeVarInt(this.packetId);
    writer.writeString(this.reason);
    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();
    this.reason = reader.readString();
    return this;
  }

  toString() {
    try {
      const parsed = JSON.parse(this.reason);
      return `Disconnect(${parsed.text || "complex"})`;
    } catch {
      return "Disconnect()";
    }
  }
}

module.exports = DisconnectPlayPacket;

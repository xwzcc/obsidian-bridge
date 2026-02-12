/**
 * System Chat Message
 * S→C, ID: 0x77, State: Play
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../../base/Packet");

class SystemChatMessagePacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x6c;
    this.content = "";
    this.overlay = false;
  }

  static createSimple(text, overlay = false) {
    const packet = new SystemChatMessagePacket();
    packet.content = JSON.stringify(text);
    packet.overlay = overlay;
    return packet;
  }

  encode() {
    const writer = new BufferWriter();
    writer.writeVarInt(this.packetId);
    writer.writeString(this.content);
    writer.writeBoolean(this.overlay);
    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();
    this.content = reader.readString();
    this.overlay = reader.readBoolean();
    return this;
  }

  toString() {
    try {
      const parsed = JSON.parse(this.content);
      return `SystemChatMessage(${parsed.text || "complex"}, overlay=${this.overlay})`;
    } catch {
      return `SystemChatMessage(overlay=${this.overlay})`;
    }
  }
}

module.exports = SystemChatMessagePacket;

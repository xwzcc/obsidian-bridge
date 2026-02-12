/**
 * Finish Configuration
 * C→S, ID: 0x03, State: Configuration
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../base/Packet");

class FinishConfigurationPacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x03;
  }

  encode() {
    const writer = new BufferWriter();
    writer.writeVarInt(this.packetId);
    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();
    return this;
  }

  toString() {
    return "FinishConfiguration()";
  }
}

module.exports = FinishConfigurationPacket;

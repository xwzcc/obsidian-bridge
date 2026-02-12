/**
 * Acknowledged Finish Configuration
 * C→S, ID: 0x03 , State: Configuration
 *
 * Sent by client to acknowledge Configuration Success and transition to Play state.
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../base/Packet");

class AcknowledgedFinishConfigurationPacket extends Packet {
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
    return "AcknowledgedFinishConfiguration()";
  }
}

module.exports = AcknowledgedFinishConfigurationPacket;

/**
 * Login Acknowledged
 * C→S, ID: 0x03, State: Login
 *
 * Sent by client to acknowledge Login Success and transition to Configuration state.
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../base/Packet");

class LoginAcknowledgedPacket extends Packet {
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
    return "LoginAcknowledged()";
  }
}

module.exports = LoginAcknowledgedPacket;

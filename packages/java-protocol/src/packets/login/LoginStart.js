/**
 * Login Start
 * C→S, ID: 0x00, State: Login
 */

const { BufferWriter, BufferReader, UUID } = require("@obsidian-bridge/core");
const Packet = require("../../base/Packet");

class LoginStartPacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x00;
    this.username = "";
    this.uuid = UUID.generate();
  }

  encode() {
    const writer = new BufferWriter();
    writer.writeVarInt(this.packetId);
    writer.writeString(this.username);
    writer.writeUUID(this.uuid);
    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();
    this.username = reader.readString();
    this.uuid = reader.readUUID();
    return this;
  }

  toString() {
    return `LoginStart(username=${this.username}, uuid=${this.uuid})`;
  }
}

module.exports = LoginStartPacket;

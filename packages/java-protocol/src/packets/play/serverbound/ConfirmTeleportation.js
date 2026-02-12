/**
 * Confirm Teleportation
 * C→S, ID: 0x00, State: Play
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../../base/Packet");

class ConfirmTeleportationPacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x00;
    this.teleportId = 0;
  }

  encode() {
    const writer = new BufferWriter();
    writer.writeVarInt(this.packetId);
    writer.writeVarInt(this.teleportId);
    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();
    this.teleportId = reader.readVarInt();
    return this;
  }

  toString() {
    return `ConfirmTeleportation(id=${this.teleportId})`;
  }
}

module.exports = ConfirmTeleportationPacket;

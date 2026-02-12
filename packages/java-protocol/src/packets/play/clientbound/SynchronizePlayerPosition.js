/**
 * Synchronize Player Position
 * S→C, ID: 0x46  , State: Play
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../../base/Packet");

class SynchronizePlayerPositionPacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x46;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.yaw = 0;
    this.pitch = 0;
    this.flags = 0;
    this.teleportId = 0;
  }

  encode() {
    const writer = new BufferWriter();
    writer.writeVarInt(this.packetId);
    writer.writeDouble(this.x);
    writer.writeDouble(this.y);
    writer.writeDouble(this.z);
    writer.writeFloat(this.yaw);
    writer.writeFloat(this.pitch);
    writer.writeByte(this.flags);
    writer.writeVarInt(this.teleportId);
    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();
    this.teleportId = reader.readVarInt();
    this.x = reader.readDouble();
    this.y = reader.readDouble();
    this.z = reader.readDouble();
    reader.readDouble();
    reader.readDouble();
    reader.readDouble();
    this.yaw = reader.readFloat();
    this.pitch = reader.readFloat();
    this.flags = reader.readVarInt();
    return this;
  }

  toString() {
    return `SynchronizePlayerPosition(x=${this.x.toFixed(2)}, y=${this.y.toFixed(2)}, z=${this.z.toFixed(2)}, teleportId=${this.teleportId})`;
  }
}

module.exports = SynchronizePlayerPositionPacket;

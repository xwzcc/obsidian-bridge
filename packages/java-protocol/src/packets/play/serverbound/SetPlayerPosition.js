/**
 * Set Player Position
 * C→S, ID: 0x1D , State: Play
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../../base/Packet");

class SetPlayerPositionPacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x1d; // ✅ poprawne ID
    this.x = 0;
    this.feetY = 0;
    this.z = 0;
    this.onGround = false;
    this.pushingWall = false;
  }

  encode() {
    const writer = new BufferWriter();

    writer.writeVarInt(this.packetId);
    writer.writeDouble(this.x);
    writer.writeDouble(this.feetY);
    writer.writeDouble(this.z);

    let flags = 0;
    if (this.onGround) flags |= 0x01;
    if (this.pushingWall) flags |= 0x02;

    writer.writeByte(flags);

    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();

    this.x = reader.readDouble();
    this.feetY = reader.readDouble();
    this.z = reader.readDouble();

    const flags = reader.readByte();
    this.onGround = (flags & 0x01) !== 0;
    this.pushingWall = (flags & 0x02) !== 0;

    return this;
  }

  toString() {
    return `SetPlayerPosition(x=${this.x.toFixed(2)}, y=${this.feetY.toFixed(2)}, z=${this.z.toFixed(2)})`;
  }
}

module.exports = SetPlayerPositionPacket;

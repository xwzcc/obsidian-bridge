const { BufferWriter, BufferReader } = require("../../../../../core/src");
const Packet = require("../../../base/Packet");

class ChatMessagePacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x08;
    this.message = "";
    this.timestamp = BigInt(Date.now());
    this.salt = 0n;
    this.signature = null;
    this.messageCount = 0;
    this.acknowledged = Buffer.alloc(3);
    this.checksum = 1;
  }

  encode() {
    const writer = new BufferWriter();
    writer.writeVarInt(this.packetId);
    writer.writeString(this.message, 256);
    writer.writeLong(this.timestamp);
    writer.writeLong(this.salt);
    writer.writeBoolean(false);
    writer.writeVarInt(this.messageCount);
    writer.writeBytes(Buffer.alloc(3));
    writer.writeByte(this.checksum);
    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();
    this.message = reader.readString();
    this.timestamp = reader.readLong();
    this.salt = reader.readLong();
    const hasSig = reader.readBoolean();
    if (hasSig) {
      this.signature = reader.readBytes(256);
    }
    this.messageCount = reader.readVarInt();
    this.acknowledged = reader.readBytes(3);
    this.checksum = reader.readByte();
    return this;
  }

  toString() {
    return `ChatMessage(message="${this.message}")`;
  }
}

module.exports = ChatMessagePacket;

/**
 * Client Information
 * C→S, ID: 0x00, State: Configuration
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../base/Packet");

class ClientInformationPacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x00;
    this.locale = "en_US";
    this.viewDistance = 10;
    this.chatMode = 0;
    this.chatColors = true;
    this.displayedSkinParts = 0xff;
    this.mainHand = 1;
    this.enableTextFiltering = false;
    this.allowServerListings = true;
    this.particleStatus = 0; // ✅ DODAJ TO! 0=all, 1=decreased, 2=minimal
  }

  encode() {
    const writer = new BufferWriter();
    writer.writeVarInt(this.packetId);
    writer.writeString(this.locale);
    writer.writeByte(this.viewDistance);
    writer.writeVarInt(this.chatMode);
    writer.writeBoolean(this.chatColors);
    writer.writeUByte(this.displayedSkinParts);
    writer.writeVarInt(this.mainHand);
    writer.writeBoolean(this.enableTextFiltering);
    writer.writeBoolean(this.allowServerListings);
    writer.writeVarInt(this.particleStatus); // ✅ DODAJ TO!
    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();
    this.locale = reader.readString();
    this.viewDistance = reader.readByte();
    this.chatMode = reader.readVarInt();
    this.chatColors = reader.readBoolean();
    this.displayedSkinParts = reader.readUByte();
    this.mainHand = reader.readVarInt();
    this.enableTextFiltering = reader.readBoolean();
    this.allowServerListings = reader.readBoolean();
    this.particleStatus = reader.readVarInt(); // ✅ DODAJ TO!
    return this;
  }

  toString() {
    return `ClientInformation(locale=${this.locale}, viewDistance=${this.viewDistance})`;
  }
}

module.exports = ClientInformationPacket;

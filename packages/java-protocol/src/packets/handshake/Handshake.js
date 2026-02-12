/**
 * Handshake Packet
 * C→S, ID: 0x00, State: Handshake
 */

const { BufferWriter, BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../base/Packet");

class HandshakePacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x00;
    this.protocolversion = 773;
    this.serverAddress = "";
    this.serverPort = 25565;
    this.nextState = 2;
  }

  encode() {
    const writter = new BufferWriter();
    writter.writeVarInt(this.packetId);
    writter.writeVarInt(this.protocolversion);
    writter.writeString(this.serverAddress);
    writter.writeUShort(this.serverPort);
    writter.writeVarInt(this.nextState);
    return writter.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();
    this.protocolversion = reader.readVarInt();
    this.serverAddress = reader.readString();
    this.serverPort = reader.readUShort();
    this.nextState = reader.readVarInt();
    return this;
  }

  toString() {
    return `Handshake(version=${this.protocolVersion}, address=${this.serverAddress}:${this.serverPort}, nextState=${this.nextState})`;
  }
}

module.exports = HandshakePacket;

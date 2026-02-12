/**
 * Login Success
 * S→C, ID: 0x02, State: Login
 */

const { BufferWriter, BufferReader, UUID } = require("@obsidian-bridge/core");
const Packet = require("../../base/Packet");

class LoginSuccessPacket extends Packet {
  // ✅ FIX: Typo "Succes" → "Success"
  constructor() {
    super();
    this.packetId = 0x02;
    this.uuid = UUID.generate(); // ✅ FIX: Dodane nawiasy ()
    this.username = "";
    this.properties = [];
    this.strictErrorHandling = false;
  }

  encode() {
    const writer = new BufferWriter();
    writer.writeVarInt(this.packetId);
    writer.writeUUID(this.uuid); // ✅ FIX: UUID NAJPIERW (wiki.vg)
    writer.writeString(this.username); // ✅ FIX: Username POTEM (wiki.vg)

    writer.writeVarInt(this.properties.length);
    for (const prop of this.properties) {
      writer.writeString(prop.name);
      writer.writeString(prop.value);
      writer.writeBoolean(!!prop.signature); // ✅ FIX: Typo "signatue" → "signature"
      if (prop.signature) {
        writer.writeString(prop.signature); // ✅ FIX: Typo "signatue" → "signature"
      }
    }
    writer.writeBoolean(this.strictErrorHandling);
    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt(); // Skip packet ID
    this.uuid = reader.readUUID(); // ✅ UUID najpierw (poprawne)
    this.username = reader.readString(); // ✅ Username potem (poprawne)

    const propCount = reader.readVarInt();
    this.properties = [];
    for (let i = 0; i < propCount; i++) {
      const prop = {
        name: reader.readString(),
        value: reader.readString(),
      };
      if (reader.readBoolean()) {
        prop.signature = reader.readString();
      }
      this.properties.push(prop);
    }
    this.strictErrorHandling = reader.readBoolean();
    return this;
  }

  toString() {
    return `LoginSuccess(uuid=${this.uuid}, username=${this.username})`;
  }
}

module.exports = LoginSuccessPacket;

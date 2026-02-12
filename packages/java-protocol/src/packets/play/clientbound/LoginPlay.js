/**
 * Login (Play)
 * S→C, ID: 0x30, State: Play
 */

const {
  GameMode,
  BufferWriter,
  BufferReader,
} = require("@obsidian-bridge/core");
const Packet = require("../../../base/Packet");

class LoginPlayPacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x30;
    this.entityId = 0;
    this.isHardcore = false;
    this.dimensionNames = [
      "minecraft:overworld",
      "minecraft:the_nether",
      "minecraft:the_end",
    ];
    this.maxPlayers = 20;
    this.viewDistance = 10;
    this.simulateDistance = 10;
    this.reducedDebugInfo = false;
    this.enableRespawnScreen = true;
    this.doLimitedCrafting = false;
    this.dimensionType = "minecraft:overworld";
    this.dimensionName = "minecraft:overworld";
    this.hashedSeed = 0n;
    this.gameMode = GameMode.SURVIVAL;
    this.previousGameMode = -1;
    this.isDebug = false;
    this.isFlat = false;
    this.deathLocation = null;
    this.portalCooldown = 0;
    this.enforcesSecureChat = false;
  }

  encode() {
    const writer = new BufferWriter();

    writer.writeVarInt(this.packetId);
    writer.writeInt(this.entityId);
    writer.writeBoolean(this.isHardcore);

    writer.writeVarInt(this.dimensionNames.length);
    for (const name of this.dimensionName) {
      writer.writeString(name);
    }

    writer.writeVarInt(this.maxPlayers);
    writer.writeVarInt(this.viewDistance);
    writer.writeVarInt(this.simulateDistance);
    writer.writeBoolean(this.reducedDebugInfo);
    writer.writeBoolean(this.enableRespawnScreen);
    writer.writeBoolean(this.doLimitedCrafting);
    writer.readVarInt(this.dimensionType);
    writer.writeString(this.dimensionName);
    writer.writeLong(this.hashedSeed);
    writer.writeUByte(this.gameMode);
    writer.writeByte(this.previousGameMode);
    writer.writeBoolean(this.isDebug);
    writer.writeBoolean(this.isFlat);

    writer.writeBoolean(this.deathLocation !== null);
    if (this.deathLocation) {
      writer.writeString(this.deathLocation.dimension);
      writer.writePosition(this.deathLocation.position);
    }

    writer.writeVarInt(this.portalCooldown);
    writer.writeBoolean(this.enforcesSecureChat);

    return writer.getBuffer();
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt(); // Odczytaj packetId
    this.entityId = reader.readInt(); // ← ZMIEŃ na readInt() zamiast readVarInt()
    this.isHardcore = reader.readBoolean();

    const dimCount = reader.readVarInt();
    this.dimensionNames = [];
    for (let i = 0; i < dimCount; i++) {
      this.dimensionNames.push(reader.readString());
    }

    this.maxPlayers = reader.readVarInt();
    this.viewDistance = reader.readVarInt();
    this.simulateDistance = reader.readVarInt();
    this.reducedDebugInfo = reader.readBoolean();
    this.enableRespawnScreen = reader.readBoolean();
    this.doLimitedCrafting = reader.readBoolean();
    this.dimensionType = reader.readVarInt();
    this.dimensionName = reader.readString();
    this.hashedSeed = reader.readLong();
    this.gameMode = reader.readUByte();
    this.previousGameMode = reader.readByte();
    this.isDebug = reader.readBoolean();
    this.isFlat = reader.readBoolean();

    const hasDeathLoc = reader.readBoolean();
    if (hasDeathLoc) {
      this.deathLocation = {
        dimension: reader.readString(),
        position: reader.readPosition(),
      };
    } else {
      this.deathLocation = null;
    }

    this.portalCooldown = reader.readVarInt();
    this.seaLevel = reader.readVarInt();
    this.enforcesSecureChat = reader.readBoolean();

    return this;
  }

  toString() {
    const mode = GameMode.getName(this.gameMode);
    return `LoginPlay(entityId=${this.entityId}, gameMode=${mode}, dimension=${this.dimensionName})`;
  }
}

module.exports = LoginPlayPacket;

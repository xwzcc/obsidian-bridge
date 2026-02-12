const { BufferReader } = require("@obsidian-bridge/core");
const Packet = require("../../../base/Packet");

class ChunkDataPacket extends Packet {
  constructor() {
    super();
    this.packetId = 0x2c;
    this.chunkX = 0;
    this.chunkZ = 0;
    this.heightmaps = null;
    this.data = Buffer.alloc(0);
    this.blockEntities = [];
    this.skyLightMask = [];
    this.blockLightMask = [];
    this.emptySkyLightMask = [];
    this.emptyBlockLightMask = [];
    this.skyLight = [];
    this.blockLight = [];
  }

  decode(buffer) {
    const reader = new BufferReader(buffer);
    reader.readVarInt();

    this.chunkX = reader.readInt();
    this.chunkZ = reader.readInt();

    const heightmapsLength = reader.readVarInt();
    const heightmapsBytes = reader.readBytes(heightmapsLength);
    this.heightmaps = heightmapsBytes;

    const dataSize = reader.readVarInt();
    this.data = reader.readBytes(dataSize);

    const blockEntityCount = reader.readVarInt();
    this.blockEntities = [];
    for (let i = 0; i < blockEntityCount; i++) {
      const packedXZ = reader.readUByte();
      const y = reader.readShort();
      const type = reader.readVarInt();
      const nbtLength = reader.readVarInt();
      const nbt = nbtLength > 0 ? reader.readBytes(nbtLength) : Buffer.alloc(0);

      this.blockEntities.push({
        x: (packedXZ >> 4) & 15,
        z: packedXZ & 15,
        y,
        type,
        nbt,
      });
    }

    this.skyLightMask = this.readBitSet(reader);
    this.blockLightMask = this.readBitSet(reader);
    this.emptySkyLightMask = this.readBitSet(reader);
    this.emptyBlockLightMask = this.readBitSet(reader);

    const skyLightCount = reader.readVarInt();
    this.skyLight = [];
    for (let i = 0; i < skyLightCount; i++) {
      const length = reader.readVarInt();
      this.skyLight.push(reader.readBytes(length));
    }

    const blockLightCount = reader.readVarInt();
    this.blockLight = [];
    for (let i = 0; i < blockLightCount; i++) {
      const length = reader.readVarInt();
      this.blockLight.push(reader.readBytes(length));
    }

    return this;
  }

  readBitSet(reader) {
    const length = reader.readVarInt();
    const longs = [];
    for (let i = 0; i < length; i++) {
      longs.push(reader.readLong());
    }
    return longs;
  }

  toString() {
    return `ChunkData(x=${this.chunkX}, z=${this.chunkZ}, data=${this.data.length} bytes)`;
  }
}

module.exports = ChunkDataPacket;

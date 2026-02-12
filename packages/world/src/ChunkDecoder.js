const { BufferReader } = require("@obsidian-bridge/core");
const ChunkColumn = require("./ChunkColumn");
const Chunk = require("./Chunk");
const PalettedContainer = require("./storage/PalettedContainer");

class ChunkDecoder {
  static decode(chunkDataPacket) {
    const column = new ChunkColumn(
      chunkDataPacket.chunkX,
      chunkDataPacket.chunkZ,
    );

    const reader = new BufferReader(chunkDataPacket.data);

    for (let sectionY = -4; sectionY < 20; sectionY++) {
      const chunk = new Chunk(
        chunkDataPacket.chunkX,
        chunkDataPacket.chunkZ,
        sectionY,
      );

      chunk.blockCount = reader.readShort();

      chunk.blocks = new PalettedContainer();
      chunk.blocks.decode(reader);

      chunk.biomes = new PalettedContainer();
      chunk.biomes.decode(reader);

      column.setSection(sectionY, chunk);
    }

    return column;
  }

  static decodeHeightmaps(nbtData) {
    return {};
  }
}

module.exports = ChunkDecoder;

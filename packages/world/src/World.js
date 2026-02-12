const ChunkStorage = require("./storage/ChunkStorage");
const ChunkColumn = require("./ChunkColumn");

class World {
  constructor(name = "world") {
    this.name = name;
    this.chunks = new ChunkStorage();
    this.dimension = "minecraft:overworld";
    this.spawnPosition = { x: 0, y: 64, z: 0 };
  }

  setChunkColumn(x, z, column) {
    this.chunks.setColumn(x, z, column);
  }

  getChunkColumn(x, z) {
    return this.chunks.getColumn(x, z);
  }

  getBlock(x, y, z) {
    const chunkX = Math.floor(x / 16);
    const chunkZ = Math.floor(z / 16);
    const column = this.chunks.getColumn(chunkX, chunkZ);

    if (!column) return null;

    const localX = ((x % 16) + 16) % 16;
    const localZ = ((z % 16) + 16) % 16;

    return column.getBlock(localX, y, localZ);
  }

  isChunkLoaded(x, z) {
    return this.chunks.hasColumn(x, z);
  }

  unloadChunk(x, z) {
    return this.chunks.removeColumn(x, z);
  }

  getLoadedChunksCount() {
    return this.chunks.getLoadedCount();
  }

  clear() {
    this.chunks.clear();
  }

  toString() {
    return `World(name=${this.name}, dimension=${this.dimension}, chunks=${this.getLoadedChunksCount()})`;
  }
}

module.exports = World;

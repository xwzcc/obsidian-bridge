const Block = require("./Block");
const PalettedContainer = require("./storage/PalettedContainer");

class Chunk {
  constructor(x, z, sectionY) {
    this.x = x;
    this.z = z;
    this.sectionY = sectionY;
    this.blocks = new PalettedContainer();
    this.biomes = new PalettedContainer();
    this.biomesCount = 0;
  }

  getBlock(x, y, z) {
    const stateId = this.blocks.get(x, y, z);
    return new Block(stateId);
  }

  getBiome(x, y, z) {
    return this.biomes.get(
      Math.floor(x / 4),
      Math.floor(y / 4),
      Math.floor(z / 4),
    );
  }

  isEmpty() {
    return this.blocks.isEmpty();
  }

  toString() {
    return `Chunk(x=${this.x}, z=${this.z}, y=${this.sectionY}, blocks=${this.blockCount})`;
  }
}

module.exports = Chunk;

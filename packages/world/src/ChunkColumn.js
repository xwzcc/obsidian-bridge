class ChunkColumn {
  constructor(x, z) {
    this.x = x;
    this.z = z;
    this.sections = new Map();
    this.heightmaps = {};
    this.motionBlocking = [];
  }

  getSection(sectionY) {
    return this.sections.get(sectionY);
  }

  setSection(sectionY, chunk) {
    this.sections.set(sectionY, chunk);
  }

  getBlock(x, y, z) {
    const sectionY = Math.floor(y / 16);
    const section = this.sections.get(sectionY);
    if (!section) return null;

    const localY = y % 16;
    return section.getBlock(x, localY, z);
  }

  getHighestBlock(x, z) {
    for (let sectionY = 15; sectionY >= -4; sectionY--) {
      const section = this.sections.get(sectionY);
      if (!section || section.isEmpty()) continue;

      for (let y = 15; y >= 0; y--) {
        const block = section.getBlock(x, y, z);
        if (block && !block.isAir()) {
          return sectionY * 16 + y;
        }
      }
    }
    return -64;
  }

  toString() {
    return `ChunkColumn(x=${this.x}, z=${this.z}, sections=${this.sections.size})`;
  }
}

module.exports = ChunkColumn;

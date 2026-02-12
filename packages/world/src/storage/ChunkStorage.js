class ChunkColumn {
  constructor() {
    this.columns = new Map();
  }

  getChunkKey(x, z) {
    return `${x},${z}`;
  }

  setColumn(x, z, column) {
    const key = this.getChunkKey(x, z);
    this.columns.set(key, column);
  }

  getColumn(x, z) {
    const key = this.getChunkKey(x, z);
    return this.columns.get(key);
  }

  hasColumn(x, z) {
    const key = this.getChunkKey(x, z);
    return this.columns.has(key);
  }

  removeColumn(x, z) {
    const key = this.getChunkKey(x, z);
    return this.columns.delete(key);
  }

  clear() {
    this.columns.clear();
  }

  getLoadedChunks() {
    return Array.from(this.columns.values());
  }

  getLoadedCount() {
    return this.columns.size;
  }

  toString() {
    return `ChunkStorage(loaded=${this.columns.size})`;
  }
}

module.exports = ChunkColumn;

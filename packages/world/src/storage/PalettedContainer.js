class PalettedContainer {
  constructor(bistPerEntry = 4) {
    this.bistPerEntry = bistPerEntry;
    this.palette = [];
    this.data = [];
    this.size = 4096;
  }

  decode(reader) {
    this.bistPerEntry = reader.readUByte();

    if (this.bistPerEntry === 0) {
      const value = reader.readVarInt();
      this.palette = [value];
      this.data = [];
      return this;
    }

    const paletteLength = reader.readVarInt();
    this.palette = [];
    for (let i = 0; i < paletteLength; i++) {
      this.palette.push(reader.readVarInt());
    }

    const dataLength = reader.readVarInt();
    this.data = [];
    for (let i = 0; i < dataLength; i++) {
      this.data.push(reader.readLong());
    }

    return this;
  }

  get(x, y, z) {
    if (this.bistPerEntry === 0) {
      return this.palette[0];
    }

    const index = (y * 16 + z) * 16 + x;
    const value = this.getFromData(index);
    return this.palette[value] || 0;
  }

  getFromData(index) {
    const bitsPerLong = 64;
    const entriesPerLong = Math.floor(bitsPerLong / this.bistPerEntry);
    const longIndex = Math.floor(index / entriesPerLong);
    const subIndex = index % entriesPerLong;

    if (longIndex >= this.data.length) return 0;

    const value = this.data[longIndex];
    const shift = BigInt(subIndex * this.bistPerEntry);
    const mask = (1n << BigInt(this.bistPerEntry)) - 1n;

    return Number((value >> shift) & mask);
  }

  isEmpty() {
    return this.bistPerEntry === 0 && this.palette[0] === 0;
  }

  toString() {
    return `PalettedContainer(bitsPerEntry=${this.bitsPerEntry}, palette=${this.palette.length})`;
  }
}

module.exports = PalettedContainer;

class BlockState {
  constructor(id, properties = {}) {
    this.id = id;
    this.properties = properties;
  }

  getProperties(key) {
    return this.properties[key];
  }

  setProperties(key, value) {
    this.properties[key] = value;
    return this;
  }

  clone() {
    return new BlockState(this.id, { ...this.properties });
  }

  toString() {
    const props = Object.entries(this.properties)
      .map(([k, v]) => `${k}=${v}`)
      .join(",");
    return `BlockState(id=${this.id}${props ? `, ${props}` : ""})`;
  }
}

module.exports = BlockState;

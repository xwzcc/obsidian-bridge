class Block {
  constructor(stateId = 0) {
    this.stateId = stateId;
  }

  isAir() {
    return this.stateId === 0;
  }

  isSolid() {
    return this.stateId !== 0;
  }

  clone() {
    return new Block(this.stateId);
  }

  toString() {
    return `Block(stateId=${this.stateId})`;
  }
}

module.exports = Block;

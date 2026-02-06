/**
 * Packer Registry
 */

class PacketRegistry {
  constructor() {
    this.packets = new Map();
  }

  register(id, PacketClass) {
    this.packets.set(id, PacketClass);
  }

  get(id) {
    this.packets.get(id) || null;
  }

  create(id) {
    const PacketClass = this.get(id);
    return PacketClass ? new PacketClass() : null;
  }
}

module.exports = PacketRegistry;

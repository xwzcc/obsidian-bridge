/**
 * Base Packet Class
 */

class Packet {
  constructor() {
    this.packetId = 0x00;
  }

  /**
   * Encode packet to buffer
   * @returns {Buffer}
   */
  encode() {
    throw new Error("encode() must be implemented by subclass");
  }

  /**
   * Decode Buffer to Packet
   * @param {Buffer} packet
   * @returns {Packet}
   */
  decode() {
    throw new Error("decode() must be implemented by subclass");
  }

  /**
   * get packet name for debugging
   * @returns {string}
   */
  toString() {
    return `${this.constructor.name}`;
  }
}

module.exports = Packet;

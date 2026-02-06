/**
 * Player Rotation
 *
 * @module types/Rotation
 */

class Rotation {
  /**
   * Create Rotation
   * @param {number} yaw - -180 to 180
   * @param {number} pitch - -90 to 90
   */
  constructor(yaw = 0, pitch = 0) {
    this.yaw = yaw;
    this.pitch = pitch;
  }

  /**
   * Set rotation values
   * @param {number} yaw
   * @param {number} pitch
   * @returns {Rotation} - this
   */
  set(yaw, pitch) {
    this.yaw = yaw;
    this.pitch = pitch;
    return this;
  }

  /**
   * Normalize angles to proper range
   * @returns {Rotation} - this
   */
  normalize() {
    this.yaw = ((this.yaw + 180) % 360) - 180;
    if (this.yaw < -180) this.yaw += 360;

    this.pitch = Math.max(-90, Math.min(90, this.pitch));

    return this;
  }

  /**
   * Convert to byte format (for packets)
   * Minecraft uses byte = angle / 360 * 256
   * @returns {{yaw: number, pitch}}
   */
  toBytes() {
    return {
      yaw: Math.floor((this.yaw / 360) * 256) & 0xff,
      pitch: Math.floor((this.pitch / 360) * 256) & 0xff,
    };
  }

  /**
   * Create from byte format
   * @param {number} yawByte - 0-255
   * @param {number} pitchByte - 0-255
   * @returns {Rotation}
   */

  static fromBytes(yawByte, pitchByte) {
    let yaw = (yawByte / 256) * 360;
    let pitch = (pitchByte / 256) * 360;

    if (yaw > 180) yaw -= 360;
    if (pitch > 180) pitch -= 360;

    return new Rotation(yaw, pitch);
  }
  /**
   * Clone Rotation
   * @param {Rotation}
   */
  clone() {
    return new Rotation(this.yaw, this.pitch);
  }

  /**
   * Convert to JSON
   * @returns {{yaw: number, pitch: number}}
   */
  toJSON() {
    return { yaw: this.yaw, pitch: this.pitch };
  }

  /**
   * Create from JSON
   * @param {{yaw: number, pitch: number}} json
   * @returns {Rotation}
   */

  static fromJSON(json) {
    return new Rotation(json.yaw, json.pitch);
  }

  /**
   * String representation
   * @returns {String}
   */
  toString() {
    return `Rotation(yaw=${this.yaw.toFixed(1)}°, pitch=${this.pitch.toFixed(1)}°)`;
  }
}

module.exports = Rotation;

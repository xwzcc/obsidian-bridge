/**
 * 3D Vector for positions and movments
 *
 * @module types/Vector3
 */

class Vector3 {
  /**
   * Create a 3D vector
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Set vector values
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Vector3} - this (for chaining)
   */
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  /**
   * Add another vector
   * @param {Vector3} other
   * @return {Vector3}
   */
  add(other) {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  /**
   * Subtract another vector
   * @param {Vector3} other
   * @return {Vector3}
   */
  subtract(other) {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  /**
   * Multiply by scalar
   * @param {number} scalar
   * @returns {Vector3}
   */
  multiply(scalar) {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  /**
   * Divide by scalar
   * @param {number} scalar
   * @returns {Vector3}
   */
  divide(scalar) {
    if (scalar === 0) {
      throw new Error("Division by zero (bro)");
    }
    return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
  }

  /**
   * Vector length (magnitude)
   * @returns {number}
   */
  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  /**
   * Squared length (faster, no sqrt)
   * @returns {number}
   */
  lengthSquared() {
    return this.x ** 2 + this.y ** 2 + this.z ** 2;
  }

  /**
   * Distance to another vector
   * @param {Vector3} other
   * @returns {number}
   */
  distanceTo(other) {
    return this.subtract(other).length();
  }

  /**
   * Squared distance (faster)
   * @param {Vector3} other
   * @returns {number}
   */
  distanceToSquared(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return dx * dx + dy * dy + dz * dz;
  }

  /**
   * Normalize vector (length = 1)
   */
  normalize() {
    const len = this.length();
    if (len === 0) return new Vector3(0, 0, 0);
    return this.divide(len);
  }

  /**
   * Dot product
   * @param {Vector3} other
   * @returns {number}
   */
  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  /**
   * Cross Product
   * @param {Vector3} other
   * @returns {Vector3}
   */
  cross(other) {
    return new Vector3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x,
    );
  }

  /**
   * Clone vector
   * @returns {Vector3}
   */
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  /**
   * Convert to json
   * @returns {{x: number, y: number, z: number}}
   */
  toJSON() {
    return { x: this.x, y: this.y, z: this.z };
  }

  /**
   * @param {{x: number, y: number, z: number}} json
   * @returns {Vector3}
   */
  static fromJSON(json) {
    return new Vector3(json.x, json.y, json.z);
  }

  /**
   * String representation
   * @returns {string}
   */
  toString() {
    return `Vector3(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)})`;
  }
}

module.exports = Vector3;

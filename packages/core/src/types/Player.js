/**
 * Universal Player representation
 *
 * @module types/Player
 */

const UUID = require("../utils/UUID");
const GameMode = require("./GameMode");
const Rotation = require("./Rotation");
const Vector3 = require("./Vector3");

class Player {
  /**
   * Create a Player
   * @param {Object} options
   */
  constructor(options = {}) {
    this.uuid = options.uuid || UUID.generate();
    this.username = options.username || "Player";
    this.entityId = options.entityId || 0;
    this.runtimeEntityId = options.runtimeEntityId || null;

    this.position = options.position || new Vector3(0, 64, 0);
    this.rotation = options.rotation || new Rotation();
    this.onGround = options.onGround !== undefined ? options.onGround : true;

    this.gameMode =
      options.gameMode !== undefined ? options.gameMode : GameMode.SURVIVAL;
    this.health = options.health !== undefined ? options.health : 20;
    this.food = options.food !== undefined ? options.food : 20;
    this.saturation = options.saturation !== undefined ? options.saturation : 5;
    this.experience = options.experience || 0;
    this.level = options.level || 0;

    this.protocol = options.protocol || "java";
    this.protocolVersion = options.protocolVersion || "765";

    this.connection = options.connection || null;
    this.brand = options.brand || "vanilla";

    this.metadata = options.metadata || {};
  }

  /**
   * Update player position
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {boolean} onGround
   */
  updatePosition(x, y, z, onGround) {
    this.position.set(x, y, z);
    if (onGround !== undefined) this.onGround = onGround;
  }

  /**
   * Update player rotation
   * @param {number} yaw
   * @param {number} pitch
   */
  updateRotation(yaw, pitch) {
    this.rotation.set(yaw, pitch);
  }

  /**
   * Teleport player
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} yaw
   * @param {number} pitch
   */
  teleport(yaw, pitch, x, y, z) {
    this.position.set(x, y, z);
    if (yaw !== undefined) this.rotation.yaw = yaw;
    if (pitch !== undefined) this.rotation.pitch = pitch;
  }

  /**
   * Set game mode
   * @param {number} gameMode
   */
  setGameMode(gameMode) {
    if (GameMode.isValid(gameMode)) {
      this.gameMode = gameMode;
    }
  }

  /**
   * Set health
   * @param {number} health - 0-20
   */
  setHealth(health) {
    this.health = Math.max(0, Math.min(20, health));
  }

  /**
   * Set food level
   * @param {number} food - 0-20
   */
  setFood(food) {
    this.food = Math.max(0, Math.min(20, food));
  }

  /**
   * Set saturation
   * @param {number} saturation - 0-20
   */
  setSaturation(saturation) {
    this.saturation = Math.max(0, Math.min(20, saturation));
  }

  /**
   * Set experience level
   * @param {number} experience
   * @param {number} level
   */
  setExperience(experience, level) {
    this.experience = experience;
    if (level != undefined) this.level = level;
  }

  /**
   * Check if player is alive
   * @returns {boolean}
   */

  isAlive() {
    return this.health > 0;
  }

  /**
   * Check if player is in creative mode
   * @returns {boolean}
   */
  isCreative() {
    return this.gameMode == GameMode.CREATIVE;
  }

  /**
   * Convert to JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      uuid: this.uuid,
      username: this.username,
      entityId: this.entityId,
      runtimeEntityId: this.runtimeEntityId,
      position: this.position,
      rotation: this.rotation,
      onGround: this.onGround,
      gameMode: this.gameMode,
      health: this.health,
      food: this.food,
      saturation: this.saturation,
      experience: this.experience,
      level: this.level,
      protocol: this.protocol,
      protocolVersion: this.protocol,
      brand: this.brand,
      metadata: this.metadata,
    };
  }

  /**
   * Create player from JSON
   * @param {Object} json
   * @return {Player}
   */
  static fromJSON(json) {
    return new Player({
      ...json,
      position: Vector3.fromJSON(json.position),
      rotation: Rotation.fromJSON(json.rotation),
    });
  }

  /**
   * String representation
   * @returns {string}
   */
  toString() {
    return `Player(${this.username}, ${this.uuid}, gameMode=${GameMode.getName(this.gameMode)})`;
  }
}

module.exports = Player;

/**
 * Game Modes enumeration
 *
 * @module types/GameMode
 */

const GameMode = {
  SURVIVAL: 0,
  CREATIVE: 1,
  ADVENTURE: 2,
  SPECTATOR: 3,

  /**
   * Get game mode name
   * @param {number} mode - Game mode ID (0-3)
   * @returns {string}
   */

  getName(mode) {
    const names = ["survival", "creative", "adventure", "spectator"];
    return names[mode] || "unknown";
  },

  /**
   * Parse name to ID
   * @param {string} name - Game mode name
   * @returns {number}
   */
  fromName(name) {
    const modes = {
      survival: 0,
      creative: 1,
      adventure: 2,
      spectator: 3,
    };

    const normalized = name.toLowerCase();
    return modes[normalized] !== undefined ? modes[normalized] : 0;
  },

  /**
   * Check if valid game mode
   * @param {number}
   * @returns {boolean}
   */

  isValid(mode) {
    return mode >= 0 && mode <= 3;
  },
};

module.exports = GameMode;

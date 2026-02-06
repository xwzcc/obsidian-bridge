/**
 * @obsidian-bridge/core
 * Core utilises and types for Obsidian Bridge Minecraft protocol bridge
 *
 * @module obsidian-bridge/core
 */

// Utils
const VarInt = require("./utils/VarInt");
const VarLong = require("./utils/VarLong");
const MCString = require("./utils/String");
const UUID = require("./utils/UUID");
const BufferHelpers = require("./utils/BufferHelpers");
const Crypto = require("./utils/Crypto");
const BufferReader = require("./utils/BufferReader");
const BufferWriter = require("./utils/BufferWriter");

// Types
const Player = require("./types/Player");
const Position = require("./types/Position");
const Vector3 = require("./types/Vector3");
const Rotation = require("./types/Rotation");
const GameMode = require("./types/GameMode");

// Events
const EventEmitter = require("./events/EventEmitter");

const {
  ProtocolError,
  CompressionError,
  EncryptionError,
} = require("./errors/ProtocolError");

// Constants
const Versions = require("./constants/Versions");
const States = require("./constants/States");

module.exports = {
  // Utils
  VarInt,
  VarLong,
  MCString,
  UUID,
  Crypto,
  BufferHelpers,
  BufferReader,
  BufferWriter,

  // Types
  Player,
  Position,
  Vector3,
  Rotation,
  GameMode,

  // Events
  EventEmitter,

  // Errors
  ProtocolError,
  CompressionError,
  EncryptionError,

  // Constants
  Versions,
  States,
};

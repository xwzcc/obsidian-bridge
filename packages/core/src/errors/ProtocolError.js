/**
 * Custom error classes for Obsidian Bridge
 *
 * @module error/ProtocolError
 */

/**
 * Base protocol error
 */

class ProtocolError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "ProtocolError";
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Compression error
 */

class CompressionError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "CompressionError";
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Encryption error
 */

class EncryptionError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "EncryptionError";
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Packet error
 */

class PacketError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "PacketError";
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  ProtocolError,
  CompressionError,
  EncryptionError,
  PacketError,
};

// Base
const Packet = require("./base/Packet.js");
const PacketRegistry = require("./base/PacketRegistry.js");

// Connection
const Framer = require("./connection/Framer.js");
const Compression = require("./connection/Compression.js");

// Client
const JavaClient = require("./client/JavaClient.js");

// Packets - Handshake
const HandshakePacket = require("./packets/handshake/Handshake.js");

// Packets - Login
const LoginStartPacket = require("./packets/login/LoginStart.js");
const LoginSuccesPacket = require("./packets/login/LoginSucces.js");
const SetCompressionPacket = require("./packets/login/SetCompression.js");

// Packets - Configuration
const ClientInformationPacket = require("./packets/configuration/ClientInformation.js");
const FinishConfigurationPacket = require("./packets/configuration/FinishConfiguration.js");
const KeepAliveConfigurationPacket = require("./packets/configuration/KeepAlive.js");
const RegistryDataPacket = require("./packets/configuration/RegistryData.js");
const ServerboundKnownPacksPacket = require("./packets/configuration/KnownPacks.js");

// Packets - Play Clientbound
const LoginPlayPacket = require("./packets/play/clientbound/LoginPlay.js");
const SynchronizePlayerPositionPacket = require("./packets/play/clientbound/SynchronizePlayerPosition.js");
const KeepAlivePlayPacket = require("./packets/play/clientbound/KeepAlive.js");
const SystemChatMessagePacket = require("./packets/play/clientbound/SystemChatMessage.js");
const DisconnectPlayPacket = require("./packets/play/clientbound/Disconnect.js");

// Packets - Play Serverbound
const ConfirmTeleportationPacket = require("./packets/play/serverbound/ConfirmTeleportation.js");
const SetPlayerPositionPacket = require("./packets/play/serverbound/SetPlayerPosition.js");
const KeepAlivePlayServerboundPacket = require("./packets/play/serverbound/KeepAlive.js");
const ChatMessagePacket = require("./packets/play/serverbound/ChatMessage.js");

module.exports = {
  // Base
  Packet,
  PacketRegistry,
  // Connection
  Framer,
  Compression,
  // Client
  JavaClient,
  // Packets - Handshake
  HandshakePacket,
  // Packets - Login
  LoginStartPacket,
  SetCompressionPacket,
  // Packets - Configuration
  ClientInformationPacket,
  FinishConfigurationPacket,
  KeepAliveConfigurationPacket,
  RegistryDataPacket,
  // Packets - Play Clientbound
  LoginPlayPacket,
  LoginSuccesPacket,
  SynchronizePlayerPositionPacket,
  KeepAlivePlayPacket,
  SystemChatMessagePacket,
  DisconnectPlayPacket,
  // Packets - Play Serverbound
  ConfirmTeleportationPacket,
  SetPlayerPositionPacket,
  KeepAlivePlayServerboundPacket,
  ChatMessagePacket,
};

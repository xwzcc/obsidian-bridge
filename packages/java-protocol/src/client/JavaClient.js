const net = require("net");
const { EventEmitter } = require("events");
const {
  UUID,
  Position,
  Rotation,
  Player,
  GameMode,
} = require("../../../core/src");
const Framer = require("../connection/Framer");
const Compression = require("../connection/Compression");
const HandshakePacket = require("../packets/handshake/Handshake");
const LoginStartPacket = require("../packets/login/LoginStart");
const LoginSuccesPacket = require("../packets/login/LoginSucces");
const LoginAcknowledgedPacket = require("../packets/login/LoginAcknowledged");
const ClientInformationPacket = require("../packets/configuration/ClientInformation");
const SetCompressionPacket = require("../packets/login/SetCompression");
const KeepAliveConfigurationPacket = require("../packets/configuration/KeepAlive");
const ServerboundKnownPacksPacket = require("../packets/configuration/KnownPacks");
const AcknowledgedFinishConfigurationPacket = require("../packets/configuration/AcknowledgedFinishConfiguration");
const LoginPlayPacket = require("../packets/play/clientbound/LoginPlay");
const SynchronizePlayerPositionPacket = require("../packets/play/clientbound/SynchronizePlayerPosition");
const ConfirmTeleportationPacket = require("../packets/play/serverbound/ConfirmTeleportation");
const KeepAlivePacket = require("../packets/play/clientbound/KeepAlive");
const KeepAlivePlayServerboundPacket = require("../packets/play/serverbound/KeepAlive");
const SystemChatMessagePacket = require("../packets/play/clientbound/SystemChatMessage");
const DisconnectPlayPacket = require("../packets/play/clientbound/Disconnect");
const SetPlayerPositionPacket = require("../packets/play/serverbound/SetPlayerPosition");
const ChatMessagePacket = require("../packets/play/serverbound/ChatMessage");
const ChunkDataPacket = require("../packets/play/clientbound/ChunkData");

const STATE = {
  DISCONNECTED: "DISCONNECTED",
  HANDSHAKE: "HANDSHAKE",
  LOGIN: "LOGIN",
  CONFIGURATION: "CONFIGURATION",
  PLAY: "PLAY",
};

class JavaClient extends EventEmitter {
  constructor(options = {}) {
    super();
    this.host = options.host || "localhost";
    this.port = options.port || 25565;
    this.player = new Player({
      username: options.username || "ObsidianPlayer",
      uuid: options.uuid || UUID.generate(),
      position: new Position(0, 0, 0),
      rotation: new Rotation(0, 0),
      gameMode: GameMode.SURVIVAL,
    });
    this.socket = null;
    this.state = STATE.DISCONNECTED;
    this.framer = new Framer();
    this.compression = new Compression();
    this.gravityInterval = null;
    this.velocity = 0;
    this.onGround = false;
    this.justTeleported = false;
    this.chatMessageCount = 0;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.socket = net.connect(this.port, this.host);
      this.socket.on("connect", () => {
        this.#sendHandshake();
        resolve();
      });
      this.socket.on("data", (data) => {
        try {
          this.#handleData(data);
        } catch (err) {
          this.emit("error", err);
        }
      });
      this.socket.on("end", () => {
        this.state = STATE.DISCONNECTED;
        this.emit("disconnect");
      });
      this.socket.on("close", () => {});
      this.socket.on("error", (err) => {
        this.emit("error", err);
        reject(err);
      });
    });
  }

  disconnect() {
    if (this.gravityInterval) clearInterval(this.gravityInterval);
    if (this.socket) this.socket.end();
    this.state = STATE.DISCONNECTED;
  }

  #sendHandshake() {
    const packet = new HandshakePacket();
    packet.protocolversion = 773;
    packet.serverAddress = this.host;
    packet.serverPort = this.port;
    packet.nextState = 2;
    this.#sendPacket(packet.encode());
    this.state = STATE.LOGIN;
    this.#sendLoginStart();
  }

  #sendLoginStart() {
    const packet = new LoginStartPacket();
    packet.username = this.player.username;
    packet.uuid = this.player.uuid;
    this.#sendPacket(packet.encode());
  }

  #handleData(data) {
    const packets = this.framer.frame(data);
    for (const packetBuffer of packets) {
      let decompressed = packetBuffer;
      if (this.compression.isEnabled()) {
        decompressed = this.compression.decompress(packetBuffer);
      }
      this.#handlePacket(decompressed);
    }
  }

  #handlePacket(buffer) {
    let packetId = 0;
    let offset = 0;
    let shift = 0;
    while (true) {
      const byte = buffer.readUInt8(offset++);
      packetId |= (byte & 0x7f) << shift;
      if ((byte & 0x80) === 0) break;
      shift += 7;
    }
    try {
      switch (this.state) {
        case STATE.LOGIN:
          this.#handleLogin(packetId, buffer);
          break;
        case STATE.CONFIGURATION:
          this.#handleConfiguration(packetId, buffer);
          break;
        case STATE.PLAY:
          this.#handlePlay(packetId, buffer);
          break;
      }
      this.emit("packet", { id: packetId, buffer });
    } catch (err) {}
  }

  #handleLogin(packetId, buffer) {
    if (packetId === 0x02) {
      const packet = new LoginSuccesPacket().decode(buffer);
      const ack = new LoginAcknowledgedPacket();
      this.#sendPacket(ack.encode());
      this.state = STATE.CONFIGURATION;
      const clientInfo = new ClientInformationPacket();
      this.#sendPacket(clientInfo.encode());
      this.emit("login_success", packet);
    } else if (packetId === 0x03) {
      const packet = new SetCompressionPacket().decode(buffer);
      this.compression.enable(packet.threshold);
    }
  }

  #handleConfiguration(packetId, buffer) {
    if (packetId === 0x0e) {
      const response = new ServerboundKnownPacksPacket();
      this.#sendPacket(response.encode());
    } else if (packetId === 0x04) {
      const packet = new KeepAliveConfigurationPacket().decode(buffer);
      const response = new KeepAliveConfigurationPacket();
      response.keepAliveId = packet.keepAliveId;
      this.#sendPacket(response.encode());
    } else if (packetId === 0x03) {
      this.state = STATE.PLAY;
      const ack = new AcknowledgedFinishConfigurationPacket();
      this.#sendPacket(ack.encode());
    }
  }

  #handlePlay(packetId, buffer) {
    if (packetId === 0x30) {
      try {
        const packet = new LoginPlayPacket().decode(buffer);
        this.player.entityId = packet.entityId;
        this.player.gameMode = packet.gameMode;
        this.emit("play_login", packet);
      } catch (err) {}
    } else if (packetId === 0x46) {
      const packet = new SynchronizePlayerPositionPacket().decode(buffer);
      this.player.position.x = packet.x;
      this.player.position.y = packet.y;
      this.player.position.z = packet.z;
      this.player.rotation.yaw = packet.yaw;
      this.player.rotation.pitch = packet.pitch;
      this.velocity = 0;
      this.onGround = false;
      const confirm = new ConfirmTeleportationPacket();
      confirm.teleportId = packet.teleportId;
      this.#sendPacket(confirm.encode());
      if (!this.gravityInterval) {
        this.#startGravityLoop();
      }
      this.emit("position", packet);
    } else if (packetId === 0x2c) {
      try {
        const packet = new ChunkDataPacket().decode(buffer);
        this.emit("chunk_data", packet);
      } catch (err) {}
    } else if (packetId === 0x2b) {
      try {
        const packet = new KeepAlivePacket().decode(buffer);
        const response = new KeepAlivePlayServerboundPacket();
        response.keepAliveId = packet.keepAliveId;
        const encoded = response.encode();
        this.#sendPacket(encoded);
      } catch (err) {}
    } else if (packetId === 0x77) {
      const packet = new SystemChatMessagePacket().decode(buffer);
      this.emit("chat", packet);
    } else if (packetId === 0x20) {
      const packet = new DisconnectPlayPacket().decode(buffer);
      this.disconnect();
      this.emit("kicked", packet);
    }
  }

  #startGravityLoop() {
    if (this.gravityInterval) clearInterval(this.gravityInterval);
    let ticksSinceLastUpdate = 0;
    this.gravityInterval = setInterval(() => {
      if (this.state !== STATE.PLAY) return;
      const pos = this.player.position;
      if (this.justTeleported) {
        this.justTeleported = false;
      }
      ticksSinceLastUpdate++;
      const groundLevel = 87.0;
      const heightAboveGround = pos.y - groundLevel;
      if (heightAboveGround <= 0.01) {
        this.onGround = true;
        this.velocity = 0;
        if (ticksSinceLastUpdate >= 20) {
          this.sendPosition(pos.x, groundLevel, pos.z, true);
          ticksSinceLastUpdate = 0;
        }
        return;
      }
      this.onGround = false;
      this.velocity -= 0.08;
      this.velocity *= 0.98;
      if (this.velocity < -3.92) {
        this.velocity = -3.92;
      }
      let newY = pos.y + this.velocity;
      if (newY <= groundLevel) {
        newY = groundLevel;
        this.velocity = 0;
        this.onGround = true;
      }
      this.sendPosition(pos.x, newY, pos.z, this.onGround);
      ticksSinceLastUpdate = 0;
    }, 50);
  }

  #sendPacket(buffer) {
    if (this.compression.isEnabled())
      buffer = this.compression.compress(buffer);
    const framed = Framer.frame(buffer);
    this.socket.write(framed);
  }

  sendChatMessage(message) {
    if (this.state !== STATE.PLAY) {
      throw new Error("Not in play state");
    }
    const packet = new ChatMessagePacket();
    packet.message = message;
    packet.timestamp = BigInt(Date.now());
    packet.messageCount = this.chatMessageCount;
    this.chatMessageCount++;
    this.#sendPacket(packet.encode());
  }

  sendPosition(x, y, z, onGround = false) {
    if (this.state !== STATE.PLAY) return;
    const packet = new SetPlayerPositionPacket();
    packet.x = x;
    packet.feetY = y;
    packet.z = z;
    packet.onGround = onGround;
    this.#sendPacket(packet.encode());
    this.player.position.x = x;
    this.player.position.y = y;
    this.player.position.z = z;
  }

  getPlayer() {
    return this.player;
  }
}

module.exports = JavaClient;

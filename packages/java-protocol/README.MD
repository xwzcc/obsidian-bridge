# @obsidian-bridge/java-protocol

<p align="center">
  <img src="https://img.shields.io/npm/v/@obsidian-bridge/java-protocol" alt="npm version">
  <img src="https://img.shields.io/npm/l/@obsidian-bridge/java-protocol" alt="license">
  <img src="https://img.shields.io/node/v/@obsidian-bridge/java-protocol" alt="node version">
</p>

# ⚠️ WARNING: EARLY BETA VERSION

This package is currently in **early beta** and under active development.

**Known limitations:**

- Only Minecraft 1.21.10 (protocol 773) is supported
- Limited packet implementation - only core gameplay packets
- API is unstable and subject to breaking changes
- Minimal test coverage
- Many advanced features not yet implemented
- No encryption support (offline-mode servers only)
- Documentation is incomplete

**Not recommended for production use.** Use at your own risk.

Minecraft Java Edition protocol implementation for **Obsidian Bridge**. Provides low-level protocol handling, packet encoding/decoding, and a functional client implementation for connecting to Java Edition servers.

## 🚀 Currently Implemented Features

### ✅ Connection & Authentication

- **Handshake** - Initial server connection
- **Login** - Username and UUID authentication
- **Compression** - Packet compression support (threshold-based)
- **Configuration Phase** - Modern 1.21.3 configuration state
- **Known Packs** - Data pack negotiation

### ✅ Gameplay (PLAY State)

- **Player Spawning** - Receive entity ID, game mode, dimension
- **Position Synchronization** - Server teleportation handling
- **Movement** - Send player position updates
- **Gravity Simulation** - Basic physics (falling, ground detection)
- **Keep Alive** - Connection maintenance packets
- **Chat Messages** - Send chat messages to server (receive support partial)

### ✅ Core Infrastructure

- **Packet Framing** - Length-prefixed packet handling
- **Compression** - Zlib compression/decompression
- **BufferReader/Writer** - Efficient packet encoding/decoding
- **Event System** - Event-driven architecture for packet handling

## 📦 Installation

```bash
npm install @obsidian-bridge/java-protocol @obsidian-bridge/core
```

## 🎮 Quick Start - JavaClient

```javascript
const { JavaClient } = require("@obsidian-bridge/java-protocol");

// Create client
const client = new JavaClient({
  host: "localhost",
  port: 25565,
  username: "Player123",
});

// Listen for events
client.on("login_success", (packet) => {
  console.log(`Logged in as: ${packet.username}`);
});

client.on("play_login", (packet) => {
  console.log(`Spawned! Entity ID: ${packet.entityId}`);
  console.log(`Game mode: ${packet.gameMode}`);
  console.log(`Dimension: ${packet.dimensionName}`);
});

client.on("position", (packet) => {
  console.log(`Position: ${packet.x}, ${packet.y}, ${packet.z}`);
});

client.on("chat", (packet) => {
  console.log(`Chat: ${packet.content}`);
});

// Connect to server
await client.connect();

// Send chat message
client.sendChatMessage("Hello from JavaClient!");

// Send position update
client.sendPosition(100, 64, 200, true);

// Get player info
const player = client.getPlayer();
console.log(player.position); // Current position
console.log(player.entityId); // Entity ID
```

## 📚 API Documentation

### JavaClient

Main client class for connecting to Minecraft Java Edition servers.

#### Constructor Options

```javascript
new JavaClient({
  host: string,      // Server hostname (default: 'localhost')
  port: number,      // Server port (default: 25565)
  username: string,  // Player username (default: 'ObsidianPlayer')
  uuid?: string      // Player UUID (auto-generated if not provided)
})
```

#### Methods

**connect(): Promise<void>**

- Connects to the server and initiates login sequence
- Returns promise that resolves when connection is established

**disconnect(): void**

- Disconnects from server and cleans up resources

**sendChatMessage(message: string): void**

- Sends a chat message to the server
- Max length: 256 characters
- Throws error if not in PLAY state

**sendPosition(x: number, y: number, z: number, onGround: boolean): void**

- Sends player position update to server
- Automatically called by gravity simulation
- Throws error if not in PLAY state

**getPlayer(): Player**

- Returns current player object with position, rotation, entity ID, game mode

#### Events

**'login_success'** - `(packet) => void`

- Fired when login is successful
- Packet contains: `username`, `uuid`

**'play_login'** - `(packet) => void`

- Fired when entering PLAY state
- Packet contains: `entityId`, `gameMode`, `dimensionName`, `viewDistance`

**'position'** - `(packet) => void`

- Fired when server sends position update (teleport)
- Packet contains: `x`, `y`, `z`, `yaw`, `pitch`, `teleportId`

**'chat'** - `(packet) => void`

- Fired when server sends chat message
- Packet contains: `content` (JSON string)

**'kicked'** - `(packet) => void`

- Fired when disconnected by server
- Packet contains: `reason` (JSON string)

**'disconnect'** - `() => void`

- Fired when connection closes

**'error'** - `(error) => void`

- Fired on connection or protocol errors

**'packet'** - `({id, buffer}) => void`

- Fired for every received packet (for debugging)

## 🔧 Advanced Usage

### Custom Packet Handling

```javascript
const { JavaClient } = require("@obsidian-bridge/java-protocol");

const client = new JavaClient({
  host: "play.example.com",
  port: 25565,
  username: "CustomBot",
});

// Listen for raw packets
client.on("packet", ({ id, buffer }) => {
  console.log(`Received packet 0x${id.toString(16)}: ${buffer.length} bytes`);
});

// Handle specific game events
client.on("play_login", (packet) => {
  console.log("Spawned in world!");

  // Wait 5 seconds then send chat
  setTimeout(() => {
    client.sendChatMessage("Bot is online!");
  }, 5000);
});

client.on("position", (packet) => {
  const player = client.getPlayer();
  console.log(
    `Teleported to: ${player.position.x}, ${player.position.y}, ${player.position.z}`,
  );

  // Gravity simulation will automatically handle falling
});

await client.connect();
```

### Gravity Simulation

The client includes automatic gravity simulation:

```javascript
// Gravity is automatically enabled after receiving initial position
// Physics constants:
// - Gravity: -0.08 blocks/tick²
// - Air resistance: 0.98
// - Terminal velocity: -3.92 blocks/tick
// - Ground level: Auto-detected from spawn position

// Position updates are sent automatically when:
// 1. Player is falling (every tick)
// 2. Player is on ground (every 20 ticks)

// Access current physics state
const player = client.getPlayer();
console.log(`Y position: ${player.position.y}`);
console.log(`On ground: ${client.onGround}`);
console.log(`Velocity: ${client.velocity}`);
```

## 🧪 Testing

```bash
# Run basic connection test
npm test

# Example test script
node examples/connect.js
```

## 🔍 Debugging

Enable debug logging for packet traces:

```javascript
const client = new JavaClient({
  host: "localhost",
  port: 25565,
  username: "DebugBot",
});

// Log all packets
client.on("packet", ({ id, buffer }) => {
  console.log(
    `[PACKET] 0x${id.toString(16).padStart(2, "0")} (${buffer.length} bytes)`,
  );
});

// Log all errors
client.on("error", (err) => {
  console.error("[ERROR]", err);
});
```

## 📝 Protocol Version Support

| Minecraft Version | Protocol | Status           |
| ----------------- | -------- | ---------------- |
| 1.21.10           | 773      | ✅ Supported     |
| 1.21.2            | 772      | ❌ Not supported |
| 1.21.1            | 767      | ❌ Not supported |
| Earlier versions  | < 767    | ❌ Not supported |

## 🐛 Known Issues

- Chat message encoding may not work with all chat modes
- Gravity simulation uses simplified physics (no block collision)
- Some servers may kick the client for "Invalid packet" errors
- Chunk data is not parsed (world is invisible to client)
- No support for online-mode servers (encryption required)

## 🤝 Contributing

Contributions are welcome! This package is in early development and needs:

- Additional packet implementations
- Test coverage
- Bug fixes
- Documentation improvements
- Example scripts

Please read our [Contributing Guide](../../CONTRIBUTING.md).

## 📄 License

MIT © xwzcc

## 🔗 Related Packages

- [@obsidian-bridge/core](../core) - Core utilities and types
- [@obsidian-bridge/bedrock-protocol](../bedrock-protocol) - Bedrock Edition protocol
- [@obsidian-bridge/bridge-server](../bridge-server) - Complete bridge server

/**
 * Test JavaClient - Complete test with all events
 */

const { JavaClient } = require("./src/index.js");
const { GameMode } = require("@obsidian-bridge/core");
const { World, ChunkDecoder } = require("@obsidian-bridge/world");

console.log("=".repeat(60));
console.log("🚀 Obsidian Bridge - JavaClient Test");
console.log("=".repeat(60));
console.log();

// Create client
const client = new JavaClient({
  host: "mc.xwzcc.xyz",
  port: 25565,
  username: "12131",
});

const world = new World("test-world");

// Track connection state
let connected = false;
let inGame = false;

/**
 * Handles error events from the client.
 * Logs the error and exits the process.
 * @param {Error} err - The error object
 */
client.on("error", (err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});

/**
 * Handles disconnect events from the client.
 * Logs the disconnect and updates state.
 */
client.on("disconnect", () => {
  console.log("📡 Disconnected from server");
  connected = false;
  inGame = false;
});

/**
 * Handles kicked events from the client.
 * Logs the kick reason and exits the process.
 * @param {Object} packet - The disconnect packet
 */
client.on("kicked", (packet) => {
  try {
    const reason = JSON.parse(packet.reason);
    console.log(`Kicked: ${reason.text || JSON.stringify(reason)}`);
  } catch (e) {
    console.log(`Kicked: ${packet.reason}`);
  }
  process.exit(0);
});

/**
 * Handles login success events.
 * Logs the username and UUID.
 * @param {Object} packet - The login success packet
 */
client.on("login_success", (packet) => {
  console.log("✅ Login successful!");
  console.log(`   Username: ${packet.username}`);
  console.log(`   UUID: ${packet.uuid}`);
  console.log();
});

client.on("chunk_data", (packet) => {
  const column = ChunkDecoder.decode(packet);
  world.setChunkColumn(packet.chunkX, packet.chunkZ, column);

  console.log(`📦 Loaded chunk: ${column.toString()}`);
  console.log(`   Total chunks: ${world.getLoadedChunksCount()}`);

  const block = world.getBlock(packet.chunkX * 16, 64, packet.chunkZ * 16);
  if (block) {
    console.log(
      `   Block at (${packet.chunkX * 16}, 64, ${packet.chunkZ * 16}): ${block.toString()}`,
    );
  }
});

/**
 * Handles play login events.
 * Logs player and game state info.
 * @param {Object} packet - The play login packet
 */
client.on("play_login", (packet) => {
  console.log("✅ Entered PLAY state!");
  console.log(`   Entity ID: ${packet.entityId}`);
  console.log(`   Game Mode: ${GameMode.getName(packet.gameMode)}`);
  console.log(`   Dimension: ${packet.dimensionName}`);
  console.log(`   View Distance: ${packet.viewDistance}`);
  console.log(`   Simulation Distance: ${packet.simulationDistance}`);
  console.log();

  const player = client.getPlayer();
  console.log("👤 Player Info:");
  console.log(`   Username: ${player.username}`);
  console.log(`   UUID: ${player.uuid}`);
  console.log(`   Entity ID: ${player.entityId}`);
  console.log(`   Game Mode: ${GameMode.getName(player.gameMode)}`);
  console.log();

  try {
    client.sendChatMessage("aRKA gdynia kurwa świnia");
    console.log("📤 Chat message sent!");
  } catch (err) {
    console.error("❌ Failed to send chat:", err.message);
  }

  inGame = true;
});

/**
 * Handles position update events.
 * Logs the player's position and rotation.
 * @param {Object} packet - The position update packet
 */
client.on("position", (packet) => {
  const player = client.getPlayer();

  console.log("📍 Position Update:");
  console.log(`   X: ${player.position.x.toFixed(2)}`);
  console.log(`   Y: ${player.position.y.toFixed(2)}`);
  console.log(`   Z: ${player.position.z.toFixed(2)}`);
  console.log(`   Yaw: ${player.rotation.yaw.toFixed(2)}°`);
  console.log(`   Pitch: ${player.rotation.pitch.toFixed(2)}°`);
  console.log();
});

/**
 * Handles chat events.
 * Logs chat messages from the server.
 * @param {Object} packet - The chat packet
 */
client.on("chat", (packet) => {
  try {
    const content = JSON.parse(packet.content);
    const text = content.text || JSON.stringify(content);
    console.log(`💬 Chat: ${text}`);
  } catch (e) {
    console.log(`💬 Chat: ${packet.content}`);
  }
});

// === PACKET LOGGING (Optional, uncomment to see all packets) ===
/**
 * Logs every packet received from the server.
 * Useful for debugging protocol issues.
 * @param {Object} packet - The packet info
 */
// client.on("packet", ({ id, buffer }) => {
//   console.log(
//     `📦 Packet: 0x${id.toString(16).padStart(2, "0")} (${buffer.length} bytes)`,
//   );
// });

/**
 * Initiates connection to the Minecraft server.
 * Logs connection info and waits for login.
 */
console.log("📡 Connecting to server...");
console.log(`   Host: ${client.host}`);
console.log(`   Port: ${client.port}`);
console.log(`   Username: ${client.player.username}`);
console.log();

try {
  client.connect();
  connected = true;

  console.log("✅ Connection established!");
  console.log("   Waiting for login...");
  console.log();
} catch (err) {
  console.error("❌ Connection failed:", err.message);
  process.exit(1);
}

/**
 * Waits until the client is in game and has a valid position.
 * Then runs test actions.
 */
(async () => {
  await new Promise((resolve) => {
    const check = setInterval(() => {
      const player = client.getPlayer();
      if (inGame && player.position.x !== 0) {
        clearInterval(check);
        resolve();
      }
    }, 100);
  });

  console.log("=".repeat(60));
  console.log("🎮 In Game - Running Tests");
  console.log("=".repeat(60));
  console.log();

  await new Promise((resolve) => setTimeout(resolve, 3000));
})();

/**
 * Handles Ctrl+C (SIGINT) to exit gracefully.
 */
process.on("SIGINT", () => {
  console.log("\n");
  console.log("⚠️  Interrupted by user");
  process.exit();
});

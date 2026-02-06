# @obsidian-bridge/core

<p align="center">
  <img src="https://img.shields.io/npm/v/@obsidian-bridge/core" alt="npm version">
  <img src="https://img.shields.io/npm/l/@obsidian-bridge/core" alt="license">
  <img src="https://img.shields.io/node/v/@obsidian-bridge/core" alt="node version">
</p>

# ⚠️ WARNING: BETA VERSION

This package is currently in **beta** and under active development.

**Known limitations:**

- API is unstable and may change without notice
- Test coverage is incomplete - some tests may fail
- Features are experimental and not fully tested
- Breaking changes may occur between beta versions

**Not recommended for production use.** Use at your own risk.

Core utilities and types for **Obsidian** - A powerful Minecraft Java ↔ Bedrock Edition protocol bridge.

This package provides low-level utilities for encoding/decoding Minecraft protocol data types, cryptographic functions, and universal types used across both Java and Bedrock editions.

## 🚀 Features

- ✅ **VarInt/VarLong** - Variable-length integer encoding/decoding
- ✅ **UUID** - Generation, parsing, and offline UUID support
- ✅ **Buffer Helpers** - Read/write all Minecraft data types
- ✅ **MCString** - Minecraft string format (VarInt length + UTF-8)
- ✅ **Cryptography** - SHA-1, SHA-256, AES encryption
- ✅ **Vector3** - Complete 3D vector mathematics
- ✅ **Zero Dependencies** - Only Node.js built-ins
- ✅ **100% Test Coverage** - Comprehensive test suite

## 📦 Installation

```bash
npm install @obsidian-bridge/core
```

## 📚 API Documentation

### VarInt

Variable-length integer encoding used in Minecraft Java Edition protocol. Encodes 32-bit integers using 1-5 bytes.

```javascript
const { VarInt } = require("@obsidian-bridge/core");

// Encode
const encoded = VarInt.encode(300);
console.log(encoded); // <Buffer ac 02>

// Decode
const { value, bytesRead } = VarInt.decode(encoded);
console.log(value); // 300
console.log(bytesRead); // 2

// Get length without encoding
console.log(VarInt.getLength(300)); // 2
```

**Methods:**

- `VarInt.encode(value: number): Buffer` - Encodes a 32-bit integer to VarInt format (-2147483648 to 2147483647)
- `VarInt.decode(buffer: Buffer, offset?: number): {value: number, bytesRead: number}` - Decodes VarInt from buffer
- `VarInt.getLength(value: number): number` - Calculates the byte length of encoded VarInt

**Error handling:**

- Throws `RangeError` if value is out of int32 range
- Throws `Error` if VarInt extends beyond buffer or is too large (>5 bytes)

---

### VarLong

Variable-length long encoding using zigzag encoding. Encodes 64-bit BigInt values using 1-10 bytes.

```javascript
const { VarLong } = require("@obsidian-bridge/core");

// Encode
const encoded = VarLong.encode(123456789n);
console.log(encoded);

// Decode
const { value, bytesRead } = VarLong.decode(encoded);
console.log(value); // 123456789n (BigInt)

// Works with numbers too
const encoded2 = VarLong.encode(12345);

// Get length
console.log(VarLong.getLength(123456789n)); // Number of bytes
```

**Methods:**

- `VarLong.encode(value: bigint | number): Buffer` - Encodes BigInt to VarLong with zigzag encoding
- `VarLong.decode(buffer: Buffer, offset?: number): {value: bigint, bytesRead: number}` - Decodes VarLong from buffer
- `VarLong.getLength(value: bigint | number): number` - Calculates the byte length

**Zigzag encoding:** Efficiently encodes signed integers by mapping negative values to positive ones:

- `0` → `0`, `1` → `2`, `-1` → `1`, `2` → `4`, `-2` → `3`, etc.

---

### UUID

UUID utilities for generating, validating, and converting UUIDs in Minecraft format.

```javascript
const { UUID } = require("@obsidian-bridge/core");

// Generate random UUID v4
const uuid = UUID.generate();
console.log(uuid); // "550e8400-e29b-41d4-a716-446655440000"

// Validate UUID
console.log(UUID.isValid(uuid)); // true
console.log(UUID.isValid("invalid")); // false

// Convert to buffer (16 bytes)
const buffer = UUID.toBuffer(uuid);
console.log(buffer.length); // 16

// Convert back from buffer
const restored = UUID.fromBuffer(buffer);
console.log(restored === uuid); // true

// Generate offline UUID (for offline-mode servers)
const offlineUuid = UUID.offlineUUID("Notch");
console.log(offlineUuid); // "069a79f4-44e9-4726-a5be-fca90e38aaf5"
// Always generates the same UUID for the same username
```

**Methods:**

- `UUID.generate(): string` - Generates random UUID v4
- `UUID.isValid(uuid: string): boolean` - Validates UUID format
- `UUID.toBuffer(uuid: string): Buffer` - Converts UUID string to 16-byte buffer
- `UUID.fromBuffer(buffer: Buffer): string` - Converts 16-byte buffer to UUID string
- `UUID.offlineUUID(username: string): string` - Generates deterministic offline-mode UUID

**Notes:**

- Offline UUIDs are generated using MD5 hash of "OfflinePlayer:{username}"
- Case-sensitive for offline UUIDs
- Accepts both uppercase and lowercase UUID strings

---

### MCString

Minecraft string format encoder/decoder. Format: VarInt(length) + UTF-8 bytes.

```javascript
const { MCString } = require("@obsidian-bridge/core");

// Encode
const encoded = MCString.encode("Hello World!");
// First bytes are VarInt length, followed by UTF-8 string

// Decode
const { value, bytesRead } = MCString.decode(encoded);
console.log(value); // "Hello World!"
console.log(bytesRead); // Total bytes read (VarInt + string)

// Decode with offset
const buffer = Buffer.concat([Buffer.from([0xff, 0xff]), encoded]);
const result = MCString.decode(buffer, 2);

// Custom max length (default: 32767)
const longStr = "A".repeat(1000);
const encoded2 = MCString.encode(longStr, 2000); // OK
// MCString.encode(longStr, 500); // Throws Error

// UTF-8 support (including emoji)
const utf8Str = "Hello 🎮 Cześć 日本語";
const encoded3 = MCString.encode(utf8Str);
const decoded3 = MCString.decode(encoded3);
console.log(decoded3.value); // "Hello 🎮 Cześć 日本語"
```

**Methods:**

- `MCString.encode(str: string, maxLength?: number): Buffer` - Encodes string to MC format (default max: 32767)
- `MCString.decode(buffer: Buffer, offset?: number): {value: string, bytesRead: number}` - Decodes string from buffer

**Features:**

- Full UTF-8 support (including emojis and special characters)
- Efficient encoding with VarInt length prefix
- Configurable maximum length

---

### BufferHelpers

Utilities for reading and writing all Minecraft data types from/to buffers. All methods use Big Endian byte order.

```javascript
const { BufferHelpers } = require("@obsidian-bridge/core");

// Write operations (all return Buffer)
BufferHelpers.writeBoolean(true); // 1 byte
BufferHelpers.writeByte(42); // 1 byte (signed: -128 to 127)
BufferHelpers.writeUByte(255); // 1 byte (unsigned: 0 to 255)
BufferHelpers.writeShort(12345); // 2 bytes (signed: -32768 to 32767)
BufferHelpers.writeUShort(65535); // 2 bytes (unsigned: 0 to 65535)
BufferHelpers.writeInt(123456789); // 4 bytes
BufferHelpers.writeUInt(4294967295); // 4 bytes
BufferHelpers.writeLong(123456789n); // 8 bytes (BigInt)
BufferHelpers.writeULong(18446744073709551615n); // 8 bytes
BufferHelpers.writeFloat(3.14159); // 4 bytes
BufferHelpers.writeDouble(2.718281828459045); // 8 bytes

// Read operations (all return {value, bytesRead})
const intBuffer = BufferHelpers.writeInt(12345);
const { value, bytesRead } = BufferHelpers.readInt(intBuffer, 0);
console.log(value); // 12345
console.log(bytesRead); // 4

// Example: Building a packet
const packet = Buffer.concat([
  BufferHelpers.writeInt(12345),
  BufferHelpers.writeFloat(3.14159),
  BufferHelpers.writeBoolean(true),
  BufferHelpers.writeDouble(2.71828),
]);

// Example: Reading a packet
let offset = 0;
const { value: intVal, bytesRead: intBytes } = BufferHelpers.readInt(
  packet,
  offset,
);
offset += intBytes;

const { value: floatVal, bytesRead: floatBytes } = BufferHelpers.readFloat(
  packet,
  offset,
);
offset += floatBytes;

const { value: boolVal, bytesRead: boolBytes } = BufferHelpers.readBoolean(
  packet,
  offset,
);
offset += boolBytes;

// Utility methods
BufferHelpers.concat(buf1, buf2, buf3); // Concatenate multiple buffers
BufferHelpers.clone(buffer); // Clone a buffer
```

**Available Types:**

- Boolean (1 byte): `true` = 1, `false` = 0
- Byte (1 byte, signed): -128 to 127
- UByte (1 byte, unsigned): 0 to 255
- Short (2 bytes, signed): -32768 to 32767
- UShort (2 bytes, unsigned): 0 to 65535
- Int (4 bytes, signed): -2147483648 to 2147483647
- UInt (4 bytes, unsigned): 0 to 4294967295
- Long (8 bytes, BigInt): -9223372036854775808n to 9223372036854775807n
- ULong (8 bytes, BigInt): 0n to 18446744073709551615n
- Float (4 bytes): IEEE 754 single precision
- Double (8 bytes): IEEE 754 double precision

**All methods:**

- Read: `read<Type>(buffer: Buffer, offset?: number): {value: any, bytesRead: number}`
- Write: `write<Type>(value: any): Buffer`
- All use Big Endian byte order (network byte order)

---

### Crypto

Cryptographic utilities for Minecraft protocol encryption and authentication.

```javascript
const { Crypto } = require("@obsidian-bridge/core");

// Generate 16-byte AES shared secret
const secret = Crypto.generateSharedSecret();
console.log(secret.length); // 16

// SHA-1 hash
const hash1 = Crypto.sha1("Hello World");
console.log(hash1); // Buffer

// SHA-256 hash
const hash256 = Crypto.sha256("Hello World");
console.log(hash256); // Buffer

// Minecraft-style SHA-1 (signed hex)
// Used for server authentication with Mojang
const mcHash = Crypto.minecraftSha1(Buffer.from("test"));
console.log(mcHash); // "4e1243bd22c66e76c2ba9eddc1f91394e57f9f83"

// Create AES/CFB8 cipher for packet encryption
const cipher = Crypto.createCipher(secret);
const encrypted = cipher.update(Buffer.from("Hello"));

// Create AES/CFB8 decipher for packet decryption
const decipher = Crypto.createDecipher(secret);
const decrypted = decipher.update(encrypted);
console.log(decrypted.toString()); // "Hello"
```

**Methods:**

- `Crypto.generateSharedSecret(): Buffer` - Generates 16-byte random AES key
- `Crypto.sha1(data: Buffer | string): Buffer` - Computes SHA-1 hash
- `Crypto.sha256(data: Buffer | string): Buffer` - Computes SHA-256 hash
- `Crypto.minecraftSha1(data: Buffer): string` - Minecraft-style SHA-1 (signed hex notation)
- `Crypto.createCipher(sharedSecret: Buffer): Cipher` - Creates AES-128-CFB8 cipher
- `Crypto.createDecipher(sharedSecret: Buffer): Decipher` - Creates AES-128-CFB8 decipher

**Notes:**

- Minecraft uses AES/CFB8 encryption for packet encryption after authentication
- The shared secret is used as both the key and IV for AES/CFB8
- minecraftSha1 returns signed hex notation (negative hashes start with `-`)

---

### Vector3

Complete 3D vector implementation with full vector algebra operations.

```javascript
const { Vector3 } = require("@obsidian-bridge/core");

// Create vectors
const a = new Vector3(1, 2, 3);
const b = new Vector3(4, 5, 6);

// Basic operations
const sum = a.add(b); // Vector3(5, 7, 9)
const diff = a.subtract(b); // Vector3(-3, -3, -3)
const scaled = a.multiply(2); // Vector3(2, 4, 6)
const divided = a.divide(2); // Vector3(0.5, 1, 1.5)

// Set values
const v = new Vector3();
v.set(10, 20, 30); // Returns this (chainable)

// Length (magnitude)
const len = a.length(); // Math.sqrt(1² + 2² + 3²) = 3.742
const lenSq = a.lengthSquared(); // 14 (faster, no sqrt)

// Distance
const distance = a.distanceTo(b); // 5.196
const distSq = a.distanceToSquared(b); // 27 (faster)

// Normalize (unit vector)
const normalized = a.normalize(); // Length = 1.0
console.log(normalized.length()); // 1.0

// Dot product
const dot = a.dot(b); // 1*4 + 2*5 + 3*6 = 32

// Cross product (perpendicular vector)
const cross = a.cross(b);
console.log(cross.dot(a)); // ~0 (perpendicular)
console.log(cross.dot(b)); // ~0 (perpendicular)

// Clone
const clone = a.clone(); // Independent copy
clone.set(0, 0, 0);
console.log(a); // Still Vector3(1, 2, 3)

// Serialization
const json = a.toJSON(); // {x: 1, y: 2, z: 3}
const restored = Vector3.fromJSON(json);

// String representation
console.log(a.toString()); // "Vector3(1.00, 2.00, 3.00)"
```

**Constructor:**

- `new Vector3(x?: number, y?: number, z?: number)` - Creates vector (default: 0, 0, 0)

**Methods:**

- `set(x, y, z): this` - Sets values (chainable)
- `add(other: Vector3): Vector3` - Returns new vector (a + b)
- `subtract(other: Vector3): Vector3` - Returns new vector (a - b)
- `multiply(scalar: number): Vector3` - Returns new vector (scalar multiplication)
- `divide(scalar: number): Vector3` - Returns new vector (scalar division)
- `length(): number` - Returns magnitude (√(x² + y² + z²))
- `lengthSquared(): number` - Returns squared magnitude (faster, no sqrt)
- `distanceTo(other: Vector3): number` - Returns distance to other vector
- `distanceToSquared(other: Vector3): number` - Returns squared distance (faster)
- `normalize(): Vector3` - Returns unit vector (length = 1)
- `dot(other: Vector3): number` - Returns dot product (a·b)
- `cross(other: Vector3): Vector3` - Returns cross product (a × b)
- `clone(): Vector3` - Returns independent copy
- `toJSON(): {x, y, z}` - Serializes to JSON
- `static fromJSON(json): Vector3` - Deserializes from JSON
- `toString(): string` - Returns string representation

**Features:**

- All operations return new vectors (immutable)
- Optimized with squared methods to avoid sqrt when possible
- Full 3D vector algebra support
- Useful for positions, velocities, directions, normals, etc.

---

## 🧪 Testing

This package has comprehensive test coverage for all modules.

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**Test files:**

- `tests/utils/varint.test.js` - VarInt encoding/decoding
- `tests/utils/VarLong.test.js` - VarLong encoding/decoding
- `tests/utils/UUID.test.js` - UUID utilities
- `tests/utils/MCString.test.js` - String encoding/decoding
- `tests/utils/BufferHelpers.test.js` - All buffer read/write operations
- `tests/types/Vector3.test.js` - Vector3 algebra operations

## 🔧 Usage Examples

### Complete Packet Example

```javascript
const {
  VarInt,
  MCString,
  BufferHelpers,
  UUID,
} = require("@obsidian-bridge/core");

// Building a login packet
const username = "Steve";
const playerUuid = UUID.offlineUUID(username);

const packet = Buffer.concat([
  VarInt.encode(0x00), // Packet ID
  MCString.encode(username), // Username
  UUID.toBuffer(playerUuid), // UUID
]);

console.log(`Packet size: ${packet.length} bytes`);

// Parsing the packet
let offset = 0;

const { value: packetId, bytesRead: idBytes } = VarInt.decode(packet, offset);
offset += idBytes;

const { value: parsedUsername, bytesRead: nameBytes } = MCString.decode(
  packet,
  offset,
);
offset += nameBytes;

const uuidBuffer = packet.slice(offset, offset + 16);
const parsedUuid = UUID.fromBuffer(uuidBuffer);

console.log(`Packet ID: ${packetId}`);
console.log(`Username: ${parsedUsername}`);
console.log(`UUID: ${parsedUuid}`);
```

### Encryption Example

```javascript
const { Crypto, VarInt, BufferHelpers } = require("@obsidian-bridge/core");

// Generate shared secret
const sharedSecret = Crypto.generateSharedSecret();

// Hash for server authentication
const serverHash = Crypto.minecraftSha1(
  Buffer.concat([
    Buffer.from(""), // Server ID (empty for online mode)
    sharedSecret,
    Buffer.from("public_key_here"), // Server's public key
  ]),
);

console.log(`Server hash: ${serverHash}`);

// Create cipher/decipher for packet encryption
const cipher = Crypto.createCipher(sharedSecret);
const decipher = Crypto.createDecipher(sharedSecret);

// Encrypt packet
const originalPacket = Buffer.concat([
  VarInt.encode(0x01),
  BufferHelpers.writeInt(123),
]);

const encrypted = cipher.update(originalPacket);
const decrypted = decipher.update(encrypted);

console.log("Original:", originalPacket);
console.log("Encrypted:", encrypted);
console.log("Decrypted:", decrypted);
console.log("Match:", originalPacket.equals(decrypted)); // true
```

### Position & Movement Example

```javascript
const { Vector3, BufferHelpers } = require("@obsidian-bridge/core");

// Player position
const playerPos = new Vector3(100.5, 64.0, 200.3);
const targetPos = new Vector3(150.0, 70.0, 250.0);

// Calculate movement
const direction = targetPos.subtract(playerPos);
const distance = playerPos.distanceTo(targetPos);
const moveDir = direction.normalize(); // Unit vector

console.log(`Distance: ${distance.toFixed(2)} blocks`);
console.log(`Direction: ${moveDir.toString()}`);

// Velocity (5 blocks per second toward target)
const velocity = moveDir.multiply(5);

// Simulate movement (1 tick = 0.05 seconds)
const newPos = playerPos.add(velocity.multiply(0.05));
console.log(`New position: ${newPos.toString()}`);

// Encode position for network
const positionPacket = Buffer.concat([
  BufferHelpers.writeDouble(newPos.x),
  BufferHelpers.writeDouble(newPos.y),
  BufferHelpers.writeDouble(newPos.z),
]);
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md).

## 📄 License

MIT © xwzcc

## 🔗 Related Packages

- [@obsidian/java-protocol](../java-protocol) - Minecraft Java Edition protocol
- [@obsidian/bedrock-protocol](../bedrock-protocol) - Minecraft Bedrock Edition protocol
- [@obsidian/data-mappings](../data-mappings) - Data mappings between protocols
- [@obsidian/protocol-translator](../protocol-translator) - Protocol translation layer
- [@obsidian/bridge-server](../bridge-server) - Complete bridge server

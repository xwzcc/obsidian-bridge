# 🔮 Obsidian Bridge

**Bridge the gap between Minecraft Java and Bedrock Edition**

<p align="center">
  <img src="https://img.shields.io/badge/Minecraft-Java%20%E2%86%94%20Bedrock-brightgreen" alt="Minecraft">
  <img src="https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License">
</p>

Obsidian is a powerful protocol bridge that enables cross-play between Minecraft Java Edition and Bedrock Edition. Built with Node.js, it translates packets in real-time, allowing players from both platforms to play together seamlessly.

## ✨ Features

- 🌉 **Protocol Bridge** - Connect Java and Bedrock players on the same server
- 🔄 **Real-time Translation** - Packets translated on-the-fly with minimal latency
- 📦 **Modular Architecture** - Use individual packages or the complete solution
- 🚀 **High Performance** - Optimized with caching and efficient algorithms
- 🛠️ **Extensible** - Easy to customize and extend
- 📚 **Well Documented** - Comprehensive API documentation

## 📦 Packages

| Package                                                              | Description                  | Status         | Version                                                                   |
| -------------------------------------------------------------------- | ---------------------------- | -------------- | ------------------------------------------------------------------------- |
| [@obsidian-bridge/core](packages/core)                               | Core utilities and types     | ✅ In Progress | ![npm](https://img.shields.io/npm/v/@obsidian-bridge/core)                |
| [@obsidian-bridge/java-protocol](packages/java-protocol)             | Java Edition protocol        | 🚧 Planned     | ![npm](https://img.shields.io/npm/v/@obsidian-bridge/java-protocol)       |
| [@obsidian-bridge/bedrock-protocol](packages/bedrock-protocol)       | Bedrock Edition protocol     | 🚧 Planned     | ![npm](https://img.shields.io/npm/v/@obsidian-bridge/bedrock-protocol)    |
| [@obsidian-bridge/data-mappings](packages/data-mappings)             | Cross-protocol data mappings | 🚧 Planned     | ![npm](https://img.shields.io/npm/v/@obsidian-bridge/data-mappings)       |
| [@obsidian-bridge/protocol-translator](packages/protocol-translator) | Protocol translation layer   | 🚧 Planned     | ![npm](https://img.shields.io/npm/v/@obsidian-bridge/protocol-translator) |
| [@obsidian-bridge/bridge-server](packages/bridge-server)             | Complete bridge server       | 🚧 Planned     | ![npm](https://img.shields.io/npm/v/@obsidian-bridge/bridge-server)       |
| [@obsidian-bridge/cli](packages/cli)                                 | Command-line interface       | 🚧 Planned     | ![npm](https://img.shields.io/npm/v/@obsidian-bridge/cli)                 |

### 📊 Core Package Implementation Status

The `@obsidian/core` package is currently under active development. Here's what's implemented:

**✅ Fully Implemented:**

- VarInt encoder/decoder (1-5 bytes variable-length integers)
- VarLong encoder/decoder (1-10 bytes with zigzag encoding)
- UUID utilities (generation, validation, buffer conversion, offline UUIDs)
- MCString encoder/decoder (VarInt length + UTF-8)
- BufferHelpers (read/write for all Minecraft data types)
- Crypto utilities (SHA-1, SHA-256, AES encryption)
- Vector3 class (complete 3D vector algebra)

**🚧 Planned:**

- Player type
- Position type
- Rotation type
- GameMode constants
- EventEmitter
- Protocol error classes
- Version constants
- State constants

## 🚀 Quick Start

### Using the Bridge Server

```bash
npm install -g @obsidian-bridge/cli

# Create config
obsidian init

# Start bridge
obsidian start
```

### Using Individual Packages

```bash
npm install @obsidian-bridge/core @obsidian-bridge/java-protocol
```

```javascript
const { VarInt, UUID } = require("@obsidian-bridge/core");
const { JavaClient } = require("@obsidian-bridge/java-protocol");

// Your code here
```

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Bedrock Client │ ◄─────► │  Obsidian Bridge │ ◄─────► │   Java Server   │
│  (Mobile/Win10) │   UDP   │                  │   TCP   │  (Paper/Spigot) │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

## 📖 Documentation

- [Getting Started](docs/getting-started.md)
- [Architecture](docs/architecture.md)
- [API Reference](docs/api/)
- [Configuration](docs/configuration.md)
- [Examples](examples/)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT © [Your Name]

## 🙏 Acknowledgments

- [GeyserMC](https://github.com/GeyserMC/Geyser) - Inspiration and mappings
- [PrismarineJS](https://github.com/PrismarineJS) - minecraft-data
- [CloudburstMC](https://github.com/CloudburstMC) - Bedrock protocol data

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/obsidian&type=Date)](https://star-history.com/#yourusername/obsidian&Date)

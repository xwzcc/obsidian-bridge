const { Player, Vector3, Rotation, GameMode, UUID } = require("../../src");

describe("Player", () => {
  describe("constructor", () => {
    test("should create with default values", () => {
      const player = new Player();
      expect(player.username).toBe("Player");
      expect(player.entityId).toBe(0);
      expect(player.position).toBeInstanceOf(Vector3);
      expect(player.rotation).toBeInstanceOf(Rotation);
      expect(player.gameMode).toBe(GameMode.SURVIVAL);
      expect(player.health).toBe(20);
      expect(UUID.isValid(player.uuid)).toBe(true);
    });

    test("should create with custom values", () => {
      const player = new Player({
        username: "TestPlayer",
        uuid: "550e8400-e29b-41d4-a716-446655440000",
        entityId: 42,
        position: new Vector3(10, 64, 20),
        rotation: new Rotation(45, 0),
        gameMode: GameMode.CREATIVE,
        health: 15,
      });

      expect(player.username).toBe("TestPlayer");
      expect(player.uuid).toBe("550e8400-e29b-41d4-a716-446655440000");
      expect(player.entityId).toBe(42);
      expect(player.position.x).toBe(10);
      expect(player.gameMode).toBe(GameMode.CREATIVE);
      expect(player.health).toBe(15);
    });
  });

  describe("updatePosition", () => {
    test("should update position", () => {
      const player = new Player();
      player.updatePosition(10, 64, 20);
      expect(player.position.x).toBe(10);
      expect(player.position.y).toBe(64);
      expect(player.position.z).toBe(20);
    });

    test("should update onGround", () => {
      const player = new Player();
      player.updatePosition(10, 64, 20, false);
      expect(player.onGround).toBe(false);
    });

    test("should preserve onGround if not provided", () => {
      const player = new Player();
      player.onGround = false;
      player.updatePosition(10, 64, 20);
      expect(player.onGround).toBe(false);
    });
  });

  describe("updateRotation", () => {
    test("should update rotation", () => {
      const player = new Player();
      player.updateRotation(45, 30);
      expect(player.rotation.yaw).toBe(45);
      expect(player.rotation.pitch).toBe(30);
    });
  });

  describe("teleport", () => {
    test("should teleport player", () => {
      const player = new Player();
      player.teleport(100, 70, 200, 90, -45);
      expect(player.position.x).toBe(100);
      expect(player.position.y).toBe(70);
      expect(player.position.z).toBe(200);
      expect(player.rotation.yaw).toBe(90);
      expect(player.rotation.pitch).toBe(-45);
    });

    test("should handle optional rotation", () => {
      const player = new Player();
      player.rotation.set(45, 30);
      player.teleport(100, 70, 200);
      expect(player.position.x).toBe(100);
      expect(player.rotation.yaw).toBe(45); // Preserved
      expect(player.rotation.pitch).toBe(30); // Preserved
    });

    test("should update only yaw if pitch not provided", () => {
      const player = new Player();
      player.rotation.set(0, 30);
      player.teleport(100, 70, 200, 90);
      expect(player.rotation.yaw).toBe(90);
      expect(player.rotation.pitch).toBe(30); // Preserved
    });
  });

  describe("setGameMode", () => {
    test("should set valid game mode", () => {
      const player = new Player();
      player.setGameMode(GameMode.CREATIVE);
      expect(player.gameMode).toBe(GameMode.CREATIVE);
    });

    test("should ignore invalid game mode", () => {
      const player = new Player();
      const originalMode = player.gameMode;
      player.setGameMode(999);
      expect(player.gameMode).toBe(originalMode);
    });
  });

  describe("setHealth", () => {
    test("should set health", () => {
      const player = new Player();
      player.setHealth(15);
      expect(player.health).toBe(15);
    });

    test("should clamp to max", () => {
      const player = new Player();
      player.setHealth(25);
      expect(player.health).toBe(20);
    });

    test("should clamp to min", () => {
      const player = new Player();
      player.setHealth(-5);
      expect(player.health).toBe(0);
    });
  });

  describe("setFood", () => {
    test("should set food", () => {
      const player = new Player();
      player.setFood(15);
      expect(player.food).toBe(15);
    });

    test("should clamp to max", () => {
      const player = new Player();
      player.setFood(25);
      expect(player.food).toBe(20);
    });

    test("should clamp to min", () => {
      const player = new Player();
      player.setFood(-5);
      expect(player.food).toBe(0);
    });
  });

  describe("setSaturation", () => {
    test("should set saturation", () => {
      const player = new Player();
      player.setSaturation(10);
      expect(player.saturation).toBe(10);
    });

    test("should clamp to max", () => {
      const player = new Player();
      player.setSaturation(25);
      expect(player.saturation).toBe(20);
    });

    test("should clamp to min", () => {
      const player = new Player();
      player.setSaturation(-5);
      expect(player.saturation).toBe(0);
    });
  });

  describe("setExperience", () => {
    test("should set experience", () => {
      const player = new Player();
      player.setExperience(100);
      expect(player.experience).toBe(100);
    });

    test("should set level", () => {
      const player = new Player();
      player.setExperience(100, 5);
      expect(player.experience).toBe(100);
      expect(player.level).toBe(5);
    });

    test("should preserve level if not provided", () => {
      const player = new Player();
      player.level = 10;
      player.setExperience(200);
      expect(player.level).toBe(10);
    });
  });

  describe("isAlive", () => {
    test("should return true if health > 0", () => {
      const player = new Player();
      player.health = 10;
      expect(player.isAlive()).toBe(true);
    });

    test("should return false if health = 0", () => {
      const player = new Player();
      player.health = 0;
      expect(player.isAlive()).toBe(false);
    });
  });

  describe("isCreative", () => {
    test("should return true for creative mode", () => {
      const player = new Player({ gameMode: GameMode.CREATIVE });
      expect(player.isCreative()).toBe(true);
    });

    test("should return false for other modes", () => {
      const player = new Player({ gameMode: GameMode.SURVIVAL });
      expect(player.isCreative()).toBe(false);
    });
  });

  describe("toJSON", () => {
    test("should serialize to JSON", () => {
      const player = new Player({
        username: "TestPlayer",
        uuid: "550e8400-e29b-41d4-a716-446655440000",
        entityId: 42,
      });

      const json = player.toJSON();
      expect(json.username).toBe("TestPlayer");
      expect(json.uuid).toBe("550e8400-e29b-41d4-a716-446655440000");
      expect(json.entityId).toBe(42);
      expect(json.position).toHaveProperty("x");
      expect(json.position).toHaveProperty("y");
      expect(json.position).toHaveProperty("z");
      expect(json.rotation).toHaveProperty("yaw");
      expect(json.rotation).toHaveProperty("pitch");
    });
  });

  describe("fromJSON", () => {
    test("should deserialize from JSON", () => {
      const json = {
        username: "TestPlayer",
        uuid: "550e8400-e29b-41d4-a716-446655440000",
        entityId: 42,
        position: { x: 10, y: 64, z: 20 },
        rotation: { yaw: 45, pitch: 30 },
        gameMode: 1,
        health: 15,
        food: 18,
        saturation: 10,
        experience: 100,
        level: 5,
        protocol: "java",
        protocolVersion: 765,
        brand: "vanilla",
        metadata: {},
      };

      const player = Player.fromJSON(json);
      expect(player.username).toBe("TestPlayer");
      expect(player.uuid).toBe("550e8400-e29b-41d4-a716-446655440000");
      expect(player.entityId).toBe(42);
      expect(player.position.x).toBe(10);
      expect(player.rotation.yaw).toBe(45);
      expect(player.gameMode).toBe(1);
      expect(player.health).toBe(15);
    });

    test("should round-trip", () => {
      const original = new Player({
        username: "TestPlayer",
        position: new Vector3(10, 64, 20),
        rotation: new Rotation(45, 30),
        gameMode: GameMode.CREATIVE,
      });

      const json = original.toJSON();
      const restored = Player.fromJSON(json);

      expect(restored.username).toBe(original.username);
      expect(restored.position.x).toBe(original.position.x);
      expect(restored.rotation.yaw).toBe(original.rotation.yaw);
      expect(restored.gameMode).toBe(original.gameMode);
    });
  });

  describe("toString", () => {
    test("should convert to string", () => {
      const player = new Player({
        username: "TestPlayer",
        uuid: "550e8400-e29b-41d4-a716-446655440000",
        gameMode: GameMode.CREATIVE,
      });

      const str = player.toString();
      expect(str).toContain("TestPlayer");
      expect(str).toContain("550e8400-e29b-41d4-a716-446655440000");
      expect(str).toContain("creative");
    });
  });
});

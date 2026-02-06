const { UUID } = require("../../src");

describe("UUID", () => {
  describe("generate", () => {
    test("should generate valid UUID", () => {
      const uuid = UUID.generate();
      expect(UUID.isValid(uuid)).toBe(true);
    });

    test("should generate unique UUIDs", () => {
      const uuid1 = UUID.generate();
      const uuid2 = UUID.generate();
      expect(uuid1).not.toBe(uuid2);
    });

    test("should generate UUID v4 format", () => {
      const uuid = UUID.generate();
      const parts = uuid.split("-");
      expect(parts).toHaveLength(5);
      expect(parts[0]).toHaveLength(8);
      expect(parts[1]).toHaveLength(4);
      expect(parts[2]).toHaveLength(4);
      expect(parts[3]).toHaveLength(4);
      expect(parts[4]).toHaveLength(12);
    });

    test("should generate multiple different UUIDs", () => {
      const uuids = new Set();
      for (let i = 0; i < 100; i++) {
        uuids.add(UUID.generate());
      }
      expect(uuids.size).toBe(100);
    });
  });

  describe("toBuffer", () => {
    test("should convert UUID to buffer", () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      const buffer = UUID.toBuffer(uuid);
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBe(16);
    });

    test("should convert lowercase UUID", () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      const buffer = UUID.toBuffer(uuid);
      expect(buffer.length).toBe(16);
    });

    test("should convert uppercase UUID", () => {
      const uuid = "550E8400-E29B-41D4-A716-446655440000";
      const buffer = UUID.toBuffer(uuid);
      expect(buffer.length).toBe(16);
    });

    test("should throw on invalid UUID format", () => {
      expect(() => UUID.toBuffer("invalid")).toThrow();
      expect(() => UUID.toBuffer("550e8400-e29b-41d4-a716")).toThrow();
      expect(() => UUID.toBuffer("not-a-uuid")).toThrow();
    });

    test("should throw on UUID without hyphens", () => {
      expect(() => UUID.toBuffer("550e8400e29b41d4a716446655440000")).toThrow();
    });
  });

  describe("fromBuffer", () => {
    test("should convert buffer to UUID", () => {
      const buffer = Buffer.from("550e8400e29b41d4a716446655440000", "hex");
      const uuid = UUID.fromBuffer(buffer);
      expect(uuid).toBe("550e8400-e29b-41d4-a716-446655440000");
    });

    test("should throw on wrong buffer size", () => {
      const buffer = Buffer.from([1, 2, 3]);
      expect(() => UUID.fromBuffer(buffer)).toThrow("must be 16 bytes");
    });

    test("should throw on empty buffer", () => {
      const buffer = Buffer.alloc(0);
      expect(() => UUID.fromBuffer(buffer)).toThrow();
    });

    test("should throw on too large buffer", () => {
      const buffer = Buffer.alloc(20);
      expect(() => UUID.fromBuffer(buffer)).toThrow();
    });
  });

  describe("isValid", () => {
    test("should validate correct UUID", () => {
      expect(UUID.isValid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    });

    test("should validate UUID v4", () => {
      const uuid = UUID.generate();
      expect(UUID.isValid(uuid)).toBe(true);
    });

    test("should reject invalid UUID", () => {
      expect(UUID.isValid("invalid")).toBe(false);
      expect(UUID.isValid("550e8400-e29b-41d4-a716")).toBe(false);
      expect(UUID.isValid("not-a-uuid")).toBe(false);
      expect(UUID.isValid("")).toBe(false);
    });

    test("should reject UUID without hyphens", () => {
      expect(UUID.isValid("550e8400e29b41d4a716446655440000")).toBe(false);
    });

    test("should reject wrong version", () => {
      expect(UUID.isValid("550e8400-e29b-71d4-a716-446655440000")).toBe(false);
    });

    test("should accept lowercase", () => {
      expect(UUID.isValid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    });

    test("should accept uppercase", () => {
      expect(UUID.isValid("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
    });
  });

  describe("offlineUUID", () => {
    test("should generate consistent offline UUID", () => {
      const uuid1 = UUID.offlineUUID("Notch");
      const uuid2 = UUID.offlineUUID("Notch");
      expect(uuid1).toBe(uuid2);
    });

    test("should generate different UUIDs for different usernames", () => {
      const uuid1 = UUID.offlineUUID("Notch");
      const uuid2 = UUID.offlineUUID("jeb_");
      expect(uuid1).not.toBe(uuid2);
    });

    test("should generate valid UUID", () => {
      const uuid = UUID.offlineUUID("TestPlayer");
      expect(UUID.isValid(uuid)).toBe(true);
    });

    test("should be case sensitive", () => {
      const uuid1 = UUID.offlineUUID("Player");
      const uuid2 = UUID.offlineUUID("player");
      expect(uuid1).not.toBe(uuid2);
    });

    test("should handle empty username", () => {
      const uuid = UUID.offlineUUID("");
      expect(UUID.isValid(uuid)).toBe(true);
    });

    test("should handle special characters", () => {
      const uuid = UUID.offlineUUID("Test_Player-123");
      expect(UUID.isValid(uuid)).toBe(true);
    });
  });

  describe("round-trip", () => {
    test("should round-trip UUID through buffer", () => {
      const original = "550e8400-e29b-41d4-a716-446655440000";
      const buffer = UUID.toBuffer(original);
      const restored = UUID.fromBuffer(buffer);
      expect(restored).toBe(original);
    });

    test("should round-trip generated UUID", () => {
      const original = UUID.generate();
      const buffer = UUID.toBuffer(original);
      const restored = UUID.fromBuffer(buffer);
      expect(restored).toBe(original.toLowerCase());
    });

    test("should round-trip offline UUID", () => {
      const original = UUID.offlineUUID("TestPlayer");
      const buffer = UUID.toBuffer(original);
      const restored = UUID.fromBuffer(buffer);
      expect(restored).toBe(original);
    });
  });
});

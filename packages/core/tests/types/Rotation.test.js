const { Rotation } = require("../../src");

describe("Rotation", () => {
  describe("constructor", () => {
    test("should create with default values", () => {
      const r = new Rotation();
      expect(r.yaw).toBe(0);
      expect(r.pitch).toBe(0);
    });

    test("should create with custom values", () => {
      const r = new Rotation(45, -30);
      expect(r.yaw).toBe(45);
      expect(r.pitch).toBe(-30);
    });
  });

  describe("set", () => {
    test("should set values", () => {
      const r = new Rotation();
      r.set(90, 45);
      expect(r.yaw).toBe(90);
      expect(r.pitch).toBe(45);
    });

    test("should return this for chaining", () => {
      const r = new Rotation();
      const result = r.set(45, 30);
      expect(result).toBe(r);
    });
  });

  describe("normalize", () => {
    test("should normalize yaw to -180 to 180", () => {
      const r = new Rotation(200, 0);
      r.normalize();
      expect(r.yaw).toBeGreaterThanOrEqual(-180);
      expect(r.yaw).toBeLessThanOrEqual(180);
    });

    test("should normalize negative yaw", () => {
      const r = new Rotation(-200, 0);
      r.normalize();
      expect(r.yaw).toBeGreaterThanOrEqual(-180);
      expect(r.yaw).toBeLessThanOrEqual(180);
    });

    test("should clamp pitch to -90 to 90", () => {
      const r = new Rotation(0, 100);
      r.normalize();
      expect(r.pitch).toBe(90);
    });

    test("should clamp negative pitch", () => {
      const r = new Rotation(0, -100);
      r.normalize();
      expect(r.pitch).toBe(-90);
    });

    test("should handle 180 degrees", () => {
      const r = new Rotation(180, 0);
      r.normalize();
      expect(r.yaw).toBe(180);
    });

    test("should handle -180 degrees", () => {
      const r = new Rotation(-180, 0);
      r.normalize();
      expect(r.yaw).toBe(-180);
    });

    test("should return this for chaining", () => {
      const r = new Rotation(200, 100);
      const result = r.normalize();
      expect(result).toBe(r);
    });
  });

  describe("toBytes", () => {
    test("should convert to bytes", () => {
      const r = new Rotation(0, 0);
      const bytes = r.toBytes();
      expect(bytes.yaw).toBe(0);
      expect(bytes.pitch).toBe(0);
    });

    test("should convert 90 degrees", () => {
      const r = new Rotation(90, 0);
      const bytes = r.toBytes();
      expect(bytes.yaw).toBeCloseTo(64, 0); // 90/360*256 = 64
    });

    test("should convert 180 degrees", () => {
      const r = new Rotation(180, 0);
      const bytes = r.toBytes();
      expect(bytes.yaw).toBeCloseTo(128, 0); // 180/360*256 = 128
    });

    test("should convert -90 degrees", () => {
      const r = new Rotation(-90, 0);
      const bytes = r.toBytes();
      expect(bytes.yaw).toBeCloseTo(192, 0); // -90/360*256 = -64, as byte = 192
    });

    test("should handle pitch", () => {
      const r = new Rotation(0, 45);
      const bytes = r.toBytes();
      expect(bytes.pitch).toBeCloseTo(32, 0); // 45/360*256 = 32
    });
  });

  describe("fromBytes", () => {
    test("should create from bytes", () => {
      const r = Rotation.fromBytes(0, 0);
      expect(r.yaw).toBe(0);
      expect(r.pitch).toBe(0);
    });

    test("should create from 64 (90 degrees)", () => {
      const r = Rotation.fromBytes(64, 0);
      expect(r.yaw).toBeCloseTo(90, 1);
    });

    test("should create from 128 (180 degrees)", () => {
      const r = Rotation.fromBytes(128, 0);
      expect(r.yaw).toBeCloseTo(180, 1);
    });

    test("should create from 192 (-90 degrees)", () => {
      const r = Rotation.fromBytes(192, 0);
      expect(r.yaw).toBeCloseTo(-90, 1);
    });
  });

  describe("clone", () => {
    test("should create copy", () => {
      const r = new Rotation(45, 30);
      const clone = r.clone();
      expect(clone.yaw).toBe(45);
      expect(clone.pitch).toBe(30);
    });

    test("should create independent copy", () => {
      const r = new Rotation(45, 30);
      const clone = r.clone();
      clone.set(90, 60);
      expect(r.yaw).toBe(45);
      expect(r.pitch).toBe(30);
    });
  });

  describe("toJSON", () => {
    test("should convert to JSON", () => {
      const r = new Rotation(45, 30);
      const json = r.toJSON();
      expect(json).toEqual({ yaw: 45, pitch: 30 });
    });
  });

  describe("fromJSON", () => {
    test("should create from JSON", () => {
      const json = { yaw: 45, pitch: 30 };
      const r = Rotation.fromJSON(json);
      expect(r.yaw).toBe(45);
      expect(r.pitch).toBe(30);
    });

    test("should round-trip", () => {
      const original = new Rotation(45.5, 30.7);
      const json = original.toJSON();
      const restored = Rotation.fromJSON(json);
      expect(restored.yaw).toBe(original.yaw);
      expect(restored.pitch).toBe(original.pitch);
    });
  });

  describe("toString", () => {
    test("should convert to string", () => {
      const r = new Rotation(45.5, 30.2);
      const str = r.toString();
      expect(str).toContain("45.5");
      expect(str).toContain("30.2");
    });
  });

  describe("round-trip bytes", () => {
    const testRotations = [
      { yaw: 0, pitch: 0 },
      { yaw: 45, pitch: 0 },
      { yaw: 90, pitch: 0 },
      { yaw: 180, pitch: 0 },
      { yaw: -90, pitch: 0 },
      { yaw: 0, pitch: 45 },
      { yaw: 0, pitch: -45 },
    ];

    testRotations.forEach((rot) => {
      test(`should round-trip bytes (${rot.yaw}, ${rot.pitch})`, () => {
        const r = new Rotation(rot.yaw, rot.pitch);
        const bytes = r.toBytes();
        const restored = Rotation.fromBytes(bytes.yaw, bytes.pitch);
        expect(restored.yaw).toBeCloseTo(rot.yaw, 1);
        expect(restored.pitch).toBeCloseTo(rot.pitch, 1);
      });
    });
  });
});

const { Vector3 } = require("../../src");

describe("Vector3", () => {
  describe("constructor", () => {
    test("should create with default values", () => {
      const v = new Vector3();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });

    test("should create with custom values", () => {
      const v = new Vector3(1, 2, 3);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });

    test("should handle negative values", () => {
      const v = new Vector3(-1, -2, -3);
      expect(v.x).toBe(-1);
      expect(v.y).toBe(-2);
      expect(v.z).toBe(-3);
    });

    test("should handle floating point values", () => {
      const v = new Vector3(1.5, 2.7, 3.9);
      expect(v.x).toBe(1.5);
      expect(v.y).toBe(2.7);
      expect(v.z).toBe(3.9);
    });
  });

  describe("set", () => {
    test("should set values", () => {
      const v = new Vector3();
      v.set(5, 6, 7);
      expect(v.x).toBe(5);
      expect(v.y).toBe(6);
      expect(v.z).toBe(7);
    });

    test("should return this for chaining", () => {
      const v = new Vector3();
      const result = v.set(1, 2, 3);
      expect(result).toBe(v);
    });

    test("should allow chaining", () => {
      const v = new Vector3().set(1, 2, 3).set(4, 5, 6);
      expect(v.x).toBe(4);
      expect(v.y).toBe(5);
      expect(v.z).toBe(6);
    });
  });

  describe("add", () => {
    test("should add vectors", () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 5, 6);
      const result = a.add(b);
      expect(result.x).toBe(5);
      expect(result.y).toBe(7);
      expect(result.z).toBe(9);
    });

    test("should not modify original vectors", () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 5, 6);
      a.add(b);
      expect(a.x).toBe(1);
      expect(a.y).toBe(2);
      expect(a.z).toBe(3);
    });

    test("should handle negative values", () => {
      const a = new Vector3(5, 5, 5);
      const b = new Vector3(-2, -3, -4);
      const result = a.add(b);
      expect(result.x).toBe(3);
      expect(result.y).toBe(2);
      expect(result.z).toBe(1);
    });

    test("should be commutative", () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 5, 6);
      const result1 = a.add(b);
      const result2 = b.add(a);
      expect(result1.x).toBe(result2.x);
      expect(result1.y).toBe(result2.y);
      expect(result1.z).toBe(result2.z);
    });
  });

  describe("subtract", () => {
    test("should subtract vectors", () => {
      const a = new Vector3(5, 7, 9);
      const b = new Vector3(1, 2, 3);
      const result = a.subtract(b);
      expect(result.x).toBe(4);
      expect(result.y).toBe(5);
      expect(result.z).toBe(6);
    });

    test("should handle negative results", () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 5, 6);
      const result = a.subtract(b);
      expect(result.x).toBe(-3);
      expect(result.y).toBe(-3);
      expect(result.z).toBe(-3);
    });

    test("should not be commutative", () => {
      const a = new Vector3(5, 5, 5);
      const b = new Vector3(3, 3, 3);
      const result1 = a.subtract(b);
      const result2 = b.subtract(a);
      expect(result1.x).toBe(-result2.x);
      expect(result1.y).toBe(-result2.y);
      expect(result1.z).toBe(-result2.z);
    });
  });

  describe("multiply", () => {
    test("should multiply by scalar", () => {
      const v = new Vector3(1, 2, 3);
      const result = v.multiply(2);
      expect(result.x).toBe(2);
      expect(result.y).toBe(4);
      expect(result.z).toBe(6);
    });

    test("should multiply by negative scalar", () => {
      const v = new Vector3(1, 2, 3);
      const result = v.multiply(-2);
      expect(result.x).toBe(-2);
      expect(result.y).toBe(-4);
      expect(result.z).toBe(-6);
    });

    test("should multiply by zero", () => {
      const v = new Vector3(1, 2, 3);
      const result = v.multiply(0);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(0);
    });

    test("should multiply by fractional scalar", () => {
      const v = new Vector3(10, 20, 30);
      const result = v.multiply(0.5);
      expect(result.x).toBe(5);
      expect(result.y).toBe(10);
      expect(result.z).toBe(15);
    });
  });

  describe("divide", () => {
    test("should divide by scalar", () => {
      const v = new Vector3(10, 20, 30);
      const result = v.divide(10);
      expect(result.x).toBe(1);
      expect(result.y).toBe(2);
      expect(result.z).toBe(3);
    });

    test("should divide by negative scalar", () => {
      const v = new Vector3(10, 20, 30);
      const result = v.divide(-10);
      expect(result.x).toBe(-1);
      expect(result.y).toBe(-2);
      expect(result.z).toBe(-3);
    });

    test("should throw on division by zero", () => {
      const v = new Vector3(1, 2, 3);
      expect(() => v.divide(0)).toThrow("Division by zero");
    });

    test("should handle fractional results", () => {
      const v = new Vector3(1, 2, 3);
      const result = v.divide(2);
      expect(result.x).toBe(0.5);
      expect(result.y).toBe(1);
      expect(result.z).toBe(1.5);
    });
  });

  describe("length", () => {
    test("should calculate length of zero vector", () => {
      const v = new Vector3(0, 0, 0);
      expect(v.length()).toBe(0);
    });

    test("should calculate length of unit vectors", () => {
      expect(new Vector3(1, 0, 0).length()).toBe(1);
      expect(new Vector3(0, 1, 0).length()).toBe(1);
      expect(new Vector3(0, 0, 1).length()).toBe(1);
    });

    test("should calculate length correctly (3-4-5 triangle)", () => {
      const v = new Vector3(3, 4, 0);
      expect(v.length()).toBe(5);
    });

    test("should calculate length correctly (3D)", () => {
      const v = new Vector3(1, 2, 2);
      expect(v.length()).toBe(3);
    });

    test("should handle negative values", () => {
      const v = new Vector3(-3, -4, 0);
      expect(v.length()).toBe(5);
    });
  });

  describe("lengthSquared", () => {
    test("should calculate squared length", () => {
      const v = new Vector3(3, 4, 0);
      expect(v.lengthSquared()).toBe(25);
    });

    test("should be faster than length", () => {
      const v = new Vector3(1, 2, 3);
      expect(v.lengthSquared()).toBe(14);
    });

    test("should match length squared", () => {
      const v = new Vector3(2, 3, 6);
      expect(v.lengthSquared()).toBe(v.length() ** 2);
    });
  });

  describe("distanceTo", () => {
    test("should calculate distance between vectors", () => {
      const a = new Vector3(0, 0, 0);
      const b = new Vector3(3, 4, 0);
      expect(a.distanceTo(b)).toBe(5);
    });

    test("should be symmetric", () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 6, 8);
      expect(a.distanceTo(b)).toBe(b.distanceTo(a));
    });

    test("should be zero for same point", () => {
      const a = new Vector3(5, 5, 5);
      const b = new Vector3(5, 5, 5);
      expect(a.distanceTo(b)).toBe(0);
    });

    test("should calculate 3D distance", () => {
      const a = new Vector3(0, 0, 0);
      const b = new Vector3(1, 1, 1);
      expect(a.distanceTo(b)).toBeCloseTo(Math.sqrt(3), 10);
    });
  });

  describe("distanceToSquared", () => {
    test("should calculate squared distance", () => {
      const a = new Vector3(0, 0, 0);
      const b = new Vector3(3, 4, 0);
      expect(a.distanceToSquared(b)).toBe(25);
    });

    test("should match distance squared", () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 6, 8);
      expect(a.distanceToSquared(b)).toBe(a.distanceTo(b) ** 2);
    });
  });

  describe("normalize", () => {
    test("should normalize vector to unit length", () => {
      const v = new Vector3(3, 4, 0);
      const normalized = v.normalize();
      expect(normalized.length()).toBeCloseTo(1, 10);
    });

    test("should preserve direction", () => {
      const v = new Vector3(3, 4, 0);
      const normalized = v.normalize();
      expect(normalized.x).toBeCloseTo(0.6, 5);
      expect(normalized.y).toBeCloseTo(0.8, 5);
    });

    test("should handle zero vector", () => {
      const v = new Vector3(0, 0, 0);
      const normalized = v.normalize();
      expect(normalized.x).toBe(0);
      expect(normalized.y).toBe(0);
      expect(normalized.z).toBe(0);
    });

    test("should not modify original", () => {
      const v = new Vector3(3, 4, 0);
      v.normalize();
      expect(v.x).toBe(3);
      expect(v.y).toBe(4);
    });
  });

  describe("dot", () => {
    test("should calculate dot product", () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 5, 6);
      expect(a.dot(b)).toBe(32); // 1*4 + 2*5 + 3*6 = 32
    });

    test("should be commutative", () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 5, 6);
      expect(a.dot(b)).toBe(b.dot(a));
    });

    test("should be zero for perpendicular vectors", () => {
      const a = new Vector3(1, 0, 0);
      const b = new Vector3(0, 1, 0);
      expect(a.dot(b)).toBe(0);
    });

    test("should handle negative values", () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(-1, -2, -3);
      expect(a.dot(b)).toBe(-14);
    });
  });

  describe("cross", () => {
    test("should calculate cross product", () => {
      const a = new Vector3(1, 0, 0);
      const b = new Vector3(0, 1, 0);
      const result = a.cross(b);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(1);
    });

    test("should not be commutative", () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 5, 6);
      const result1 = a.cross(b);
      const result2 = b.cross(a);
      expect(result1.x).toBe(-result2.x);
      expect(result1.y).toBe(-result2.y);
      expect(result1.z).toBe(-result2.z);
    });

    test("should be perpendicular to both vectors", () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 5, 6);
      const c = a.cross(b);
      expect(c.dot(a)).toBeCloseTo(0, 10);
      expect(c.dot(b)).toBeCloseTo(0, 10);
    });

    test("should be zero for parallel vectors", () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(2, 4, 6);
      const result = a.cross(b);
      expect(result.x).toBeCloseTo(0, 10);
      expect(result.y).toBeCloseTo(0, 10);
      expect(result.z).toBeCloseTo(0, 10);
    });
  });

  describe("clone", () => {
    test("should create copy", () => {
      const v = new Vector3(1, 2, 3);
      const clone = v.clone();
      expect(clone.x).toBe(v.x);
      expect(clone.y).toBe(v.y);
      expect(clone.z).toBe(v.z);
    });

    test("should create independent copy", () => {
      const v = new Vector3(1, 2, 3);
      const clone = v.clone();
      clone.set(4, 5, 6);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });
  });

  describe("toJSON", () => {
    test("should convert to JSON", () => {
      const v = new Vector3(1, 2, 3);
      const json = v.toJSON();
      expect(json).toEqual({ x: 1, y: 2, z: 3 });
    });

    test("should handle floating point", () => {
      const v = new Vector3(1.5, 2.7, 3.9);
      const json = v.toJSON();
      expect(json.x).toBe(1.5);
      expect(json.y).toBe(2.7);
      expect(json.z).toBe(3.9);
    });
  });

  describe("fromJSON", () => {
    test("should create from JSON", () => {
      const json = { x: 1, y: 2, z: 3 };
      const v = Vector3.fromJSON(json);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });

    test("should round-trip", () => {
      const original = new Vector3(1.5, 2.7, 3.9);
      const json = original.toJSON();
      const restored = Vector3.fromJSON(json);
      expect(restored.x).toBe(original.x);
      expect(restored.y).toBe(original.y);
      expect(restored.z).toBe(original.z);
    });
  });

  describe("toString", () => {
    test("should convert to string", () => {
      const v = new Vector3(1.234, 2.567, 3.89);
      const str = v.toString();
      expect(str).toContain("1.23");
      expect(str).toContain("2.57");
      expect(str).toContain("3.89");
    });
  });
});

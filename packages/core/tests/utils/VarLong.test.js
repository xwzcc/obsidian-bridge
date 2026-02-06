const { VarLong } = require("../../src");

describe("VarLong", () => {
  describe("encode", () => {
    test("should encode 0", () => {
      const result = VarLong.encode(0n);
      expect(result).toEqual(Buffer.from([0x00]));
    });

    test("should encode 1", () => {
      const result = VarLong.encode(1n);
      expect(result).toEqual(Buffer.from([0x02])); // Zigzag: 1 -> 2
    });

    test("should encode -1", () => {
      const result = VarLong.encode(-1n);
      expect(result).toEqual(Buffer.from([0x01])); // Zigzag: -1 -> 1
    });

    test("should encode 127", () => {
      const result = VarLong.encode(127n);
      expect(result).toEqual(Buffer.from([0xfe, 0x01])); // Zigzag: 127 -> 254
    });

    test("should encode 128", () => {
      const result = VarLong.encode(128n);
      expect(result).toEqual(Buffer.from([0x80, 0x02])); // Zigzag: 128 -> 256
    });

    test("should encode large positive", () => {
      const result = VarLong.encode(2147483647n);
      expect(result.length).toBeGreaterThan(1);
      expect(result.length).toBeLessThanOrEqual(10);
    });

    test("should encode large negative", () => {
      const result = VarLong.encode(-2147483648n);
      expect(result.length).toBeGreaterThan(1);
      expect(result.length).toBeLessThanOrEqual(10);
    });

    test("should accept number input", () => {
      const result = VarLong.encode(100);
      expect(result).toBeInstanceOf(Buffer);
    });
  });

  describe("decode", () => {
    test("should decode 0", () => {
      const buffer = Buffer.from([0x00]);
      const result = VarLong.decode(buffer);
      expect(result.value).toBe(0n);
      expect(result.bytesRead).toBe(1);
    });

    test("should decode 1", () => {
      const buffer = Buffer.from([0x02]);
      const result = VarLong.decode(buffer);
      expect(result.value).toBe(1n);
      expect(result.bytesRead).toBe(1);
    });

    test("should decode -1", () => {
      const buffer = Buffer.from([0x01]);
      const result = VarLong.decode(buffer);
      expect(result.value).toBe(-1n);
      expect(result.bytesRead).toBe(1);
    });

    test("should decode with offset", () => {
      const buffer = Buffer.from([0xff, 0x02, 0xff]);
      const result = VarLong.decode(buffer, 1);
      expect(result.value).toBe(1n);
      expect(result.bytesRead).toBe(1);
    });

    test("should throw on incomplete VarLong", () => {
      const buffer = Buffer.from([0x80]);
      expect(() => VarLong.decode(buffer)).toThrow(
        "VarLong extends beyond buffer",
      );
    });

    test("should throw on VarLong too large", () => {
      const buffer = Buffer.from([
        0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01,
      ]);
      expect(() => VarLong.decode(buffer)).toThrow("VarLong too large");
    });
  });

  describe("getLength", () => {
    test("should return correct length for 0", () => {
      expect(VarLong.getLength(0n)).toBe(1);
    });

    test("should return correct length for 1", () => {
      expect(VarLong.getLength(1n)).toBe(1);
    });

    test("should return correct length for -1", () => {
      expect(VarLong.getLength(-1n)).toBe(1);
    });

    test("should return correct length for large values", () => {
      expect(VarLong.getLength(2147483647n)).toBeGreaterThan(1);
      expect(VarLong.getLength(2147483647n)).toBeLessThanOrEqual(10);
    });
  });

  describe("round-trip", () => {
    const testValues = [
      0n,
      1n,
      -1n,
      127n,
      128n,
      -128n,
      255n,
      256n,
      -256n,
      2147483647n,
      -2147483648n,
      9223372036854775807n, // Max safe BigInt
    ];

    testValues.forEach((value) => {
      test(`should round-trip ${value}`, () => {
        const encoded = VarLong.encode(value);
        const decoded = VarLong.decode(encoded);
        expect(decoded.value).toBe(value);
      });
    });
  });
});

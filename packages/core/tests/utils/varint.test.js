const { VarInt } = require("../../src");

describe("VarInt", () => {
  describe("encode", () => {
    test("should encode 0", () => {
      const result = VarInt.encode(0);
      expect(result).toEqual(Buffer.from([0x00]));
    });

    test("should encode 127", () => {
      const result = VarInt.encode(127);
      expect(result).toEqual(Buffer.from([0x7f]));
    });

    test("should encode 128", () => {
      const result = VarInt.encode(128);
      expect(result).toEqual(Buffer.from([0x80, 0x01]));
    });

    test("should encode 300", () => {
      const result = VarInt.encode(300);
      expect(result).toEqual(Buffer.from([0xac, 0x02]));
    });

    test("should encode -1", () => {
      const result = VarInt.encode(-1);
      expect(result).toEqual(Buffer.from([0xff, 0xff, 0xff, 0xff, 0x0f]));
    });

    test("should throw on value too large", () => {
      expect(() => VarInt.encode(2147483648)).toThrow(RangeError);
    });

    test("should throw on value too small", () => {
      expect(() => VarInt.encode(-2147483649)).toThrow(RangeError);
    });
  });

  describe("decode", () => {
    test("should decode 0", () => {
      const buffer = Buffer.from([0x00]);
      const result = VarInt.decode(buffer);
      expect(result.value).toBe(0);
      expect(result.bytesRead).toBe(1);
    });

    test("should decode 127", () => {
      const buffer = Buffer.from([0x7f]);
      const result = VarInt.decode(buffer);
      expect(result.value).toBe(127);
      expect(result.bytesRead).toBe(1);
    });

    test("should decode 128", () => {
      const buffer = Buffer.from([0x80, 0x01]);
      const result = VarInt.decode(buffer);
      expect(result.value).toBe(128);
      expect(result.bytesRead).toBe(2);
    });

    test("should decode 300", () => {
      const buffer = Buffer.from([0xac, 0x02]);
      const result = VarInt.decode(buffer);
      expect(result.value).toBe(300);
      expect(result.bytesRead).toBe(2);
    });

    test("should decode -1", () => {
      const buffer = Buffer.from([0xff, 0xff, 0xff, 0xff, 0x0f]);
      const result = VarInt.decode(buffer);
      expect(result.value).toBe(-1);
      expect(result.bytesRead).toBe(5);
    });

    test("should decode with offset", () => {
      const buffer = Buffer.from([0xff, 0xac, 0x02, 0xff]);
      const result = VarInt.decode(buffer, 1);
      expect(result.value).toBe(300);
      expect(result.bytesRead).toBe(2);
    });

    test("should throw on incomplete VarInt", () => {
      const buffer = Buffer.from([0x80]);
      expect(() => VarInt.decode(buffer)).toThrow(
        "VarInt extends beyond buffer",
      );
    });

    test("should throw on VarInt too large", () => {
      const buffer = Buffer.from([0x80, 0x80, 0x80, 0x80, 0x80, 0x01]);
      expect(() => VarInt.decode(buffer)).toThrow("VarInt too large");
    });
  });

  describe("getLength", () => {
    test("should return correct length for 0", () => {
      expect(VarInt.getLength(0)).toBe(1);
    });

    test("should return correct length for 127", () => {
      expect(VarInt.getLength(127)).toBe(1);
    });

    test("should return correct length for 128", () => {
      expect(VarInt.getLength(128)).toBe(2);
    });

    test("should return correct length for 300", () => {
      expect(VarInt.getLength(300)).toBe(2);
    });

    test("should return correct length for -1", () => {
      expect(VarInt.getLength(-1)).toBe(5);
    });
  });

  describe("round-trip", () => {
    const testValues = [
      0, 1, 127, 128, 255, 256, 300, 2147483647, -1, -128, -2147483648,
    ];

    testValues.forEach((value) => {
      test(`should round-trip ${value}`, () => {
        const encoded = VarInt.encode(value);
        const decoded = VarInt.decode(encoded);
        expect(decoded.value).toBe(value);
      });
    });
  });
});

const { BufferHelpers } = require("../../src");

describe("BufferHelpers", () => {
  describe("Boolean", () => {
    test("should write true", () => {
      const buffer = BufferHelpers.writeBoolean(true);
      expect(buffer).toEqual(Buffer.from([0x01]));
    });

    test("should write false", () => {
      const buffer = BufferHelpers.writeBoolean(false);
      expect(buffer).toEqual(Buffer.from([0x00]));
    });

    test("should read true", () => {
      const buffer = Buffer.from([0x01]);
      const { value } = BufferHelpers.readBoolean(buffer);
      expect(value).toBe(true);
    });

    test("should read false", () => {
      const buffer = Buffer.from([0x00]);
      const { value } = BufferHelpers.readBoolean(buffer);
      expect(value).toBe(false);
    });

    test("should round-trip", () => {
      const original = true;
      const buffer = BufferHelpers.writeBoolean(original);
      const { value } = BufferHelpers.readBoolean(buffer);
      expect(value).toBe(original);
    });
  });

  describe("Byte", () => {
    test("should write positive byte", () => {
      const buffer = BufferHelpers.writeByte(42);
      expect(buffer.length).toBe(1);
      expect(buffer.readInt8(0)).toBe(42);
    });

    test("should write negative byte", () => {
      const buffer = BufferHelpers.writeByte(-42);
      expect(buffer.readInt8(0)).toBe(-42);
    });

    test("should write max byte", () => {
      const buffer = BufferHelpers.writeByte(127);
      expect(buffer.readInt8(0)).toBe(127);
    });

    test("should write min byte", () => {
      const buffer = BufferHelpers.writeByte(-128);
      expect(buffer.readInt8(0)).toBe(-128);
    });

    test("should read byte", () => {
      const buffer = Buffer.from([0x2a]);
      const { value, bytesRead } = BufferHelpers.readByte(buffer);
      expect(value).toBe(42);
      expect(bytesRead).toBe(1);
    });

    test("should round-trip", () => {
      const testValues = [0, 1, -1, 127, -128, 42, -42];
      testValues.forEach((val) => {
        const buffer = BufferHelpers.writeByte(val);
        const { value } = BufferHelpers.readByte(buffer);
        expect(value).toBe(val);
      });
    });
  });

  describe("UByte", () => {
    test("should write unsigned byte", () => {
      const buffer = BufferHelpers.writeUByte(255);
      expect(buffer.readUInt8(0)).toBe(255);
    });

    test("should read unsigned byte", () => {
      const buffer = Buffer.from([0xff]);
      const { value } = BufferHelpers.readUByte(buffer);
      expect(value).toBe(255);
    });

    test("should round-trip", () => {
      const testValues = [0, 1, 127, 128, 255];
      testValues.forEach((val) => {
        const buffer = BufferHelpers.writeUByte(val);
        const { value } = BufferHelpers.readUByte(buffer);
        expect(value).toBe(val);
      });
    });
  });

  describe("Short", () => {
    test("should write positive short", () => {
      const buffer = BufferHelpers.writeShort(12345);
      expect(buffer.readInt16BE(0)).toBe(12345);
    });

    test("should write negative short", () => {
      const buffer = BufferHelpers.writeShort(-12345);
      expect(buffer.readInt16BE(0)).toBe(-12345);
    });

    test("should write max short", () => {
      const buffer = BufferHelpers.writeShort(32767);
      expect(buffer.readInt16BE(0)).toBe(32767);
    });

    test("should write min short", () => {
      const buffer = BufferHelpers.writeShort(-32768);
      expect(buffer.readInt16BE(0)).toBe(-32768);
    });

    test("should read short", () => {
      const buffer = Buffer.allocUnsafe(2);
      buffer.writeInt16BE(12345);
      const { value, bytesRead } = BufferHelpers.readShort(buffer);
      expect(value).toBe(12345);
      expect(bytesRead).toBe(2);
    });

    test("should round-trip", () => {
      const testValues = [0, 1, -1, 32767, -32768, 12345, -12345];
      testValues.forEach((val) => {
        const buffer = BufferHelpers.writeShort(val);
        const { value } = BufferHelpers.readShort(buffer);
        expect(value).toBe(val);
      });
    });
  });

  describe("Int", () => {
    test("should write positive int", () => {
      const buffer = BufferHelpers.writeInt(123456789);
      expect(buffer.readInt32BE(0)).toBe(123456789);
    });

    test("should write negative int", () => {
      const buffer = BufferHelpers.writeInt(-123456789);
      expect(buffer.readInt32BE(0)).toBe(-123456789);
    });

    test("should write max int", () => {
      const buffer = BufferHelpers.writeInt(2147483647);
      expect(buffer.readInt32BE(0)).toBe(2147483647);
    });

    test("should write min int", () => {
      const buffer = BufferHelpers.writeInt(-2147483648);
      expect(buffer.readInt32BE(0)).toBe(-2147483648);
    });

    test("should read int with offset", () => {
      const buffer = Buffer.allocUnsafe(8);
      buffer.writeInt32BE(12345, 4);
      const { value } = BufferHelpers.readInt(buffer, 4);
      expect(value).toBe(12345);
    });

    test("should round-trip", () => {
      const testValues = [0, 1, -1, 2147483647, -2147483648, 123456789];
      testValues.forEach((val) => {
        const buffer = BufferHelpers.writeInt(val);
        const { value } = BufferHelpers.readInt(buffer);
        expect(value).toBe(val);
      });
    });
  });

  describe("Long", () => {
    test("should write positive long", () => {
      const buffer = BufferHelpers.writeLong(123456789n);
      expect(buffer.readBigInt64BE(0)).toBe(123456789n);
    });

    test("should write negative long", () => {
      const buffer = BufferHelpers.writeLong(-123456789n);
      expect(buffer.readBigInt64BE(0)).toBe(-123456789n);
    });

    test("should accept number input", () => {
      const buffer = BufferHelpers.writeLong(123456789);
      expect(buffer.readBigInt64BE(0)).toBe(123456789n);
    });

    test("should read long", () => {
      const buffer = Buffer.allocUnsafe(8);
      buffer.writeBigInt64BE(123456789n);
      const { value, bytesRead } = BufferHelpers.readLong(buffer);
      expect(value).toBe(123456789n);
      expect(bytesRead).toBe(8);
    });

    test("should round-trip", () => {
      const testValues = [
        0n,
        1n,
        -1n,
        9223372036854775807n,
        -9223372036854775808n,
      ];
      testValues.forEach((val) => {
        const buffer = BufferHelpers.writeLong(val);
        const { value } = BufferHelpers.readLong(buffer);
        expect(value).toBe(val);
      });
    });
  });

  describe("Float", () => {
    test("should write float", () => {
      const buffer = BufferHelpers.writeFloat(3.14159);
      expect(buffer.readFloatBE(0)).toBeCloseTo(3.14159, 5);
    });

    test("should write negative float", () => {
      const buffer = BufferHelpers.writeFloat(-2.71828);
      expect(buffer.readFloatBE(0)).toBeCloseTo(-2.71828, 5);
    });

    test("should read float", () => {
      const buffer = Buffer.allocUnsafe(4);
      buffer.writeFloatBE(3.14159);
      const { value, bytesRead } = BufferHelpers.readFloat(buffer);
      expect(value).toBeCloseTo(3.14159, 5);
      expect(bytesRead).toBe(4);
    });

    test("should round-trip", () => {
      const testValues = [0.0, 1.0, -1.0, 3.14159, -2.71828, 123.456];
      testValues.forEach((val) => {
        const buffer = BufferHelpers.writeFloat(val);
        const { value } = BufferHelpers.readFloat(buffer);
        expect(value).toBeCloseTo(val, 5);
      });
    });
  });

  describe("Double", () => {
    test("should write double", () => {
      const buffer = BufferHelpers.writeDouble(3.141592653589793);
      expect(buffer.readDoubleBE(0)).toBe(3.141592653589793);
    });

    test("should write negative double", () => {
      const buffer = BufferHelpers.writeDouble(-2.718281828459045);
      expect(buffer.readDoubleBE(0)).toBe(-2.718281828459045);
    });

    test("should read double", () => {
      const buffer = Buffer.allocUnsafe(8);
      buffer.writeDoubleBE(3.141592653589793);
      const { value, bytesRead } = BufferHelpers.readDouble(buffer);
      expect(value).toBe(3.141592653589793);
      expect(bytesRead).toBe(8);
    });

    test("should round-trip", () => {
      const testValues = [
        0.0, 1.0, -1.0, 3.141592653589793, -2.718281828459045,
      ];
      testValues.forEach((val) => {
        const buffer = BufferHelpers.writeDouble(val);
        const { value } = BufferHelpers.readDouble(buffer);
        expect(value).toBe(val);
      });
    });
  });

  describe("concat", () => {
    test("should concatenate buffers", () => {
      const buf1 = Buffer.from([0x01, 0x02]);
      const buf2 = Buffer.from([0x03, 0x04]);
      const result = BufferHelpers.concat(buf1, buf2);
      expect(result).toEqual(Buffer.from([0x01, 0x02, 0x03, 0x04]));
    });

    test("should concatenate multiple buffers", () => {
      const buf1 = Buffer.from([0x01]);
      const buf2 = Buffer.from([0x02]);
      const buf3 = Buffer.from([0x03]);
      const result = BufferHelpers.concat(buf1, buf2, buf3);
      expect(result).toEqual(Buffer.from([0x01, 0x02, 0x03]));
    });

    test("should handle empty buffers", () => {
      const buf1 = Buffer.alloc(0);
      const buf2 = Buffer.from([0x01]);
      const result = BufferHelpers.concat(buf1, buf2);
      expect(result).toEqual(Buffer.from([0x01]));
    });
  });

  describe("clone", () => {
    test("should clone buffer", () => {
      const original = Buffer.from([0x01, 0x02, 0x03]);
      const cloned = BufferHelpers.clone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original); // Different reference
    });

    test("should not modify original when clone is modified", () => {
      const original = Buffer.from([0x01, 0x02, 0x03]);
      const cloned = BufferHelpers.clone(original);
      cloned[0] = 0xff;
      expect(original[0]).toBe(0x01);
      expect(cloned[0]).toBe(0xff);
    });
  });
});

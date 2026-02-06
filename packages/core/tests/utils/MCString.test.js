const { MCString } = require("../../src");

describe("MCString", () => {
  describe("encode", () => {
    test("should encode empty string", () => {
      const result = MCString.encode("");
      expect(result[0]).toBe(0x00); // Length = 0
      expect(result.length).toBe(1);
    });

    test("should encode simple string", () => {
      const result = MCString.encode("Hello");
      const expected = Buffer.concat([
        Buffer.from([0x05]), // Length = 5
        Buffer.from("Hello", "utf8"),
      ]);
      expect(result).toEqual(expected);
    });

    test("should encode UTF-8 string", () => {
      const result = MCString.encode("Cześć");
      expect(result.length).toBeGreaterThan(5); // UTF-8 encoding
      expect(result[0]).toBeGreaterThan(5); // Length in bytes
    });

    test("should encode emoji", () => {
      const result = MCString.encode("Hello 🎮");
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(6);
    });

    test("should throw on string too long", () => {
      const longString = "A".repeat(40000);
      expect(() => MCString.encode(longString)).toThrow("exceeds max");
    });

    test("should respect maxLength parameter", () => {
      const str = "A".repeat(100);
      expect(() => MCString.encode(str, 50)).toThrow("exceeds max");
    });

    test("should allow custom maxLength", () => {
      const str = "A".repeat(100);
      const result = MCString.encode(str, 200);
      expect(result).toBeInstanceOf(Buffer);
    });
  });

  describe("decode", () => {
    test("should decode empty string", () => {
      const buffer = Buffer.from([0x00]);
      const result = MCString.decode(buffer);
      expect(result.value).toBe("");
      expect(result.bytesRead).toBe(1);
    });

    test("should decode simple string", () => {
      const buffer = Buffer.concat([
        Buffer.from([0x05]),
        Buffer.from("Hello", "utf8"),
      ]);
      const result = MCString.decode(buffer);
      expect(result.value).toBe("Hello");
      expect(result.bytesRead).toBe(6);
    });

    test("should decode UTF-8 string", () => {
      const buffer = MCString.encode("Cześć");
      const result = MCString.decode(buffer);
      expect(result.value).toBe("Cześć");
    });

    test("should decode emoji", () => {
      const buffer = MCString.encode("Hello 🎮");
      const result = MCString.decode(buffer);
      expect(result.value).toBe("Hello 🎮");
    });

    test("should decode with offset", () => {
      const buffer = Buffer.concat([
        Buffer.from([0xff, 0xff]),
        MCString.encode("Test"),
      ]);
      const result = MCString.decode(buffer, 2);
      expect(result.value).toBe("Test");
    });

    test("should throw on string extends beyond buffer", () => {
      const buffer = Buffer.from([0x10, 0x41, 0x42]); // Length=16, but only 2 bytes
      expect(() => MCString.decode(buffer)).toThrow("extends beyond buffer");
    });
  });

  describe("round-trip", () => {
    const testStrings = [
      "",
      "a",
      "Hello",
      "Hello World!",
      "Test123!@#",
      "Cześć świecie",
      "Hello 🎮🎯🚀",
      "Line1\nLine2",
      "Tab\tSeparated",
      "日本語",
      "Emoji: 😀😁😂🤣",
    ];

    testStrings.forEach((str) => {
      test(`should round-trip "${str.substring(0, 20)}"`, () => {
        const encoded = MCString.encode(str);
        const decoded = MCString.decode(encoded);
        expect(decoded.value).toBe(str);
      });
    });
  });
});

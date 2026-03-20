import { expect, test, describe } from "bun:test";
import { getFlagEmoji, generatePath, type Point } from "./utils";

describe("getFlagEmoji", () => {
  test("returns default flag for empty string", () => {
    expect(getFlagEmoji("")).toBe("🏳️");
  });

  test("returns correct emoji for valid country code (US)", () => {
    expect(getFlagEmoji("US")).toBe("🇺🇸");
  });

  test("returns correct emoji for valid country code (FR)", () => {
    expect(getFlagEmoji("FR")).toBe("🇫🇷");
  });

  test("is case-insensitive", () => {
    expect(getFlagEmoji("us")).toBe("🇺🇸");
    expect(getFlagEmoji("Fr")).toBe("🇫🇷");
  });

  test("handles longer strings by mapping each character", () => {
    // U = 127482, S = 127480, A = 127462
    expect(getFlagEmoji("USA")).toBe(String.fromCodePoint(127482, 127480, 127462));
  });
});

describe("generatePath", () => {
  test("returns default path for empty array", () => {
    expect(generatePath([])).toBe("M0,90");
  });

  test("returns move command for single point", () => {
    const points: Point[] = [{ x: 10, y: 20 }];
    expect(generatePath(points)).toBe("M10,20");
  });

  test("returns line command for two points", () => {
    const points: Point[] = [
      { x: 10, y: 20 },
      { x: 30, y: 40 }
    ];
    expect(generatePath(points)).toBe("M10,20 L30,40");
  });

  test("returns quadratic/bezier curve for multiple points", () => {
    const points: Point[] = [
      { x: 10, y: 20 },
      { x: 30, y: 40 },
      { x: 50, y: 20 }
    ];
    expect(generatePath(points)).toBe("M10,20 Q10,20 20,30 T40,30 T50,20");
  });

  test("handles more than three points correctly", () => {
     const points: Point[] = [
      { x: 0, y: 100 },
      { x: 50, y: 50 },
      { x: 100, y: 100 },
      { x: 150, y: 50 }
    ];
    expect(generatePath(points)).toBe("M0,100 Q0,100 25,75 T75,75 T125,75 T150,50");
  });
});

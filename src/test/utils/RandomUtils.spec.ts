import { describe, it, expect, vi } from "vitest";
import RandomUtils from "@/utils/RandomUtils";
import NumberUtils from "@/utils/NumberUtils";

describe("floatBetween", () => {
  it("returns a random float between the min and max with the precision", () => {
    vi.spyOn(NumberUtils, "toPrecision");
    Math.random = vi.fn(() => 0.5);

    const min = 2;
    const max = 4;
    const precision = 4;
    RandomUtils.floatBetween(min, max, precision);

    expect(NumberUtils.toPrecision).toHaveBeenCalledWith(3, precision);
  });

  it("returns a random float between the min and max with a precision of 2 by default", () => {
    vi.spyOn(NumberUtils, "toPrecision");
    Math.random = vi.fn(() => 0.5);

    const min = 2;
    const max = 4;
    RandomUtils.floatBetween(min, max);

    expect(NumberUtils.toPrecision).toHaveBeenCalledWith(3, 2);
  });
});

describe("integerBetween", () => {
  it("returns a random integer between the min and max", () => {
    Math.random = vi.fn(() => 0.5);

    const min = 2;
    const max = 4;
    RandomUtils.integerBetween(min, max);

    expect(RandomUtils.integerBetween(min, max)).toBe(3);
  });
});

describe("pickAmong", () => {
  it("returns a random element of the list", () => {
    Math.random = vi.fn(() => 0.5);
    vi.spyOn(RandomUtils, "integerBetween");

    const list = [3, 6, 4, 2];
    const result = RandomUtils.pickAmong(list);

    expect(RandomUtils.integerBetween).toBeCalledWith(0, 4);

    expect(result).toBe(list[2]);
  });
});

describe("distinctIntegersBetween", () => {
  it("returns a random list of distinct integers between a min and a max", () => {
    Math.random = vi.fn(() => 0);
    const result = RandomUtils.distinctIntegersBetween(1, 6, 3);
    expect(result).toEqual([2, 3, 4]);
  });

  it("throws an error if the count is too high", () => {
    expect(() => RandomUtils.distinctIntegersBetween(1, 6, 7)).toThrow();
  });
});

import { describe, it, expect } from "vitest";
import { NumberUtils } from "@/utils/NumberUtils";

describe("toPrecision", () => {
  it("rounds to the provided number of digits", () => {
    expect(NumberUtils.toPrecision(3.141592, 2)).toBe(3.1);
  });
});

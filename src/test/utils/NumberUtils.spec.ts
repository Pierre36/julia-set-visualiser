import NumberUtils from "@/utils/NumberUtils";
import { describe, expect, it } from "vitest";

describe("toPrecision", () => {
  it("rounds to the provided number of digits", () => {
    expect(NumberUtils.toPrecision(3.141592, 2)).toBe(3.1);
  });
});

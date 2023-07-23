import { describe, it, expect, vi } from "vitest";

describe("App creation", () => {
  it("does not raise any error", async () => {
    console.error = vi.fn();
    await import("../main");
    expect(console.error).not.toBeCalled();
  });
});

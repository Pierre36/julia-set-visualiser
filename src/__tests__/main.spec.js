import { describe, it, expect, vi } from "vitest";
import { createApp } from "vue";

import App from "../App.vue";

describe("App creation", () => {
  it("creates the app correctly", async () => {
    // Mock createApp and mount
    vi.mock("vue", async () => {
      const actual = await vi.importActual("vue");
      return {
        ...actual,
        createApp: vi.fn(() => ({
          mount: vi.fn(),
        })),
      };
    });

    // Launch the script by importing it
    await import("../main");

    // Check the app has been created
    expect(createApp).toBeCalledWith(App);
  });
});

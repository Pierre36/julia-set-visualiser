import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Configuration from "@/models/Configuration";

import App from "@/App.vue";
import MainHeader from "@/components/MainHeader.vue";
import SideBar from "@/components/SideBar.vue";
import AnimationFrame from "@/components/AnimationFrame.vue";

describe("Render", () => {
  let customConfiguration: Configuration;

  beforeEach(() => {
    customConfiguration = Configuration.emptyConfiguration("", "");
    customConfiguration.juliaHSV = [36, 42, 16];
    localStorage.setItem("customConfiguration", JSON.stringify(customConfiguration.toJSON()));
  });

  it("renders correctly", async () => {
    // Mount the App
    const app = mount(App, { shallow: true });

    // Get the DOM elements
    const header = app.findComponent(MainHeader);
    const sidebar = app.findComponent(SideBar);
    const animationFrame = app.findComponent(AnimationFrame);

    // Check the header renders properly
    const expectedCurrentConfiguration = Configuration.defaultConfiguration();
    expect(header.vm.$props.configuration).toEqual(expectedCurrentConfiguration);
    expect(sidebar.vm.$props.configuration).toEqual(expectedCurrentConfiguration);
    expect(animationFrame.vm.$props.configuration).toEqual(expectedCurrentConfiguration);
  });
});

describe("Interactions", () => {
  let customConfiguration;

  beforeEach(() => {
    customConfiguration = Configuration.emptyConfiguration("", "");
    customConfiguration.juliaHSV = [36, 42, 16];
    localStorage.setItem("customConfiguration", JSON.stringify(customConfiguration.toJSON()));
  });

  it("changes the selected configuration when the header emits event", async () => {
    // Mount the App
    const app = mount(App, { shallow: true });

    // Get the DOM elements
    const header = app.findComponent(MainHeader);
    const sidebar = app.findComponent(SideBar);
    const animationFrame = app.findComponent(AnimationFrame);

    // Make the header emits the event
    const newConfiguration = Configuration.emptyConfiguration("SPECIAL", "Special");
    header.vm.$emit("update:configuration", newConfiguration);
    await app.vm.$nextTick();

    // Check the configuration is updated
    expect(header.vm.$props.configuration).toEqual(newConfiguration);
    expect(sidebar.vm.$props.configuration).toEqual(newConfiguration);
    expect(animationFrame.vm.$props.configuration).toEqual(newConfiguration);
  });
});

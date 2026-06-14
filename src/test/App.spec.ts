import Configuration from "@/models/Configuration";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import App from "@/App.vue";
import AnimationFrame from "@/components/animation/AnimationFrame.vue";
import MainHeader from "@/components/layout/MainHeader.vue";
import SideBar from "@/components/layout/SideBar.vue";

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

import { describe, it, expect, beforeEach, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { Configuration } from "../models/Configuration";

import App from "../App.vue";
import MainHeader from "../components/MainHeader.vue";
import SideBar from "../components/SideBar.vue";
import AnimationFrame from "../components/AnimationFrame.vue";

vi.mock("../assets/configurations.json", () => {
  return {
    default: [Configuration.defaultConfiguration("SPECIAL", "Special").toJSON()],
  };
});

describe("Render", () => {
  let customConfiguration;

  beforeEach(() => {
    customConfiguration = Configuration.emptyConfiguration("", "");
    customConfiguration.juliaHSV = [36, 42, 16];
    localStorage.setItem("customConfiguration", JSON.stringify(customConfiguration.toJSON()));
  });

  it("renders correctly when local storage is empty", async () => {
    // Clear the local storage
    localStorage.clear();

    // Mount the App
    const app = mount(App, { shallow: true });
    await flushPromises();

    // Get the DOM elements
    const header = app.findComponent(MainHeader);
    const sidebar = app.findComponent(SideBar);
    const animationFrame = app.findComponent(AnimationFrame);

    // Check the header renders properly
    expect(header.vm.$props.configurations).toEqual({
      DEFAULT: Configuration.defaultConfiguration(),
      CUSTOM: Configuration.emptyConfiguration("CUSTOM", "Custom"),
      SPECIAL: Configuration.defaultConfiguration("SPECIAL", "Special"),
    });
    expect(header.vm.$props.selectedConfigurationId).toBe("DEFAULT");
    const expectedCurrentConfiguration = Configuration.defaultConfiguration("", "");
    expect(header.vm.$props.configuration).toEqual(expectedCurrentConfiguration);

    // Check the sidebar renders correctly
    expect(sidebar.vm.$props.configuration).toEqual(expectedCurrentConfiguration);

    // Check the animation frame renders correctly
    expect(animationFrame.vm.$props.configuration).toEqual(expectedCurrentConfiguration);
  });

  it("renders correctly when local storage is not empty", async () => {
    // Mount the App
    const app = mount(App, { shallow: true });
    await flushPromises();

    // Get the DOM elements
    const header = app.findComponent(MainHeader);
    const sidebar = app.findComponent(SideBar);
    const animationFrame = app.findComponent(AnimationFrame);

    // Check the header renders properly
    const customConfigurationForOption = Configuration.emptyConfiguration("CUSTOM", "Custom");
    customConfigurationForOption.fillWith(customConfiguration);
    expect(header.vm.$props.configurations).toEqual({
      DEFAULT: Configuration.defaultConfiguration(),
      CUSTOM: customConfigurationForOption,
      SPECIAL: Configuration.defaultConfiguration("SPECIAL", "Special"),
    });
    expect(header.vm.$props.selectedConfigurationId).toBe("CUSTOM");
    const expectedCurrentConfiguration = customConfiguration;
    expect(header.vm.$props.configuration).toEqual(expectedCurrentConfiguration);

    // Check the sidebar renders correctly
    expect(sidebar.vm.$props.configuration).toEqual(expectedCurrentConfiguration);

    // Check the animation frame renders correctly
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

  it("switch to custom configuration when the sidebar emits event ", async () => {
    // Clear session storage to have DEFAULT selected
    localStorage.clear();

    // Mount the App
    const app = mount(App, { shallow: true });
    await flushPromises();

    // Get DOM elements
    const sidebar = app.findComponent(SideBar);
    const header = app.findComponent(MainHeader);

    // Make the sidebar emits the event
    sidebar.vm.$emit("change");
    await app.vm.$nextTick();

    // Check the selected configuration is updated
    expect(header.vm.$props.selectedConfigurationId).toBe("CUSTOM");
  });

  it("changes the selected configuration when the header emits event", async () => {
    // Mount the App
    const app = mount(App, { shallow: true });
    await flushPromises();

    // Make the header emits the event
    const header = app.findComponent(MainHeader);
    const newSelectedId = "SPECIAL";
    header.vm.$emit("update:selectedConfigurationId", newSelectedId);
    await app.vm.$nextTick();

    // Check the configuration is updated
    expect(header.vm.$props.selectedConfigurationId).toBe(newSelectedId);
    const expectedCurrentConfiguration = Configuration.emptyConfiguration("", "");
    expectedCurrentConfiguration.fillWith(Configuration.defaultConfiguration());
    expect(header.vm.$props.configuration).toEqual(expectedCurrentConfiguration);
  });
});

// Handles change in sidebar

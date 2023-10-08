import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { Configuration } from "../../models/Configuration";

import SidePanel from "../SidePanel.vue";
import FunctionPanel from "../FunctionPanel.vue";
import ColorsPanel from "../ColorsPanel.vue";
import AdvancedSettingsPanel from "../AdvancedSettingsPanel.vue";
import RandomPanel from "../RandomPanel.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    props = {
      currentPanel: "COLORS",
      configuration: Configuration.defaultConfiguration(),
      collapsed: false,
    };
  });

  it("renders properly when collapsed", () => {
    // Mount the SidePanel
    props.collapsed = true;
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Check nothing is displayed
    const panelContainer = sidePanel.find("#side-panel");
    expect(panelContainer.isVisible()).toBe(false);
  });

  it("renders properly when expanded", () => {
    // Mount the SidePanel
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the panel container
    const panelContainer = sidePanel.find("#side-panel");

    // Check the panel container is rendered correctly
    expect(panelContainer.exists()).toBe(true);
    expect(panelContainer.attributes().class).toBe(props.currentPanel);
    expect(panelContainer.attributes().role).toBe("tabpanel");
  });

  it("renders properly the FUNCTION panel", () => {
    // Mount the SidePanel
    props.currentPanel = "FUNCTION";
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the panels
    const panelContainer = sidePanel.find("#side-panel");
    const functionPanel = panelContainer.findComponent(FunctionPanel);
    const colorsPanel = panelContainer.findComponent(ColorsPanel);
    const advancedPanel = panelContainer.findComponent(AdvancedSettingsPanel);
    const randomPanel = panelContainer.findComponent(RandomPanel);

    // Check only the FUNCTION panel is displayed
    expect(functionPanel.isVisible()).toBe(true);
    expect(colorsPanel.isVisible()).toBe(false);
    expect(advancedPanel.isVisible()).toBe(false);
    expect(randomPanel.isVisible()).toBe(false);

    // Check the FUNCTION panel is rendered properly
    expect(functionPanel.vm.$props.fractalFunction).toEqual(props.configuration.fractalFunction);
  });

  it("renders properly the COLORS panel", () => {
    // Mount the SidePanel
    props.currentPanel = "COLORS";
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the panels
    const panelContainer = sidePanel.find("#side-panel");
    const functionPanel = panelContainer.findComponent(FunctionPanel);
    const colorsPanel = panelContainer.findComponent(ColorsPanel);
    const advancedPanel = panelContainer.findComponent(AdvancedSettingsPanel);
    const randomPanel = panelContainer.findComponent(RandomPanel);

    // Check only the COLORS panel is displayed
    expect(functionPanel.isVisible()).toBe(false);
    expect(colorsPanel.isVisible()).toBe(true);
    expect(advancedPanel.isVisible()).toBe(false);
    expect(randomPanel.isVisible()).toBe(false);

    // Check the COLORS panel is rendered properly
    expect(colorsPanel.vm.$props.juliaHSV).toEqual(props.configuration.juliaHSV);
    expect(colorsPanel.vm.$props.defaultAttractor).toEqual(props.configuration.defaultAttractor);
    expect(colorsPanel.vm.$props.infinityAttractor).toEqual(props.configuration.infinityAttractor);
    expect(colorsPanel.vm.$props.attractors).toEqual(props.configuration.attractors);
  });

  it("renders properly the ADVANCED panel", () => {
    // Mount the SidePanel
    props.currentPanel = "ADVANCED";
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the panels
    const panelContainer = sidePanel.find("#side-panel");
    const functionPanel = panelContainer.findComponent(FunctionPanel);
    const colorsPanel = panelContainer.findComponent(ColorsPanel);
    const advancedPanel = panelContainer.findComponent(AdvancedSettingsPanel);
    const randomPanel = panelContainer.findComponent(RandomPanel);

    // Check only the ADVANCED panel is displayed
    expect(functionPanel.isVisible()).toBe(false);
    expect(colorsPanel.isVisible()).toBe(false);
    expect(advancedPanel.isVisible()).toBe(true);
    expect(randomPanel.isVisible()).toBe(false);

    // Check the ADVANCED panel is rendered properly
    expect(advancedPanel.vm.$props.configuration).toEqual(props.configuration);
  });

  it("renders properly the RANDOM panel", () => {
    // Mount the SidePanel
    props.currentPanel = "RANDOM";
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the panels
    const panelContainer = sidePanel.find("#side-panel");
    const functionPanel = panelContainer.findComponent(FunctionPanel);
    const colorsPanel = panelContainer.findComponent(ColorsPanel);
    const advancedPanel = panelContainer.findComponent(AdvancedSettingsPanel);
    const randomPanel = panelContainer.findComponent(RandomPanel);

    // Check only the ADVANCED panel is displayed
    expect(functionPanel.isVisible()).toBe(false);
    expect(colorsPanel.isVisible()).toBe(false);
    expect(advancedPanel.isVisible()).toBe(false);
    expect(randomPanel.isVisible()).toBe(true);

    // Check the ADVANCED panel is rendered properly
    expect(randomPanel.vm.$props.configuration).toEqual(props.configuration);
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    props = {
      currentPanel: "COLORS",
      configuration: Configuration.defaultConfiguration(),
      collapsed: false,
    };
  });

  it("emits change the FUNCTION panel emits change", () => {
    // Mount the SidePanel
    props.currentPanel = "FUNCTION";
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the FUNCTION panel
    const panelContainer = sidePanel.find("#side-panel");
    const functionPanel = panelContainer.findComponent(FunctionPanel);

    // Make FUNCTION panel emit change and check the SidePanel emits change
    functionPanel.vm.$emit("change");
    expect(sidePanel.emitted().change).toBeDefined();
  });

  it("emits change the COLORS panel emits change", () => {
    // Mount the SidePanel
    props.currentPanel = "COLORS";
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the COLORS panel
    const panelContainer = sidePanel.find("#side-panel");
    const colorsPanel = panelContainer.findComponent(ColorsPanel);

    // Make COLORS panel emit change and check the SidePanel emits change
    colorsPanel.vm.$emit("change");
    expect(sidePanel.emitted().change).toBeDefined();
  });

  it("emits change the ADVANCED panel emits change", () => {
    // Mount the SidePanel
    props.currentPanel = "ADVANCED";
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the ADVANCED panel
    const panelContainer = sidePanel.find("#side-panel");
    const advancedPanel = panelContainer.findComponent(AdvancedSettingsPanel);

    // Make ADVANCED panel emit change and check the SidePanel emits change
    advancedPanel.vm.$emit("change");
    expect(sidePanel.emitted().change).toBeDefined();
  });

  it("emits change the RANDOM panel emits change", () => {
    // Mount the SidePanel
    props.currentPanel = "RANDOM";
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the ADVANCED panel
    const panelContainer = sidePanel.find("#side-panel");
    const randomPanel = panelContainer.findComponent(RandomPanel);

    // Make ADVANCED panel emit change and check the SidePanel emits change
    randomPanel.vm.$emit("change");
    expect(sidePanel.emitted().change).toBeDefined();
  });
});

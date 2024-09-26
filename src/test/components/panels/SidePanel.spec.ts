import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Configuration from "@/models/Configuration";
import SidePanel, { type Props } from "@/components/panels/SidePanel.vue";
import FunctionPanel from "@/components/panels/FunctionPanel.vue";
import ColoursPanel from "@/components/panels/ColoursPanel.vue";
import AdvancedSettingsPanel from "@/components/panels/AdvancedSettingsPanel.vue";
import RandomPanel from "@/components/panels/RandomPanel.vue";
import PanelId from "@/components/panels/PanelId";
import FractalFunction from "@/models/FractalFunction";
import Polynomial from "@/models/Polynomial";
import Complex from "@/models/Complex";
import FunctionTypes from "@/constants/FunctionTypes";
import Attractor from "@/models/Attractor";

interface TestProps extends Props {
  configuration: Configuration;
}

let props: TestProps;

const currentPanel = PanelId.COLOURS;
const configuration = Configuration.defaultConfiguration();
const collapsed = false;

describe("Render", () => {
  beforeEach(() => {
    props = { currentPanel, configuration: configuration.copy(), collapsed };
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
    expect(panelContainer.attributes().role).toBe("tabpanel");
  });

  it("renders properly the FUNCTION panel", () => {
    // Mount the SidePanel
    props.currentPanel = PanelId.FUNCTION;
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the panels
    const panelContainer = sidePanel.find("#side-panel");
    const functionPanel = panelContainer.findComponent(FunctionPanel);
    const coloursPanel = panelContainer.findComponent(ColoursPanel);
    const advancedPanel = panelContainer.findComponent(AdvancedSettingsPanel);
    const randomPanel = panelContainer.findComponent(RandomPanel);

    // Check only the FUNCTION panel is displayed
    expect(functionPanel.isVisible()).toBe(true);
    expect(coloursPanel.isVisible()).toBe(false);
    expect(advancedPanel.isVisible()).toBe(false);
    expect(randomPanel.isVisible()).toBe(false);

    // Check the FUNCTION panel is rendered properly
    expect(functionPanel.vm.$props.fractalFunction).toEqual(props.configuration.fractalFunction);
  });

  it("renders properly the COLOURS panel", () => {
    // Mount the SidePanel
    props.currentPanel = PanelId.COLOURS;
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the panels
    const panelContainer = sidePanel.find("#side-panel");
    const functionPanel = panelContainer.findComponent(FunctionPanel);
    const coloursPanel = panelContainer.findComponent(ColoursPanel);
    const advancedPanel = panelContainer.findComponent(AdvancedSettingsPanel);
    const randomPanel = panelContainer.findComponent(RandomPanel);

    // Check only the COLOURS panel is displayed
    expect(functionPanel.isVisible()).toBe(false);
    expect(coloursPanel.isVisible()).toBe(true);
    expect(advancedPanel.isVisible()).toBe(false);
    expect(randomPanel.isVisible()).toBe(false);

    // Check the COLOURS panel is rendered properly
    expect(coloursPanel.vm.$props.juliaHSV).toEqual(props.configuration.juliaHSV);
    expect(coloursPanel.vm.$props.defaultAttractor).toEqual(props.configuration.defaultAttractor);
    expect(coloursPanel.vm.$props.infinityAttractor).toEqual(props.configuration.infinityAttractor);
    expect(coloursPanel.vm.$props.attractors).toEqual(props.configuration.attractors);
  });

  it("renders properly the ADVANCED panel", () => {
    // Mount the SidePanel
    props.currentPanel = PanelId.ADVANCED;
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the panels
    const panelContainer = sidePanel.find("#side-panel");
    const functionPanel = panelContainer.findComponent(FunctionPanel);
    const coloursPanel = panelContainer.findComponent(ColoursPanel);
    const advancedPanel = panelContainer.findComponent(AdvancedSettingsPanel);
    const randomPanel = panelContainer.findComponent(RandomPanel);

    // Check only the ADVANCED panel is displayed
    expect(functionPanel.isVisible()).toBe(false);
    expect(coloursPanel.isVisible()).toBe(false);
    expect(advancedPanel.isVisible()).toBe(true);
    expect(randomPanel.isVisible()).toBe(false);

    // Check the ADVANCED panel is rendered properly
    expect(advancedPanel.vm.$props.configuration).toEqual(props.configuration);
  });

  it("renders properly the RANDOM panel", () => {
    // Mount the SidePanel
    props.currentPanel = PanelId.RANDOM;
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the panels
    const panelContainer = sidePanel.find("#side-panel");
    const functionPanel = panelContainer.findComponent(FunctionPanel);
    const coloursPanel = panelContainer.findComponent(ColoursPanel);
    const advancedPanel = panelContainer.findComponent(AdvancedSettingsPanel);
    const randomPanel = panelContainer.findComponent(RandomPanel);

    // Check only the ADVANCED panel is displayed
    expect(functionPanel.isVisible()).toBe(false);
    expect(coloursPanel.isVisible()).toBe(false);
    expect(advancedPanel.isVisible()).toBe(false);
    expect(randomPanel.isVisible()).toBe(true);

    // Check the ADVANCED panel is rendered properly
    expect(randomPanel.vm.$props.configuration).toEqual(props.configuration);
  });
});

describe("Interactions", () => {
  beforeEach(() => {
    props = { currentPanel, configuration: configuration.copy(), collapsed };
  });

  it("emits change the FUNCTION panel emits change", () => {
    // Mount the SidePanel
    props.currentPanel = PanelId.FUNCTION;
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the FUNCTION panel
    const panelContainer = sidePanel.find("#side-panel");
    const functionPanel = panelContainer.findComponent(FunctionPanel);

    // Make FUNCTION panel emit change and check the configuration is updated
    const newFractalFunction = new FractalFunction(
      new Polynomial({ 0: new Complex(3, 6) }),
      FunctionTypes.DEFAULT
    );
    functionPanel.vm.$emit("update:fractalFunction", newFractalFunction);
    expect(props.configuration.fractalFunction).toEqual(newFractalFunction);
  });

  it("emits change the COLOURS panel emits change", () => {
    // Mount the SidePanel
    props.currentPanel = PanelId.COLOURS;
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the COLOURS panel
    const panelContainer = sidePanel.find("#side-panel");
    const coloursPanel = panelContainer.findComponent(ColoursPanel);

    // Make COLOURS panel emit changes
    const newJuliaHSV = [1, 2, 3];
    const newDefaultAttractor = new Attractor(undefined, 1, 2, 3, 4, 5);
    const newInfinityAttractor = new Attractor(undefined, 6, 7, 8, 9, 10);
    const newAttractors = [new Attractor(new Complex(4, 2), 11, 12, 13, 14, 15)];
    coloursPanel.vm.$emit("update:juliaHSV", newJuliaHSV);
    coloursPanel.vm.$emit("update:defaultAttractor", newDefaultAttractor);
    coloursPanel.vm.$emit("update:infinityAttractor", newInfinityAttractor);
    coloursPanel.vm.$emit("update:attractors", newAttractors);

    // Check the configuration is updated
    expect(props.configuration.juliaHSV).toEqual(newJuliaHSV);
    expect(props.configuration.defaultAttractor).toEqual(newDefaultAttractor);
    expect(props.configuration.infinityAttractor).toEqual(newInfinityAttractor);
    expect(props.configuration.attractors).toEqual(newAttractors);
  });

  it("emits change the ADVANCED panel emits change", () => {
    // Mount the SidePanel
    props.currentPanel = PanelId.ADVANCED;
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the ADVANCED panel
    const panelContainer = sidePanel.find("#side-panel");
    const advancedPanel = panelContainer.findComponent(AdvancedSettingsPanel);

    // Make ADVANCED panel emit change and check the configuration is updated
    const newConfiguration = Configuration.emptyConfiguration("test", "test");
    advancedPanel.vm.$emit("update:configuration", newConfiguration);
    expect(sidePanel.emitted()["update:configuration"]).toEqual([[newConfiguration]]);
  });

  it("emits change the RANDOM panel emits change", () => {
    // Mount the SidePanel
    props.currentPanel = PanelId.RANDOM;
    const sidePanel = mount(SidePanel, { props: props, shallow: true });

    // Get the ADVANCED panel
    const panelContainer = sidePanel.find("#side-panel");
    const randomPanel = panelContainer.findComponent(RandomPanel);

    // Make ADVANCED panel emit change and check the configuration is updated
    const newConfiguration = Configuration.emptyConfiguration("test", "test");
    randomPanel.vm.$emit("update:configuration", newConfiguration);
    expect(sidePanel.emitted()["update:configuration"]).toEqual([[newConfiguration]]);
  });
});

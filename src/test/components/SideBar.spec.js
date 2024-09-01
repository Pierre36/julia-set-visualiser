import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { Configuration } from "@/models/Configuration";

import SideBar from "@/components/SideBar.vue";
import SidePanel from "@/components/SidePanel.vue";
import SideNav from "@/components/SideNav.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    // Prepare props
    props = {
      configuration: Configuration.defaultConfiguration(),
    };

    // Clear local storage
    localStorage.clear();
  });

  it("renders the SidePanel correctly", () => {
    // Mount SideBar
    const sidebar = mount(SideBar, { props: props, shallow: true });

    // Find DOM elements
    const sidePanel = sidebar.findComponent(SidePanel);

    // Check sidePanel renders correctly
    expect(sidePanel.vm.$props.collapsed).toBe(true);
    expect(sidePanel.vm.$props.currentPanel).toBe("FUNCTION");
    expect(sidePanel.vm.$props.configuration).toEqual(props.configuration);
  });

  it("renders the SideNav correctly", () => {
    // Mount SideBar
    const sidebar = mount(SideBar, { props: props, shallow: true });

    // Find DOM elements
    const nav = sidebar.find("#sidenav");
    const sideNav = nav.findComponent(SideNav);

    // Check sideNav renders correctly
    expect(sideNav.vm.$props.currentPanel).toBe("FUNCTION");
    expect(sideNav.vm.$props.panels.map((panel) => ({ id: panel.id, name: panel.name }))).toEqual([
      { id: "FUNCTION", name: "Function" },
      { id: "COLORS", name: "Colors" },
      { id: "ADVANCED", name: "Advanced settings" },
      { id: "RANDOM", name: "Randomize" },
    ]);
    expect(sideNav.vm.$props.sidePanelCollapsed).toBe(true);
    expect(sideNav.vm.$props.label).toBe("Settings panels");
  });

  it("renders the expand button correctly", () => {
    // Mount SideBar
    const sidebar = mount(SideBar, { props: props, shallow: true });

    // Find DOM elements
    const nav = sidebar.find("#sidenav");
    const expandButton = nav.find(".expand-button");

    // Check expand button renders correctly
    expect(expandButton.attributes().role).toBe("button");
    expect(expandButton.attributes()["aria-expanded"]).toBe("false");
    expect(expandButton.attributes()["aria-controls"]).toBe("side-panel");
    expect(expandButton.find("svg").find("title").text()).toBe("Expand side panel");
  });

  it("renders correctly when the local storage contains sidePanelCollapsed true", () => {
    // Prepare local storage
    localStorage.setItem("sidePanelCollapsed", true);

    // Mount SideBar
    const sidebar = mount(SideBar, { props: props, shallow: true });

    // Find DOM elements
    const nav = sidebar.find("#sidenav");
    const sideNav = nav.findComponent(SideNav);
    const expandButton = nav.find(".expand-button");
    const sidePanel = sidebar.findComponent(SidePanel);

    // Check sideNav renders correctly
    expect(sideNav.vm.$props.sidePanelCollapsed).toBe(true);

    // Check expand button renders correctly
    expect(expandButton.attributes()["aria-expanded"]).toBe("false");
    expect(expandButton.find("svg").find("title").text()).toBe("Expand side panel");

    // Check sidePanel renders correctly
    expect(sidePanel.vm.$props.collapsed).toBe(true);
  });

  it("renders correctly when the local storage contains sidePanelCollapsed false", () => {
    // Prepare local storage
    localStorage.setItem("sidePanelCollapsed", false);

    // Mount SideBar
    const sidebar = mount(SideBar, { props: props, shallow: true });

    // Find DOM elements
    const nav = sidebar.find("#sidenav");
    const sideNav = nav.findComponent(SideNav);
    const expandButton = nav.find(".expand-button");
    const sidePanel = sidebar.findComponent(SidePanel);

    // Check sideNav renders correctly
    expect(sideNav.vm.$props.sidePanelCollapsed).toBe(false);

    // Check expand button renders correctly
    expect(expandButton.attributes()["aria-expanded"]).toBe("true");
    expect(expandButton.find("svg").find("title").text()).toBe("Collapse side panel");

    // Check sidePanel renders correctly
    expect(sidePanel.vm.$props.collapsed).toBe(false);
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    // Prepare props
    props = {
      configuration: Configuration.defaultConfiguration(),
    };

    // Clear local storage
    localStorage.clear();
  });

  it("emits change when SidePanel emits change", () => {
    // Mount SideBar
    const sidebar = mount(SideBar, { props: props, shallow: true });

    // Make sidePanel emit change
    const sidePanel = sidebar.findComponent(SidePanel);
    sidePanel.vm.$emit("change");

    // Check SideBar emits change
    expect(sidebar.emitted().change).toBeDefined();
  });

  it("expands the sidePanel when SideNav emits collapse event", async () => {
    // Mount SideBar
    const sidebar = mount(SideBar, { props: props, shallow: true });

    // Find DOM elements
    const nav = sidebar.find("#sidenav");
    const sideNav = nav.findComponent(SideNav);
    const sidePanel = sidebar.findComponent(SidePanel);

    // Make sideNav emit event and check the sidePanel and localStorage are updated
    sideNav.vm.$emit("update:sidePanelCollapsed");
    await sidebar.vm.$nextTick();
    expect(sidePanel.vm.$props.collapsed).toBe(false);
    expect(localStorage.getItem("sidePanelCollapsed")).toBe("false");
  });

  it("changes the current panel when SideNav emits corresponding event", async () => {
    // Mount SideBar
    const sidebar = mount(SideBar, { props: props, shallow: true });

    // Find DOM elements
    const nav = sidebar.find("#sidenav");
    const sideNav = nav.findComponent(SideNav);
    const sidePanel = sidebar.findComponent(SidePanel);

    // Make sideNav emit event and check the sidePanel is updated
    const newPanel = "COLORS";
    sideNav.vm.$emit("update:currentPanel", newPanel);
    await sidebar.vm.$nextTick();
    expect(sidePanel.vm.$props.currentPanel).toBe(newPanel);
  });

  it("expands the sidePanel when the expand button is clicked", async () => {
    // Mount SideBar
    const sidebar = mount(SideBar, { props: props, shallow: true });

    // Find DOM elements
    const nav = sidebar.find("#sidenav");
    const expandButton = nav.find(".expand-button");
    const sidePanel = sidebar.findComponent(SidePanel);

    // Click expand button and check the sidePanel and localStorage are updated
    await expandButton.trigger("click");
    expect(sidePanel.vm.$props.collapsed).toBe(false);
    expect(localStorage.getItem("sidePanelCollapsed")).toBe("false");
  });
});

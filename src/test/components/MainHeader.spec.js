import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { Configuration } from "@/models/Configuration";

import MainHeader from "@/components/MainHeader.vue";
import ComboBox from "@/components/ComboBox.vue";
import Toast from "@/components/Toast.vue";

describe("Render", () => {
  let props;

  beforeEach(() => {
    // Prepare the props
    props = {
      configurations: {
        DEFAULT: Configuration.defaultConfiguration(),
        CUSTOM: Configuration.emptyConfiguration("CUSTOM", "Custom"),
        SPECIAL: Configuration.defaultConfiguration("SPECIAL", "Special"),
      },
      selectedConfigurationId: "DEFAULT",
      configuration: Configuration.emptyConfiguration("", ""),
    };

    // Clear the local storage
    localStorage.clear();
  });

  it("renders correctly", () => {
    // Mount the MainHeader
    const mainHeader = mount(MainHeader, { props: props, shallow: true });

    // Get DOM elements
    const logo = mainHeader.find(".logo");
    const heading = mainHeader.find("h1");
    const combobox = mainHeader.findComponent(ComboBox);
    const buttons = mainHeader.findAll("button");
    const saveButton = buttons[0];
    const downloadButton = buttons[1];
    const toasts = mainHeader.findAllComponents(Toast);
    const saveToast = toasts[0];
    const downloadToast = toasts[1];

    // Check the logo is rendered correctly
    expect(logo.attributes().src).toBe("/logo.svg");

    // Check the heading is rendered correctly
    expect(heading.text()).toBe("Julia Set Visualizer");

    // Check the combobox is rendered correctly
    expect(combobox.vm.$props.options).toEqual([
      { id: "DEFAULT", text: "Default" },
      { id: "CUSTOM", text: "Custom" },
      { id: "SPECIAL", text: "Special" },
    ]);
    expect(combobox.vm.$props.selected).toBe(props.selectedConfigurationId);
    expect(combobox.vm.$props.label).toBe("Configuration");

    // Check the save button is rendered correctly
    expect(saveButton.text()).toBe("Save");
    expect(saveButton.attributes().disabled).toBeDefined();

    // Check the save Toast is rendered correctly
    expect(saveToast.vm.$props.text).toBe("Custom configuration saved!");
    expect(saveToast.vm.$props.animationDuration).toBe(500);
    expect(saveToast.vm.$props.displayDuration).toBe(1500);

    // Check the download button is rendered correctly
    expect(downloadButton.text()).toBe("Download");
    expect(downloadButton.attributes().disabled).toBeDefined();

    // Check the download Toast is rendered correctly
    expect(downloadToast.vm.$props.text).toBe("Custom configuration downloaded!");
    expect(downloadToast.vm.$props.animationDuration).toBe(500);
    expect(downloadToast.vm.$props.displayDuration).toBe(1500);
  });

  it("enables the save and download buttons when the selected configuration is CUSTOM", () => {
    // Mount the MainHeader
    props.selectedConfigurationId = "CUSTOM";
    const mainHeader = mount(MainHeader, { props: props, shallow: true });

    // Check the save button is enable
    const buttons = mainHeader.findAll("button");
    const saveButton = buttons[0];
    expect(saveButton.attributes().disabled).toBeUndefined();

    // Check the download button is enable
    const downloadButton = buttons[1];
    expect(downloadButton.attributes().disabled).toBeUndefined();
  });
});

describe("Interactions", () => {
  let props;

  beforeEach(() => {
    props = {
      configurations: {
        DEFAULT: Configuration.defaultConfiguration(),
        CUSTOM: Configuration.emptyConfiguration("CUSTOM", "Custom"),
        SPECIAL: Configuration.defaultConfiguration("SPECIAL", "Special"),
      },
      selectedConfigurationId: "DEFAULT",
      configuration: Configuration.emptyConfiguration("", ""),
    };
  });

  it("saves the configuration when the save button is clicked", () => {
    // Mount the MainHeader
    props.selectedConfigurationId = "CUSTOM";
    const mainHeader = mount(MainHeader, { props: props, shallow: true });

    // Get DOM elements
    const saveButton = mainHeader.findAll("button")[0];
    const saveToast = mainHeader.findAllComponents(Toast)[0];

    // Change the configuration
    props.configuration.juliaHSV = [36, 42, 16];

    // Mock the toast show
    saveToast.vm.show = vi.fn();

    // Click the saveButton
    saveButton.trigger("click");

    // Check the configuration is saved
    expect(localStorage.getItem("customConfiguration")).toBe(
      JSON.stringify(props.configuration.toJSON())
    );
    expect(saveToast.vm.show).toBeCalled();
    const expectedConfiguration = Configuration.emptyConfiguration("CUSTOM", "Custom");
    expectedConfiguration.fillWith(props.configuration);
    expect(props.configurations["CUSTOM"]).toEqual(expectedConfiguration);
  });

  it("downloads the configuration when the download button is clicked", () => {
    // Mount the MainHeader
    props.selectedConfigurationId = "CUSTOM";
    const mainHeader = mount(MainHeader, { props: props, shallow: true });

    // Get DOM elements
    const downloadButton = mainHeader.findAll("button")[1];
    const downloadToast = mainHeader.findAllComponents(Toast)[1];

    // Mock jsdom missing functions
    window.URL.createObjectURL = vi.fn(() => "url");
    window.URL.revokeObjectURL = vi.fn();

    // Mock the toast show
    downloadToast.vm.show = vi.fn();

    // Click the saveButton
    downloadButton.trigger("click");

    // Check the configuration is downloaded
    expect(downloadToast.vm.show).toBeCalled();
  });

  it("emits selection change event when the combobox is updated", () => {
    // Mount the MainHeader
    const mainHeader = mount(MainHeader, { props: props, shallow: true });

    // Updates the combobox
    const combobox = mainHeader.findComponent(ComboBox);
    const newConfigId = "SPECIAL";
    combobox.vm.$emit("update:selected", newConfigId);

    // Check the right event is emitted
    expect(mainHeader.emitted()["update:selectedConfigurationId"]).toEqual([[newConfigId]]);
  });
});

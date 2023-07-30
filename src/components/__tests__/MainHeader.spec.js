import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { Configuration } from "../../models/Configuration";

import MainHeader from "../MainHeader.vue";
import ComboBox from "../ComboBox.vue";
import Toast from "../Toast.vue";

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
    const saveButton = mainHeader.find("button");
    const toast = mainHeader.findComponent(Toast);

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

    // Check the Toast is rendered correctly
    expect(toast.vm.$props.text).toBe("Custom configuration saved");
    expect(toast.vm.$props.animationDuration).toBe(500);
    expect(toast.vm.$props.displayDuration).toBe(1500);
  });

  it("enables the save button when the selected configuration is CUSTOM", () => {
    // Mount the MainHeader
    props.selectedConfigurationId = "CUSTOM";
    const mainHeader = mount(MainHeader, { props: props, shallow: true });

    // Check the save button is enable
    const saveButton = mainHeader.find("button");
    expect(saveButton.attributes().disabled).toBeUndefined();
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
    const saveButton = mainHeader.find("button");
    const toast = mainHeader.findComponent(Toast);

    // Change the configuration
    props.configuration.juliaHSV = [36, 42, 16];

    // Mock the toast show
    toast.vm.show = vi.fn();

    // Click the saveButton
    saveButton.trigger("click");

    // Check the configuration is saved
    expect(localStorage.getItem("customConfiguration")).toBe(
      JSON.stringify(props.configuration.toJSON())
    );
    expect(toast.vm.show).toBeCalled();
    const expectedConfiguration = Configuration.emptyConfiguration("CUSTOM", "Custom");
    expectedConfiguration.fillWith(props.configuration);
    expect(props.configurations["CUSTOM"]).toEqual(expectedConfiguration);
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

// Change selected configuration

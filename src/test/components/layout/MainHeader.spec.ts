import { describe, it, expect, beforeEach, vi } from "vitest";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";
import Configuration from "@/models/Configuration";
import MainHeader from "@/components/layout/MainHeader.vue";
import ComboBox from "@/components/primitives/ComboBox.vue";
import NotificationToast from "@/components/primitives/NotificationToast.vue";

interface TestProps {
  configuration: Configuration;
}

let props: TestProps;

let jsonConfigurations: any[] = [];
vi.mock("@/configurations.json", () => ({ default: jsonConfigurations }));

describe("Render", () => {
  beforeEach(() => {
    props = { configuration: Configuration.defaultConfiguration() };
    jsonConfigurations = [Configuration.defaultConfiguration("SPECIAL", "Special").toJSON()];
    localStorage.clear();
  });

  it("renders correctly", async () => {
    // Mount the MainHeader
    const mainHeader = mount(MainHeader, { props: props, shallow: true });
    await flushPromises();

    // Get DOM elements
    const logo = mainHeader.find(".logo");
    const heading = mainHeader.find("h1");
    // @ts-ignore
    const combobox: VueWrapper<ComboBox> = mainHeader.findComponent(ComboBox);
    const buttons = mainHeader.findAll("button");
    const saveButton = buttons[0];
    const downloadButton = buttons[1];
    const toasts = mainHeader.findAllComponents(NotificationToast);
    const saveToast = toasts[0];
    const downloadToast = toasts[1];

    // Check the logo is rendered correctly
    expect(logo.attributes().src).toBe("/logo.svg");

    // Check the heading is rendered correctly
    expect(heading.text()).toBe("Julia Set Visualizer");

    // Check the combobox is rendered correctly
    expect(combobox.vm.$props.label).toBe("Configuration");

    // Check the save button is rendered correctly
    expect(saveButton.text()).toBe("Save");
    expect(saveButton.attributes().disabled).toBeDefined();

    // Check the save NotificationToast is rendered correctly
    expect(saveToast.vm.$props.text).toBe("Custom configuration saved!");
    expect(saveToast.vm.$props.animationDuration).toBe(500);
    expect(saveToast.vm.$props.displayDuration).toBe(1500);

    // Check the download button is rendered correctly
    expect(downloadButton.text()).toBe("Download");
    expect(downloadButton.attributes().disabled).toBeDefined();

    // Check the download NotificationToast is rendered correctly
    expect(downloadToast.vm.$props.text).toBe("Custom configuration downloaded!");
    expect(downloadToast.vm.$props.animationDuration).toBe(500);
    expect(downloadToast.vm.$props.displayDuration).toBe(1500);
  });

  it("renders correctly when the locale storage is empty", async () => {
    // Mount the MainHeader
    const mainHeader = mount(MainHeader, { props: props, shallow: true });
    await flushPromises();

    // Get DOM elements
    // @ts-ignore
    const combobox: VueWrapper<ComboBox> = mainHeader.findComponent(ComboBox);

    expect(combobox.vm.$props.options).toContainEqual({ id: "DEFAULT", text: "Default" });
    expect(combobox.vm.$props.options).toContainEqual({ id: "SPECIAL", text: "Special" });
    expect(combobox.vm.$props.selected).toBe("DEFAULT");
  });

  it("renders correctly when the locale storage has a configuration", async () => {
    // Mount the MainHeader
    localStorage.setItem(
      "custom_configuration",
      JSON.stringify(Configuration.emptyConfiguration("", "").toJSON())
    );
    const mainHeader = mount(MainHeader, { props: props, shallow: true });
    await flushPromises();

    // Get DOM elements
    // @ts-ignore
    const combobox: VueWrapper<ComboBox> = mainHeader.findComponent(ComboBox);

    expect(combobox.vm.$props.options).toContainEqual({ id: "DEFAULT", text: "Default" });
    expect(combobox.vm.$props.options).toContainEqual({ id: "SPECIAL", text: "Special" });
    expect(combobox.vm.$props.options).toContainEqual({ id: "CUSTOM", text: "Custom" });
    expect(combobox.vm.$props.selected).toBe("CUSTOM");
  });

  it("renders correctly when the locale storage has an invalid configuration", async () => {
    // Mount the MainHeader
    localStorage.setItem("custom_configuration", JSON.stringify({ invalid: "invalid" }));
    const mainHeader = mount(MainHeader, { props: props, shallow: true });
    await flushPromises();

    // Get DOM elements
    // @ts-ignore
    const combobox: VueWrapper<ComboBox> = mainHeader.findComponent(ComboBox);

    expect(combobox.vm.$props.options).toContainEqual({ id: "DEFAULT", text: "Default" });
    expect(combobox.vm.$props.options).toContainEqual({ id: "SPECIAL", text: "Special" });
    expect(combobox.vm.$props.selected).toBe("DEFAULT");
  });

  it("enables the save and download buttons when the selected configuration is CUSTOM", async () => {
    // Mount the MainHeader
    localStorage.setItem(
      "custom_configuration",
      JSON.stringify(Configuration.emptyConfiguration("", "").toJSON())
    );
    const mainHeader = mount(MainHeader, { props: props, shallow: true });
    await flushPromises();

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
  beforeEach(() => {
    props = { configuration: Configuration.emptyConfiguration("", "") };
    jsonConfigurations = [Configuration.defaultConfiguration("SPECIAL", "Special").toJSON()];
    localStorage.clear();
  });

  it("saves the configuration when the save button is clicked", async () => {
    // Mount the MainHeader
    const customConfiguration = Configuration.emptyConfiguration("", "");
    localStorage.setItem("custom_configuration", JSON.stringify(customConfiguration.toJSON()));
    const mainHeader = mount(MainHeader, { props: props, shallow: true });
    await flushPromises();

    // Get DOM elements
    const saveButton = mainHeader.findAll("button")[0];
    const saveToast = mainHeader.findAllComponents(NotificationToast)[0];

    // Mock the toast show
    saveToast.vm.show = vi.fn();

    // Click the saveButton
    await saveButton.trigger("click");

    // Check the configuration is saved
    const savedConfiguration = customConfiguration.copy();
    savedConfiguration.id = "CUSTOM";
    savedConfiguration.name = "Custom";
    expect(localStorage.getItem("custom_configuration")).toBe(
      JSON.stringify(savedConfiguration.toJSON())
    );
    expect(saveToast.vm.show).toBeCalled();
  });

  it("downloads the configuration when the download button is clicked", async () => {
    // Mount the MainHeader
    const customConfiguration = Configuration.emptyConfiguration("", "");
    localStorage.setItem("custom_configuration", JSON.stringify(customConfiguration.toJSON()));
    const mainHeader = mount(MainHeader, { props: props, shallow: true });
    await flushPromises();

    // Get DOM elements
    const downloadButton = mainHeader.findAll("button")[1];
    const downloadToast = mainHeader.findAllComponents(NotificationToast)[1];

    // Mock jsdom missing functions
    window.URL.createObjectURL = vi.fn(() => "url");
    window.URL.revokeObjectURL = vi.fn();

    // Mock the toast show
    downloadToast.vm.show = vi.fn();

    // Click the saveButton
    await downloadButton.trigger("click");

    // Check the configuration is downloaded
    expect(downloadToast.vm.show).toBeCalled();
  });

  it("emits selection change event when the combobox is updated", async () => {
    // Mount the MainHeader
    const mainHeader = mount(MainHeader, { props: props, shallow: true });
    await flushPromises();

    // Updates the combobox
    // @ts-ignore
    const combobox: VueWrapper<ComboBox> = mainHeader.findComponent(ComboBox);
    const newConfigId = "SPECIAL";
    await combobox.vm.$emit("update:selected", newConfigId);
    await flushPromises();

    // Check the right event is emitted
    expect(mainHeader.emitted()["update:configuration"]).toEqual([
      [Configuration.defaultConfiguration("SPECIAL", "Special")],
    ]);
    expect(combobox.vm.$props.selected).toBe("SPECIAL");
  });

  it("switches to custom whenever the configuration changes", async () => {
    // Mount the MainHeader
    const mainHeader = mount(MainHeader, { props: props, shallow: true });
    await flushPromises();

    // Updates the combobox
    // @ts-ignore
    const combobox: VueWrapper<ComboBox> = mainHeader.findComponent(ComboBox);
    const newConfigId = "SPECIAL";
    combobox.vm.$emit("update:selected", newConfigId);
    await mainHeader.vm.$nextTick();

    // Update the configuration
    const newConfiguration = Configuration.defaultConfiguration("SPECIAL", "Special");
    newConfiguration.epsilon = 36;
    mainHeader.setProps({ configuration: newConfiguration });
    await mainHeader.vm.$nextTick();

    // Check the selected config has changed
    expect(combobox.vm.$props.selected).toBe("CUSTOM");

    // Check the selected config is renamed "Custom"
    expect(mainHeader.vm.$props.configuration.name).toBe("Custom");
  });
});

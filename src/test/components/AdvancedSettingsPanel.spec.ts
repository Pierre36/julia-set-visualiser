import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { config, mount } from "@vue/test-utils";
import Configuration from "@/models/Configuration";
import Complex from "@/models/Complex";
import AdvancedSettingsPanel from "@/components/AdvancedSettingsPanel.vue";
import ExpandableDisclosure from "@/components/ExpandableDisclosure.vue";
import NumberInput from "@/components/NumberInput.vue";
import ComplexInput from "@/components/ComplexInput.vue";

interface TestProps {
  configuration: Configuration;
}

let props: TestProps;

beforeAll(() => {
  config.global.renderStubDefaultSlot = true;
});

afterAll(() => {
  config.global.renderStubDefaultSlot = false;
});

describe("Render", () => {
  beforeEach(() => {
    props = { configuration: Configuration.defaultConfiguration() };
  });

  it("renders the header correctly", () => {
    // Mount the AdvancedSettingsPanel
    const advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const header = advancedPanel.find("header");
    const disclosure = header.findComponent(ExpandableDisclosure);

    // Check the header renders correctly
    expect(disclosure.vm.$props.headingCentred).toBe(true);
    expect(disclosure.vm.$props.headingLevel).toBe(2);
    expect(disclosure.vm.$props.headingText).toBe("Advanced settings");
  });

  it("renders the viewport section correctly", () => {
    // Mount the AdvancedSettingsPanel
    const advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = advancedPanel.find(".panel-content");
    const viewportSection = content.find("section:nth-of-type(1)");
    const disclosure = viewportSection.findComponent(ExpandableDisclosure);
    const sectionContent = viewportSection.find(".content");
    const subHeadings = sectionContent.findAll("h4");
    const numberInputs = sectionContent.findAllComponents(NumberInput);
    const complexInput = sectionContent.findComponent(ComplexInput);

    // Check the info header renders correctly
    expect(disclosure.vm.$props.headingCentred).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(3);
    expect(disclosure.vm.$props.headingText).toBe("Viewport");

    // Check the resolution part renders correctly
    expect(subHeadings[0].text()).toBe("Resolution");
    expect(numberInputs[0].vm.$props.value).toBe(props.configuration.resolutionScale);
    expect(numberInputs[0].vm.$props.min).toBe(0);
    expect(numberInputs[0].vm.$props.max).toBeUndefined();
    expect(numberInputs[0].vm.$props.step).toBe(0.1);
    expect(numberInputs[0].vm.$props.isIntegerOnly).toBe(false);
    expect(numberInputs[0].vm.$props.label).toBe("Resolution");

    // Check the coordinates scale part renders correctly
    expect(subHeadings[1].text()).toBe("Scale");
    expect(numberInputs[1].vm.$props.value).toBe(props.configuration.coordinatesScale);
    expect(numberInputs[1].vm.$props.min).toBe(0);
    expect(numberInputs[1].vm.$props.max).toBeUndefined();
    expect(numberInputs[1].vm.$props.step).toBe(0.1);
    expect(numberInputs[1].vm.$props.isIntegerOnly).toBe(false);
    expect(numberInputs[1].vm.$props.label).toBe("Coordinates scale");

    // Check the coordinates centre part renders correctly
    expect(subHeadings[2].text()).toBe("Centre");
    expect(complexInput.vm.$props.complex).toEqual(props.configuration.coordinatesCentre);
    expect(complexInput.vm.$props.label).toBe("Coordinates centre");
  });

  it("renders the computation section correctly", () => {
    // Mount the AdvancedSettingsPanel
    const advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = advancedPanel.find(".panel-content");
    const computationSection = content.find("section:nth-of-type(2)");
    const disclosure = computationSection.findComponent(ExpandableDisclosure);
    const sectionContent = computationSection.find(".content");
    const subHeadings = sectionContent.findAll("h4");
    const numberInputs = sectionContent.findAllComponents(NumberInput);

    // Check the info header renders correctly
    expect(disclosure.vm.$props.headingCentred).toBe(false);
    expect(disclosure.vm.$props.headingLevel).toBe(3);
    expect(disclosure.vm.$props.headingText).toBe("Computation");

    // Check the iteration part renders correctly
    expect(subHeadings[0].text()).toBe("Iterations");
    expect(numberInputs[0].vm.$props.value).toBe(props.configuration.iterationsCount);
    expect(numberInputs[0].vm.$props.min).toBe(1);
    expect(numberInputs[0].vm.$props.max).toBeUndefined();
    expect(numberInputs[0].vm.$props.step).toBe(1);
    expect(numberInputs[0].vm.$props.isIntegerOnly).toBe(true);
    expect(numberInputs[0].vm.$props.wrongInputMessage).toBe(
      "Please enter a valid number of iterations"
    );
    expect(numberInputs[0].vm.$props.label).toBe("Number of iterations");

    // Check the epsilon part renders correctly
    expect(subHeadings[1].text()).toBe("Epsilon");
    expect(numberInputs[1].vm.$props.value).toBe(props.configuration.epsilon);
    expect(numberInputs[1].vm.$props.min).toBe(0);
    expect(numberInputs[1].vm.$props.max).toBeUndefined();
    expect(numberInputs[1].vm.$props.step).toBe(0.000001);
    expect(numberInputs[1].vm.$props.isIntegerOnly).toBe(false);
    expect(numberInputs[1].vm.$props.label).toBe("Epsilon");

    // Check the Julia bound part renders correctly
    expect(subHeadings[2].text()).toBe("Julia bound");
    expect(numberInputs[2].vm.$props.value).toBe(props.configuration.juliaBound);
    expect(numberInputs[2].vm.$props.min).toBeUndefined();
    expect(numberInputs[2].vm.$props.max).toBeUndefined();
    expect(numberInputs[2].vm.$props.step).toBe(0.1);
    expect(numberInputs[2].vm.$props.isIntegerOnly).toBe(false);
    expect(numberInputs[2].vm.$props.label).toBe("Julia bound");
  });
});

describe("Interactions", () => {
  beforeEach(() => {
    props = { configuration: Configuration.defaultConfiguration() };
  });

  it("changes the resolution when updating the resolution input", () => {
    // Mount the AdvancedSettingsPanel
    const advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = advancedPanel.find(".panel-content");
    const viewportSection = content.find("section:nth-of-type(1)");
    const sectionContent = viewportSection.find(".content");
    const resolutionInput = sectionContent.findAllComponents(NumberInput)[0];

    // Update the resolution input and check the resolution changes
    const newResolution = 0.36;
    resolutionInput.vm.$emit("update:value", newResolution);
    expect(props.configuration.resolutionScale).toBe(newResolution);
  });

  it("changes the coordinates scale when updating the scale input", () => {
    // Mount the AdvancedSettingsPanel
    const advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = advancedPanel.find(".panel-content");
    const viewportSection = content.find("section:nth-of-type(1)");
    const sectionContent = viewportSection.find(".content");
    const scaleInput = sectionContent.findAllComponents(NumberInput)[1];

    // Update the scale input and check the coordinates scale changes
    const newScale = 0.36;
    scaleInput.vm.$emit("update:value", newScale);
    expect(props.configuration.coordinatesScale).toBe(newScale);
  });

  it("changes the coordinates centre when updating the centre input", () => {
    // Mount the AdvancedSettingsPanel
    const advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = advancedPanel.find(".panel-content");
    const viewportSection = content.find("section:nth-of-type(1)");
    const sectionContent = viewportSection.find(".content");
    const centreInput = sectionContent.findComponent(ComplexInput);

    // Update the centre input and check the coordinates centre changes
    const newCentre = new Complex(4, 2);
    centreInput.vm.$emit("update:complex", newCentre);
    expect(props.configuration.coordinatesCentre).toBe(newCentre);
  });

  it("changes the number of iterations when updating the iteration input", () => {
    // Mount the AdvancedSettingsPanel
    const advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = advancedPanel.find(".panel-content");
    const computationSection = content.find("section:nth-of-type(2)");
    const sectionContent = computationSection.find(".content");
    const iterationInput = sectionContent.findAllComponents(NumberInput)[0];

    // Update the number of iterations input and check the number of iterations changes
    const newIterationsCount = 36;
    iterationInput.vm.$emit("update:value", newIterationsCount);
    expect(props.configuration.iterationsCount).toBe(newIterationsCount);
  });

  it("changes epsilon when updating the epsilon input", () => {
    // Mount the AdvancedSettingsPanel
    const advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = advancedPanel.find(".panel-content");
    const computationSection = content.find("section:nth-of-type(2)");
    const sectionContent = computationSection.find(".content");
    const epsilonInput = sectionContent.findAllComponents(NumberInput)[1];

    // Update the epsilon input and check the epsilon changes
    const newEpsilon = 0.000036;
    epsilonInput.vm.$emit("update:value", newEpsilon);
    expect(props.configuration.epsilon).toBe(newEpsilon);
  });

  it("changes the Julia bound when updating the Julia bound input", () => {
    // Mount the AdvancedSettingsPanel
    const advancedPanel = mount(AdvancedSettingsPanel, { props: props, shallow: true });

    // Get the DOM elements
    const content = advancedPanel.find(".panel-content");
    const computationSection = content.find("section:nth-of-type(2)");
    const sectionContent = computationSection.find(".content");
    const juliaBoundInput = sectionContent.findAllComponents(NumberInput)[2];

    // Update the Julia bound input and check the Julia bound changes
    const newJuliaBound = -36;
    juliaBoundInput.vm.$emit("update:value", newJuliaBound);
    expect(props.configuration.juliaBound).toBe(newJuliaBound);
  });
});
